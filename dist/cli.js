import { SystemAgent } from "./agent.js";
const MODEL = "qwen3.5-24b-a3b-reap-0.32";
const SYSTEM_PROMPT = `
You are 'Local Jules', a high-performance system administrator and developer agent. 
You have direct access to the filesystem and shell via tools.
Use 'run_command' for any shell actions.
Always summarize and use 'complete_task' when you are done.
`;
async function main() {
    const goal = process.argv.slice(2).join(" ");
    if (!goal) {
        console.error("Please provide a goal. Example: node dist/cli.js 'List all files in C:\\PROJECTS'");
        process.exit(1);
    }
    const agent = new SystemAgent(MODEL, SYSTEM_PROMPT);
    await agent.run(goal);
}
main().catch(console.error);
