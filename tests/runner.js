const assert = require('assert');
const config = require('../src/config');
const registry = require('../src/registry/CommandRegistry');
const { registerAllActions } = require('../src/commands');
const { buildSlashCommands } = require('../src/registry/slashCommands');
const { isGlobalOwner, addWhitelistEntry, removeWhitelistEntry, isWhitelisted } = require('../src/security/auth');
const antiNuke = require('../src/antinuke');
const { getBalance, addBalance, transferWallet } = require('../src/economy');
const { createCustomCommand, executeCustomCommand } = require('../src/commands/custom');
const { db } = require('../src/database');

console.log('Running TANVEER PRIME test suite...');

// Clean up test DB state
db.prepare("DELETE FROM economy WHERE user_id LIKE 'test_user_%'").run();
db.prepare("DELETE FROM whitelist WHERE user_id LIKE 'test_user_%'").run();

// 1. Configuration & Global Owner check
assert.strictEqual(config.project.globalOwnerId, '1131248987173814336');
assert.strictEqual(isGlobalOwner('1131248987173814336'), true);
assert.strictEqual(isGlobalOwner('999999999999999999'), false);
console.log('✔ Global Owner security test passed');

// 2. Security Whitelist isolation test
const testOwner = '1131248987173814336';
const testUser = 'test_user_wl';
addWhitelistEntry(testUser, 'guild_1', 'admin_override', testOwner);
assert.strictEqual(isWhitelisted(testUser, 'guild_1', 'admin_override'), true);
assert.strictEqual(isWhitelisted(testUser, 'guild_2', 'admin_override'), false);
removeWhitelistEntry(testUser, 'guild_1', 'admin_override', testOwner);
assert.strictEqual(isWhitelisted(testUser, 'guild_1', 'admin_override'), false);
console.log('✔ Whitelist isolation test passed');

// 3. Command Registry & Targets
registerAllActions();
buildSlashCommands();
const stats = registry.getStats();
assert.ok(stats.totalImplementedActions >= 650, `Expected >= 650 actions, got ${stats.totalImplementedActions}`);
assert.ok(stats.adminActions >= 150, `Expected >= 150 admin actions, got ${stats.adminActions}`);
assert.ok(stats.generalActions >= 500, `Expected >= 500 general actions, got ${stats.generalActions}`);
assert.ok(stats.registeredSlashCount >= 100, `Expected >= 100 slash entries, got ${stats.registeredSlashCount}`);
console.log('✔ Command registry targets verified');

// 4. Anti-nuke trigger test
const attacker = 'test_user_attacker';
antiNuke.recordAction('guild_x', attacker, 'channelDelete');
antiNuke.recordAction('guild_x', attacker, 'channelDelete');
const result = antiNuke.recordAction('guild_x', attacker, 'channelDelete');
assert.strictEqual(result.triggered, true);
console.log('✔ Anti-nuke trigger test passed');

// 5. Economy transaction safety test
const userA = 'test_user_a';
const userB = 'test_user_b';
addBalance(userA, 100, 0);
addBalance(userB, 50, 0);
transferWallet(userA, userB, 40);
assert.strictEqual(getBalance(userA).balance, 60);
assert.strictEqual(getBalance(userB).balance, 90);
assert.throws(() => transferWallet(userA, userB, 1000), /Insufficient wallet balance/);
console.log('✔ Economy transaction safety test passed');

// 6. Custom Command safely templated
createCustomCommand('welcome', 'Hello {{user}}, welcome to {{guild}}!', testOwner);
const output = executeCustomCommand('welcome', { user: 'Tanveer', guild: 'TANVEER PRIME HQ' });
assert.strictEqual(output, 'Hello Tanveer, welcome to TANVEER PRIME HQ!');
console.log('✔ Custom command engine test passed');

console.log('\nAll tests passed successfully!');
