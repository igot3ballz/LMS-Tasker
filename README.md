# LM Studio System Agent & MCP (Overhaul v2.1)

A high-performance, unified TypeScript ecosystem for LM Studio. This project combines a **"God Mode" MCP Server** for the LM Studio GUI with a standalone **Autonomous Agent** for terminal-based task execution.

## 🚀 Key Features
- **TypeScript Core:** Built with `@lmstudio/sdk` (v1.5.0) for maximum stability.
- **God Mode MCP:** Grants LM Studio GUI direct access to:
  - Recursive file/folder operations.
  - Background process management (PIDs).
  - Unrestricted shell execution (PowerShell/Bash).
- **Standalone Agent (`Local Jules`):** An autonomous terminal agent that uses the same system-level tools.

## 🏗 Project Structure
- `src/index.ts`: The MCP Server (Stdio transport).
- `src/agent.ts`: Core logic for the autonomous agent.
- `src/cli.ts`: Terminal interface to start tasks.
- `install.js`: Automated installer for the LM Studio GUI configuration.

## 🛠 Prerequisites
- **Node.js:** v20+ recommended.
- **LM Studio:** Server must be running on `http://localhost:1234`.

## ⚙️ Installation & Setup

### 1. Build and Install MCP to LM Studio GUI
```bash
npm install
npm run build
node install.js
```
*After running this, restart LM Studio. You will see `LMS-System-Agent-MCP` in the MCP tools section.*

### 2. Run the Autonomous Agent (CLI)
To start a background task directly from your terminal:
```bash
# Example: Create a new project folder and initialize git
node dist/cli.js "Create a folder named 'test_project', initialize git, and write a README"
```

## 🧰 Available Tools
| Tool | Description |
| :--- | :--- |
| `read_file` | Read raw file content. |
| `write_file` | Write content (auto-creates folders). |
| `run_command` | Execute shell commands (Blocking). |
| `start_background_process` | Start long-running tasks (Returns PID). |
| `get_process_status` | Check task status via PID. |
| `complete_task` | Signal when the autonomous goal is met. |

## ⚠️ Security Warning
This tool grants **UNRESTRICTED** access to your local machine. The LLM can delete files, install software, and execute system commands. **Use only with trusted local models.**

## 🤝 Contribution & Git
This project is part of the `C:\PROJECTS` ecosystem. 
To update:
1. Edit `src/*.ts`.
2. `npm run build`.
3. `git commit -am "Update tools" && git push`.
