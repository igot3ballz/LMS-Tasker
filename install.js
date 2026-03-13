import fs from 'fs';
import path from 'path';
import os from 'os';

const MCP_CONFIG_PATH = path.join(os.homedir(), '.lmstudio', 'mcp.json');
const SERVER_PATH = path.join(process.cwd(), 'dist', 'index.js');
const SERVER_NAME = 'LMS-System-Agent-MCP';

async function install() {
  try {
    console.log(`Checking for LM Studio MCP config at: ${MCP_CONFIG_PATH}`);
    
    let config = { mcpServers: {} };
    if (fs.existsSync(MCP_CONFIG_PATH)) {
      const content = fs.readFileSync(MCP_CONFIG_PATH, 'utf-8');
      config = JSON.parse(content);
    } else {
      console.log('mcp.json not found, creating new one...');
      const dir = path.dirname(MCP_CONFIG_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    config.mcpServers = config.mcpServers || {};
    config.mcpServers[SERVER_NAME] = {
      command: 'node',
      args: [SERVER_PATH]
    };

    fs.writeFileSync(MCP_CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log(`Successfully installed '${SERVER_NAME}' to LM Studio!`);
    console.log(`Server Path: ${SERVER_PATH}`);
  } catch (err) {
    console.error(`Installation failed: ${err.message}`);
    process.exit(1);
  }
}

install();
