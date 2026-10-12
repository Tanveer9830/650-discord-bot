const path = require('path');
require('dotenv').config();

module.exports = {
  project: {
    name: 'TANVEER PRIME',
    repository: 'DISCORD-500--BOT',
    defaultCreatorName: 'Tanveer',
    discordBranding: 'tanveer5637',
    globalOwnerId: '1131248987173814336'
  },
  asciiLogo: `
╔══════════════════════════════════════════════╗
║                                              ║
║               T A N V E E R                  ║
║                                              ║
║              MADE BY TANVEER                 ║
║             Discord: tanveer5637             ║
║                                              ║
║          SECURE • MODULAR • POWERFUL         ║
║                                              ║
╚══════════════════════════════════════════════╝
`,
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    clientId: process.env.DISCORD_CLIENT_ID || '',
    guildId: process.env.DISCORD_GUILD_ID || null
  },
  database: {
    path: process.env.DATABASE_PATH || path.join(__dirname, '../../data/tanveer_prime.db')
  },
  dashboard: {
    enabled: process.env.ENABLE_DASHBOARD === 'true',
    port: parseInt(process.env.DASHBOARD_PORT || '3000', 10),
    clientSecret: process.env.DASHBOARD_CLIENT_SECRET || '',
    redirectUri: process.env.DASHBOARD_REDIRECT_URI || 'http://localhost:3000/auth/callback',
    sessionSecret: process.env.DASHBOARD_SESSION_SECRET || 'tanveer-prime-secret-session-key'
  },
  lavalink: {
    enabled: process.env.ENABLE_LAVALINK === 'true',
    host: process.env.LAVALINK_HOST || 'localhost',
    port: parseInt(process.env.LAVALINK_PORT || '2333', 10),
    password: process.env.LAVALINK_PASSWORD || 'youshallnotpass'
  }
};
