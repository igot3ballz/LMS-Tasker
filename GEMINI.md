# GEMINI.md - LMS-System-Agent-MCP

## 🎯 Purpose
A high-performance, "God Mode" TypeScript MCP (Model Context Protocol) server providing LM Studio with total control over the local operating system. It enables autonomous agents to read, write, manipulate files, and execute arbitrary shell commands.

## 🏗 Architecture
- **Framework:** `@modelcontextprotocol/sdk` (TypeScript)
- **Runtime:** Node.js (ESModules)
- **Transport:** Stdio (Standard Input/Output)
- **Capabilities (Tools):**
  - `read_file`: Content-addressed file reading.
  - `write_file`: Directory-aware file creation/modification.
  - `list_directory`: Folder structure exploration.
  - `get_file_info`: Metadata retrieval (size, modified dates).
  - `delete_item`: Destructive file and folder removal.
  - `move_item`: Renaming and path shifting.
  - `run_shell_command`: Unrestricted terminal access (PowerShell/Bash).

## 🚀 Status (Phase 2: God Mode Expansion)
- Project transitioned from basic filesystem to full system agent.
- `src/index.ts` expanded with `child_process` execution.
- Build system verified (`npm run build`).

## ⚠️ SECURITY WARNING
By registering this MCP server in LM Studio, you are granting the LLM **unrestricted access** to your local machine. It can delete files, execute malicious commands, and alter system states if prompted to do so. Ensure you only use trusted models and sandboxed prompts when this server is active.

## 🔌 Connection String (LM Studio GUI)
- **Command:** `node`
- **Arguments:** `C:\PROJECTS\LMS-Filesystem-MCP\dist\index.js`
