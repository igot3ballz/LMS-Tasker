# GEMINI.md - LMS-Tasker Roadmap

## 🎯 Purpose
A high-performance system orchestration ecosystem for LM Studio. Replaces the legacy Python version with a unified TypeScript core for both MCP (GUI) and CLI (Autonomous) operations.

## 🚀 Accomplishments (Phase 1: TypeScript Rebirth)
*   **Engine Pivot:** Migrated from Python to Node.js/TypeScript for SDK stability.
*   **God Mode Tools:** Implemented recursive file operations and unrestricted shell execution.
*   **Process Tracking:** Added background process management with PID retrieval and status checks.
*   **Unified Core:** Merged `LMS-Filesystem-MCP` into `LMS-Tasker` as the new standard.
*   **Auto-Installer:** Created `install.js` for one-click LM Studio registry.

## 🏗 Architecture
- **Framework:** `@modelcontextprotocol/sdk` (TypeScript)
- **SDK:** `@lmstudio/sdk` (v1.5.0)
- **Runtime:** Node.js (ESModules)
- **Agent Name:** `Local Jules`

## 🔜 Future Goals
*   **Persistence:** Implement a local database (SQLite) to track long-running task PIDs across system reboots.
*   **Web Orchestration:** Integrate search tools (Brave/Google) to allow the agent to research while it codes.
*   **Self-Updating:** Add a CLI command for the agent to update its own source code when new SDK versions are released.

## 📂 Active Directories
*   **Root:** `C:\PROJECTS\LMS-Tasker`
*   **Source:** `src/`
*   **Build:** `dist/`
