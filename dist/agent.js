import { lmstudio, Chat, tool } from "@lmstudio/sdk";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);
export class SystemAgent {
    modelIdentifier;
    systemPrompt;
    client;
    model;
    history;
    tools;
    constructor(modelIdentifier, systemPrompt) {
        this.modelIdentifier = modelIdentifier;
        this.systemPrompt = systemPrompt;
        this.history = new Chat(this.systemPrompt);
        this.tools = this.initializeTools();
    }
    initializeTools() {
        return [
            tool({
                name: "read_file",
                description: "Read the content of a file",
                parameters: z.object({ path: z.string() }),
                implementation: async ({ path }) => {
                    try {
                        return await fs.readFile(path, "utf-8");
                    }
                    catch (e) {
                        return `Error: ${e.message}`;
                    }
                },
            }),
            tool({
                name: "write_file",
                description: "Write content to a file. Creates directories if needed.",
                parameters: z.object({ path: z.string(), content: z.string() }),
                implementation: async ({ path: filePath, content }) => {
                    try {
                        await fs.mkdir(path.dirname(filePath), { recursive: true });
                        await fs.writeFile(filePath, content, "utf-8");
                        return `Successfully wrote to ${filePath}`;
                    }
                    catch (e) {
                        return `Error: ${e.message}`;
                    }
                },
            }),
            tool({
                name: "run_command",
                description: "Execute a shell command (Blocking)",
                parameters: z.object({ command: z.string(), cwd: z.string().optional() }),
                implementation: async ({ command, cwd }) => {
                    try {
                        const { stdout, stderr } = await execAsync(command, {
                            cwd,
                            shell: process.platform === "win32" ? "powershell.exe" : "/bin/bash"
                        });
                        return `STDOUT:\n${stdout}\nSTDERR:\n${stderr}`;
                    }
                    catch (e) {
                        return `Command failed: ${e.message}\nOutput: ${e.stdout}\nError: ${e.stderr}`;
                    }
                },
            }),
            tool({
                name: "complete_task",
                description: "Signal when the goal is achieved",
                parameters: z.object({ summary: z.string() }),
                implementation: async ({ summary }) => {
                    return `TASK COMPLETE: ${summary}`;
                },
            }),
        ];
    }
    async run(goal) {
        console.log(`\n--- STARTING TASK: ${goal} ---\n`);
        this.history.add_user_message(`GOAL: ${goal}`);
        try {
            this.model = await lmstudio.llm(this.modelIdentifier);
            let step = 0;
            let finished = false;
            while (step < 15 && !finished) {
                step++;
                console.log(`\n[STEP ${step}] Thinking...`);
                const result = await this.model.act(this.history, { tools: this.tools });
                // Check for task completion in history
                const lastMessage = this.history.messages[this.history.messages.length - 1];
                if (lastMessage?.content?.includes("TASK COMPLETE")) {
                    finished = true;
                    console.log("\n[SUCCESS] Agent signaled completion.");
                }
            }
            if (!finished)
                console.log("\n[TIMEOUT] Reached maximum steps.");
        }
        catch (error) {
            console.error(`\n[FATAL] Agent failed: ${error.message}`);
        }
    }
}
