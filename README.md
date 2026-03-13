# LMS-Tasker v2.2 (Gemini-CLI)

A high-performance system orchestration ecosystem for LM Studio. `LMS-Tasker` has been completely rebuilt in TypeScript to provide a stable, "God Mode" interface for local LLMs to control the operating system.

## 🚀 Key Features
- **Unified Core:** One codebase for both the **MCP Server** (LM Studio GUI) and the **Autonomous CLI Agent**.
- **God Mode Capabilities:**
  - **Full Filesystem Access:** Read, write, move, and recursive delete.
  - **Terminal Access:** Unrestricted PowerShell/Bash execution.
  - **Async Process Management:** Start background tasks and track them via **Process IDs (PIDs)**.
- **Native Stability:** Built on `@lmstudio/sdk` (v1.5.0) for the most reliable local LLM interaction.

## 🏗 Project Structure
- `src/index.ts`: The MCP Server (God Mode for GUI).
- `src/agent.ts`: The Autonomous Agent logic (`Local Jules`).
- `src/cli.ts`: The command-line interface for starting tasks.
- `install.js`: The automated registry script for LM Studio.

## ⚙️ Installation

1. **Install and Build:**
   ```bash
   cd C:\PROJECTS\LMS-Tasker
   npm install
   npm run build
   ```

2. **Register with LM Studio GUI:**
   ```bash
   node install.js
   ```
   *Restart LM Studio to activate the new tools.*

## 🧰 CLI Usage (Autonomous Agent)
Start an autonomous task directly from your shell:
```bash
node dist/cli.js "Create a new Python project called 'FastAPI-Demo', install fastapi and uvicorn, and write a hello world app."
```

## ⚠️ Security Notice
`LMS-Tasker` grants unrestricted access to your machine. It can delete data and execute system-level commands. **Use only with trusted local models and in secure environments.**

## 🤝 Git Strategy
This project is the **Master System Bridge**. 
To update:
1. Modify `src/`.
2. `npm run build`.
3. `git commit -am "Update system capabilities" && git push`.
