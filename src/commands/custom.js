const { db, logAudit } = require('../database');
const { isGlobalOwner } = require('../security/auth');

function createCustomCommand(name, responseTemplate, creatorId) {
  if (!isGlobalOwner(creatorId)) {
    throw new Error('Unauthorized: Only Global Owner can create custom commands.');
  }
  db.prepare('INSERT INTO custom_commands (name, response_template, created_by) VALUES (?, ?, ?) ON CONFLICT(name) DO UPDATE SET response_template = excluded.response_template').run(name, responseTemplate, String(creatorId));
  logAudit(creatorId, 'CUSTOM_COMMAND_CREATE', name, null, { responseTemplate });
  return true;
}

function executeCustomCommand(name, vars = {}) {
  const row = db.prepare('SELECT response_template FROM custom_commands WHERE name = ?').get(name);
  if (!row) return null;
  let text = row.response_template;
  for (const [key, val] of Object.entries(vars)) {
    text = text.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
  }
  return text;
}

module.exports = {
  createCustomCommand,
  executeCustomCommand
};
