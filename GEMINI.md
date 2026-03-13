# GEMINI.md - LMS-Tasker Roadmap

## 🎯 Strategic Objective
A unified, high-speed system orchestration bridge between LM Studio and the local OS, enabling autonomous development and administration.

## 🚀 Accomplishments (Phase 2: TypeScript God Mode)
*   **Engine Migration:** Successfully transitioned from Python to TypeScript/Node.js for SDK stability.
*   **Unified Architecture:** Merged `LMS-Filesystem-MCP` into `LMS-Tasker` to handle both Stdio (MCP) and SDK (Agent) transports.
*   **"God Mode" Toolset:**
    *   `run_shell_command`: Unrestricted terminal access.
    *   `start_background_process`: Async execution with PID retrieval.
    *   `get_process_status`: Multi-turn monitoring of background tasks.
    *   `lms_start` / `lms_status`: Environment self-healing.
*   **Auto-Installation:** Created `install.js` for seamless LM Studio GUI registry.
*   **Gemini Bridge:** Fully configured `gemini-extension.json` for CLI orchestration.

## 🏗 Technical Stack
- **Framework:** `@modelcontextprotocol/sdk` (TypeScript)
- **SDK:** `@lmstudio/sdk` (v1.5.0)
- **Runtime:** Node.js (ESModules)
- **Primary Agent:** `Local Jules`

## 🔜 Current Goals
*   **Persistence Layer:** Implement a lightweight local state (SQLite or JSON) to track PIDs across reboots.
*   **Tool Expansion:** Add `git` specialized tools (clone, commit, push) to reduce shell command overhead.
*   **Security Filtering:** Propose a "Safety Profile" system to restrict commands in high-risk environments.

## 📂 Directories
*   **Source:** `src/`
*   **Registry:** `install.js`
*   **Bridge:** `gemini-extension.json`
