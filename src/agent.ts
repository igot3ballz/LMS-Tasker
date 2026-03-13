import { Chat, tool, llm } from "@lmstudio/sdk";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class SystemAgent {
  private model: any;
  private history: any;
  private tools: any[];

  constructor(private modelIdentifier: string, private systemPrompt: string) {
    // @ts-ignore
    this.history = new Chat(this.systemPrompt);
    this.tools = this.initializeTools();
  }

  private initializeTools() {
    return [
      tool({
        name: "read_file",
        description: "Read the content of a file",
        parameters: {
          path: z.string()
        },
        implementation: async ({ path }) => {
          try {
            return await fs.readFile(path, "utf-8");
          } catch (e: any) {
            return `Error: ${e.message}`;
          }
        },
      }),
      tool({
        name: "write_file",
        description: "Write content to a file. Creates directories if needed.",
        parameters: {
          path: z.string(),
          content: z.string()
        },
        implementation: async ({ path: filePath, content }) => {
          try {
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, content, "utf-8");
            return `Successfully wrote to ${filePath}`;
          } catch (e: any) {
            return `Error: ${e.message}`;
          }
        },
      }),
      tool({
        name: "run_command",
        description: "Execute a shell command (Blocking)",
        parameters: {
          command: z.string(),
          cwd: z.string().optional()
        },
        implementation: async ({ command, cwd }) => {
          try {
            const { stdout, stderr } = await execAsync(command, { 
                cwd, 
                shell: process.platform === "win32" ? "powershell.exe" : "/bin/bash" 
            });
            return `STDOUT:\n${stdout}\nSTDERR:\n${stderr}`;
          } catch (e: any) {
            return `Command failed: ${e.message}\nOutput: ${e.stdout}\nError: ${e.stderr}`;
          }
        },
      }),
      tool({
        name: "complete_task",
        description: "Signal when the goal is achieved",
        parameters: {
          summary: z.string()
        },
        implementation: async ({ summary }) => {
          return `TASK COMPLETE: ${summary}`;
        },
      }),
    ];
  }

  async run(goal: string) {
    console.log(`\n--- STARTING TASK: ${goal} ---\n`);
    // @ts-ignore
    this.history.addUserMessage(`GOAL: ${goal}`);
    
    try {
      this.model = await llm(this.modelIdentifier);
      
      let step = 0;
      let finished = false;

      while (step < 15 && !finished) {
        step++;
        console.log(`\n[STEP ${step}] Thinking...`);

        await this.model.act(this.history, { tools: this.tools });
        
        // @ts-ignore
        const lastMessage = this.history.messages[this.history.messages.length - 1];
        if (lastMessage?.content?.includes("TASK COMPLETE")) {
            finished = true;
            console.log("\n[SUCCESS] Agent signaled completion.");
        }
      }

      if (!finished) console.log("\n[TIMEOUT] Reached maximum steps.");

    } catch (error: any) {
      console.error(`\n[FATAL] Agent failed: ${error.message}`);
    }
  }
}
