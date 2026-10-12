const config = require('./config');
const registry = require('./registry/CommandRegistry');
const { registerAllActions } = require('./commands');
const { buildSlashCommands } = require('./registry/slashCommands');
const musicService = require('./music');
const dashboardServer = require('./dashboard');

console.log(config.asciiLogo);
console.log(`[TANVEER PRIME] Starting up...`);
console.log(`[TANVEER PRIME] Global Owner ID: ${config.project.globalOwnerId}`);

registerAllActions();
buildSlashCommands();

const stats = registry.getStats();
console.log(`[Registry] Implemented Actions: ${stats.totalImplementedActions} (Admin: ${stats.adminActions}, General: ${stats.generalActions})`);
console.log(`[Registry] Slash Commands Prepared: ${stats.registeredSlashCount}`);

musicService.initialize().then(res => {
  console.log(`[Music] Status: ${res.status} - ${res.message}`);
});

const dashRes = dashboardServer.start();
console.log(`[Dashboard] Status: ${dashRes.status}`);

console.log(`[TANVEER PRIME] Initialization Complete.`);
