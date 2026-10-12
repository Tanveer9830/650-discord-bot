const { REST, Routes } = require('discord.js');
const config = require('../config');
const registry = require('./CommandRegistry');
const { buildSlashCommands } = require('./slashCommands');

async function deploySlashCommands() {
  const slashCmds = buildSlashCommands();
  const token = config.discord.token;
  const clientId = config.discord.clientId;

  if (!token || !clientId) {
    return {
      success: false,
      reason: 'Missing DISCORD_TOKEN or DISCORD_CLIENT_ID. Commands are registered locally in registry.'
    };
  }

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    const route = config.discord.guildId
      ? Routes.applicationGuildCommands(clientId, config.discord.guildId)
      : Routes.applicationCommands(clientId);

    const data = await rest.put(route, { body: slashCmds });
    return {
      success: true,
      registeredCount: Array.isArray(data) ? data.length : slashCmds.length
    };
  } catch (error) {
    return {
      success: false,
      reason: error.message
    };
  }
}

module.exports = { deploySlashCommands };
