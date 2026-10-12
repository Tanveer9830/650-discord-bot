const registry = require('../registry/CommandRegistry');

function registerAllActions() {
  for (let i = 1; i <= 180; i++) {
    registry.registerAction({
      id: `admin_action_${i}`,
      name: `Admin Action ${i}`,
      category: 'admin',
      description: `Administrator command action #${i}`,
      registeredInSlash: i <= 30,
      handler: (ctx) => ({ success: true, action: `admin_action_${i}`, ctx })
    });
  }

  for (let i = 1; i <= 520; i++) {
    registry.registerAction({
      id: `general_action_${i}`,
      name: `General Action ${i}`,
      category: 'general',
      description: `General purpose command action #${i}`,
      registeredInSlash: i <= 80,
      handler: (ctx) => ({ success: true, action: `general_action_${i}`, ctx })
    });
  }
}

module.exports = { registerAllActions };
