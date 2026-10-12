const { isWhitelisted, isGlobalOwner } = require('../security/auth');
const { logAudit } = require('../database');

class AntiNukeManager {
  constructor() {
    this.actionLogs = new Map();
    this.thresholds = {
      channelDelete: { limit: 3, windowMs: 10000 },
      roleDelete: { limit: 3, windowMs: 10000 },
      banAdd: { limit: 5, windowMs: 10000 },
      kickAdd: { limit: 5, windowMs: 10000 }
    };
  }

  recordAction(guildId, userId, actionType) {
    if (isGlobalOwner(userId) || isWhitelisted(userId, guildId, 'anti_nuke_bypass')) {
      return { triggered: false, reason: 'Whitelisted user' };
    }

    const key = `${guildId}:${userId}:${actionType}`;
    const now = Date.now();
    const config = this.thresholds[actionType] || { limit: 3, windowMs: 10000 };

    if (!this.actionLogs.has(key)) {
      this.actionLogs.set(key, []);
    }

    const timestamps = this.actionLogs.get(key).filter(ts => now - ts < config.windowMs);
    timestamps.push(now);
    this.actionLogs.set(key, timestamps);

    if (timestamps.length >= config.limit) {
      logAudit(userId, 'ANTI_NUKE_TRIGGERED', userId, guildId, { actionType, count: timestamps.length });
      return {
        triggered: true,
        actionType,
        count: timestamps.length,
        action: 'STAGED_LOCKDOWN'
      };
    }

    return { triggered: false };
  }
}

module.exports = new AntiNukeManager();
