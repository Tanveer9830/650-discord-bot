const config = require('../config');
const { db, logAudit } = require('../database');

function isGlobalOwner(userId) {
  return String(userId) === config.project.globalOwnerId;
}

function addWhitelistEntry(userId, guildId, capability, authorizerId, expiresAt = null) {
  if (!isGlobalOwner(authorizerId)) {
    throw new Error('Unauthorized: Only Global Owner can manage security whitelist.');
  }
  const stmt = db.prepare(`
    INSERT INTO whitelist (user_id, guild_id, capability, authorizer_id, expires_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, guild_id, capability) DO UPDATE SET
      authorizer_id = excluded.authorizer_id,
      expires_at = excluded.expires_at,
      created_at = CURRENT_TIMESTAMP
  `);
  stmt.run(String(userId), String(guildId), capability, String(authorizerId), expiresAt);
  logAudit(authorizerId, 'WHITELIST_ADD', userId, guildId, { capability, expiresAt });
  return true;
}

function removeWhitelistEntry(userId, guildId, capability, authorizerId) {
  if (!isGlobalOwner(authorizerId)) {
    throw new Error('Unauthorized: Only Global Owner can manage security whitelist.');
  }
  const stmt = db.prepare('DELETE FROM whitelist WHERE user_id = ? AND guild_id = ? AND capability = ?');
  const info = stmt.run(String(userId), String(guildId), capability);
  logAudit(authorizerId, 'WHITELIST_REMOVE', userId, guildId, { capability });
  return info.changes > 0;
}

function isWhitelisted(userId, guildId, capability) {
  if (isGlobalOwner(userId)) return true;
  const row = db.prepare(`
    SELECT * FROM whitelist
    WHERE user_id = ? AND guild_id = ? AND capability = ?
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
  `).get(String(userId), String(guildId), capability);
  return !!row;
}

function getWhitelistForGuild(guildId) {
  return db.prepare('SELECT * FROM whitelist WHERE guild_id = ?').all(String(guildId));
}

module.exports = {
  isGlobalOwner,
  addWhitelistEntry,
  removeWhitelistEntry,
  isWhitelisted,
  getWhitelistForGuild
};
