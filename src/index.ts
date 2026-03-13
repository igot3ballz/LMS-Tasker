import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";
import { exec, spawn, ChildProcess } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Track background processes
const backgroundProcesses = new Map<number, { process: ChildProcess, command: string, startTime: Date }>();

const server = new Server(
  {
    name: "lms-system-agent-mcp",
    version: "2.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper to normalize paths
const normalizePath = (p: string) => path.resolve(p);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "read_file",
        description: "Read the complete content of a file",
        inputSchema: {
          type: "object",
          properties: { path: { type: "string" } },
          required: ["path"],
        },
      },
      {
        name: "write_file",
        description: "Write content to a file",
        inputSchema: {
          type: "object",
          properties: { path: { type: "string" }, content: { type: "string" } },
          required: ["path", "content"],
        },
      },
      {
        name: "list_directory",
        description: "List files and folders in a directory",
        inputSchema: {
          type: "object",
          properties: { path: { type: "string" } },
          required: ["path"],
        },
      },
      {
        name: "run_shell_command",
        description: "Execute a shell command and wait for it to finish (Blocking).",
        inputSchema: {
          type: "object",
          properties: {
            command: { type: "string" },
            cwd: { type: "string" }
          },
          required: ["command"],
        },
      },
      {
        name: "start_background_process",
        description: "Start a long-running shell command in the background (Non-blocking). Returns a Process ID (PID).",
        inputSchema: {
          type: "object",
          properties: {
            command: { type: "string", description: "The command to run in the background" },
            cwd: { type: "string", description: "Optional: Working directory" }
          },
          required: ["command"],
        },
      },
      {
        name: "get_process_status",
        description: "Check if a background process is still running using its PID.",
        inputSchema: {
          type: "object",
          properties: {
            pid: { type: "number", description: "The Process ID to check" }
          },
          required: ["pid"],
        },
      },
      {
        name: "stop_process",
        description: "Kill a background process by its PID.",
        inputSchema: {
          type: "object",
          properties: {
            pid: { type: "number", description: "The Process ID to kill" }
          },
          required: ["pid"],
        },
      },
      {
        name: "list_background_processes",
        description: "List all currently active background processes started by this agent.",
        inputSchema: { type: "object", properties: {} },
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "read_file": {
        const filePath = normalizePath(String(args?.path));
        const content = await fs.readFile(filePath, "utf-8");
        return { content: [{ type: "text", text: content }] };
      }

      case "write_file": {
        const filePath = normalizePath(String(args?.path));
        const content = String(args?.content);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content, "utf-8");
        return { content: [{ type: "text", text: `Successfully wrote to ${filePath}` }] };
      }

      case "list_directory": {
        const dirPath = normalizePath(String(args?.path || "."));
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const list = entries.map((e) => `${e.isDirectory() ? "[DIR]" : "[FILE]"} ${e.name}`).join("\n");
        return { content: [{ type: "text", text: list || "Directory is empty" }] };
      }

      case "run_shell_command": {
        const cmd = String(args?.command);
        const cwd = args?.cwd ? normalizePath(String(args.cwd)) : process.cwd();
        const { stdout, stderr } = await execAsync(cmd, { cwd, shell: process.platform === "win32" ? "powershell.exe" : "/bin/bash" });
        return { content: [{ type: "text", text: `STDOUT:\n${stdout}\nSTDERR:\n${stderr}`.trim() }] };
      }

      case "start_background_process": {
        const cmd = String(args?.command);
        const cwd = args?.cwd ? normalizePath(String(args.cwd)) : process.cwd();
        
        const shell = process.platform === "win32" ? "powershell.exe" : "/bin/bash";
        const child = spawn(shell, [process.platform === "win32" ? "-Command" : "-c", cmd], {
          cwd,
          detached: true,
          stdio: 'ignore'
        });

        if (child.pid) {
          backgroundProcesses.set(child.pid, { process: child, command: cmd, startTime: new Date() });
          
          child.on('exit', (code) => {
            console.error(`Background process ${child.pid} exited with code ${code}`);
            if (child.pid) backgroundProcesses.delete(child.pid);
          });

          return { content: [{ type: "text", text: `Background process started. PID: ${child.pid}` }] };
        } else {
          throw new Error("Failed to start background process (no PID returned)");
        }
      }

      case "get_process_status": {
        const pid = Number(args?.pid);
        const exists = backgroundProcesses.has(pid);
        if (exists) {
          const info = backgroundProcesses.get(pid)!;
          return { content: [{ type: "text", text: `Process ${pid} is RUNNING. (Command: ${info.command}, Started: ${info.startTime})` }] };
        }
        
        // Check if process exists in OS but not in our map (might have finished)
        try {
          process.kill(pid, 0);
          return { content: [{ type: "text", text: `Process ${pid} is RUNNING (External to agent or map lost).` }] };
        } catch (e) {
          return { content: [{ type: "text", text: `Process ${pid} is NOT RUNNING.` }] };
        }
      }

      case "stop_process": {
        const pid = Number(args?.pid);
        try {
          process.kill(pid, 'SIGTERM');
          backgroundProcesses.delete(pid);
          return { content: [{ type: "text", text: `Sent SIGTERM to process ${pid}` }] };
        } catch (e: any) {
          return { content: [{ type: "text", text: `Error killing process ${pid}: ${e.message}` }], isError: true };
        }
      }

      case "list_background_processes": {
        if (backgroundProcesses.size === 0) return { content: [{ type: "text", text: "No active background processes." }] };
        const list = Array.from(backgroundProcesses.entries())
          .map(([pid, info]) => `PID: ${pid} | Command: ${info.command} | Started: ${info.startTime.toISOString()}`)
          .join("\n");
        return { content: [{ type: "text", text: list }] };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("LMS System Agent MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
