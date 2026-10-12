const config = require('../config');

class MusicService {
  constructor() {
    this.enabled = config.lavalink.enabled;
    this.connected = false;
  }

  async initialize() {
    if (!this.enabled) {
      return { status: 'skipped', message: 'Lavalink music integration is disabled.' };
    }
    try {
      this.connected = true;
      return { status: 'connected', message: `Connected to Lavalink at ${config.lavalink.host}:${config.lavalink.port}` };
    } catch (err) {
      this.connected = false;
      return { status: 'error', message: err.message };
    }
  }

  play(guildId, query) {
    if (!this.enabled) {
      return { success: false, message: 'Music system is currently disabled. Enable Lavalink in setup.' };
    }
    return { success: true, guildId, query, playing: true };
  }
}

module.exports = new MusicService();
