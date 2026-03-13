# LMS-Tasker v2.2.0 (TypeScript Edition)

A high-performance system orchestration ecosystem for LM Studio. `LMS-Tasker` provides a unified, stable "God Mode" interface for local LLMs to control the operating system through both the **LM Studio GUI (via MCP)** and the **Gemini CLI**.

## 🚀 Key Capabilities
- **Unified Core:** One codebase for both the **MCP Server** and the **Autonomous CLI Agent**.
- **"God Mode" Tools:**
  - **Full Filesystem Access:** Recursive read, write, move, and delete.
  - **Terminal Access:** Unrestricted PowerShell (Windows) or Bash (Linux/Mac) execution.
  - **Async Process Management:** Start long-running background tasks, retrieve **Process IDs (PIDs)**, and check task status asynchronously.
  - **Environment Control:** Check if LM Studio is running (`lms_status`) and auto-start it if it's down (`lms_start`).
- **Native Stability:** Built on `@lmstudio/sdk` (v1.5.0) for the most reliable local LLM interaction.

## 🏗 Project Structure
- `src/index.ts`: The MCP Server (God Mode for GUI).
- `src/agent.ts`: The Autonomous Agent logic (`Local Jules`).
- `src/cli.ts`: The command-line interface for starting tasks.
- `install.js`: The automated registry script for LM Studio.
- `gemini-extension.json`: The bridge configuration for Gemini CLI.

## 🛠 Prerequisites
- **Node.js:** v20 or higher.
- **LM Studio:** Running on `http://localhost:1234` (The agent can auto-start this on Windows).
- **Git:** For source control and updates.

## ⚙️ Installation Guide

### 1. Initial Setup (Universal)
```bash
git clone https://github.com/igot3ballz/LMS-Tasker.git
cd LMS-Tasker
npm install
npm run build
```

### 2. Connect to LM Studio GUI (MCP)
To give the LM Studio Chat GUI direct access to your computer:
```bash
node install.js
```
*Restart LM Studio to activate the `LMS-System-Agent-MCP` tools.*

### 3. Connect to Gemini CLI
To allow Gemini CLI to orchestrate tasks via LM Studio:
```bash
# If already installed, uninstall first:
gemini extensions uninstall lms-tasker

# Install the overhauled version:
gemini extensions install C:\PROJECTS\LMS-Tasker
```

## 🧰 Usage Examples

### Running an Autonomous Task (CLI)
Start an autonomous developer task directly from your shell:
```bash
node dist/cli.js "Create a new Node.js project, install express, and write a server.js file."
```

### Checking Background Tasks (MCP/Agent)
The agent can start a process and move on, checking the PID later:
1. `start_background_process(command: "npm run dev")` -> Returns PID `1234`.
2. `get_process_status(pid: 1234)` -> Returns "RUNNING".

## ⚠️ Security Notice
`LMS-Tasker` grants **unrestricted administrative access** to your machine. It can delete data and execute system-level commands. **Use only with trusted local models and never in an exposed or public environment.**

## 🤝 Development & Updates
To update the system:
1. Modify source in `src/`.
2. `npm run build`.
3. `git commit -am "Update system capabilities" && git push origin main`.
