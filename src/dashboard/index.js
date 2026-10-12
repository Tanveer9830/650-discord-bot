const express = require('express');
const config = require('../config');
const { getSetting, setSetting, logAudit } = require('../database');
const { isGlobalOwner } = require('../security/auth');

class DashboardServer {
  constructor() {
    this.enabled = config.dashboard.enabled;
    this.app = null;
    this.server = null;
  }

  start() {
    if (!this.enabled) {
      return { status: 'skipped', message: 'Dashboard is disabled.' };
    }

    this.app = express();
    this.app.use(express.json());

    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', project: config.project.name, branding: getSetting('creator_name') });
    });

    this.app.post('/api/branding', (req, res) => {
      const { userId, newCreatorName } = req.body;
      if (!isGlobalOwner(userId)) {
        return res.status(403).json({ error: 'Unauthorized: Only Global Owner can update branding.' });
      }
      setSetting('creator_name', newCreatorName);
      logAudit(userId, 'BRANDING_UPDATE', newCreatorName);
      return res.json({ success: true, newCreatorName });
    });

    this.server = this.app.listen(config.dashboard.port, () => {
      console.log(`[Dashboard] Running on port ${config.dashboard.port}`);
    });

    return { status: 'started', port: config.dashboard.port };
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }
}

module.exports = new DashboardServer();
