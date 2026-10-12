const registry = require('./CommandRegistry');

function buildSlashCommands() {
  const commands = [];

  for (let i = 1; i <= 20; i++) {
    commands.push({
      name: `admin_config_${i}`,
      description: `Administrator configuration command entry ${i}`,
      options: [
        { name: 'setting', description: 'Setting key', type: 3, required: false }
      ]
    });
  }

  for (let i = 1; i <= 10; i++) {
    commands.push({
      name: `mod_tools_${i}`,
      description: `Moderation management entry ${i}`,
      options: [
        { name: 'user', description: 'Target user', type: 6, required: false }
      ]
    });
  }

  for (let i = 1; i <= 80; i++) {
    commands.push({
      name: `util_cmd_${i}`,
      description: `General utility slash entry ${i}`,
      options: []
    });
  }

  commands.forEach(cmd => registry.registerSlashEntry(cmd));
  return commands;
}

module.exports = { buildSlashCommands };
