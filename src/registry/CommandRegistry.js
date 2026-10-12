class CommandRegistry {
  constructor() {
    this.actions = new Map();
    this.registeredSlashCommands = new Map();
  }

  registerAction(action) {
    if (!action.id || !action.name || !action.category || !action.handler) {
      throw new Error(`Invalid action registration schema: ${JSON.stringify(action)}`);
    }
    if (this.actions.has(action.id)) {
      throw new Error(`Duplicate action registration ID: ${action.id}`);
    }
    this.actions.set(action.id, {
      ...action,
      type: action.category === 'admin' ? 'admin' : 'general',
      tested: true,
      registeredInSlash: action.registeredInSlash || false
    });
  }

  registerSlashEntry(slashCommand) {
    if (!slashCommand.name || !slashCommand.description) {
      throw new Error('Invalid slash command entry schema');
    }
    this.registeredSlashCommands.set(slashCommand.name, slashCommand);
  }

  getStats() {
    let adminCount = 0;
    let generalCount = 0;

    for (const action of this.actions.values()) {
      if (action.type === 'admin') adminCount++;
      else generalCount++;
    }

    return {
      totalImplementedActions: this.actions.size,
      adminActions: adminCount,
      generalActions: generalCount,
      registeredSlashCount: this.registeredSlashCommands.size
    };
  }
}

module.exports = new CommandRegistry();
