const { db, logAudit } = require('../database');

function getBalance(userId) {
  const row = db.prepare('SELECT balance, bank FROM economy WHERE user_id = ?').get(String(userId));
  return row || { balance: 0, bank: 0 };
}

function addBalance(userId, walletAmount = 0, bankAmount = 0) {
  const stmt = db.prepare(`
    INSERT INTO economy (user_id, balance, bank) VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      balance = balance + excluded.balance,
      bank = bank + excluded.bank,
      updated_at = CURRENT_TIMESTAMP
  `);
  stmt.run(String(userId), walletAmount, bankAmount);
  return getBalance(userId);
}

function transferWallet(fromUserId, toUserId, amount) {
  if (amount <= 0) throw new Error('Transfer amount must be greater than zero');
  const transferTx = db.transaction(() => {
    const sender = getBalance(fromUserId);
    if (sender.balance < amount) {
      throw new Error('Insufficient wallet balance');
    }
    db.prepare('UPDATE economy SET balance = balance - ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?').run(amount, String(fromUserId));
    db.prepare(`
      INSERT INTO economy (user_id, balance, bank) VALUES (?, ?, 0)
      ON CONFLICT(user_id) DO UPDATE SET balance = balance + excluded.balance, updated_at = CURRENT_TIMESTAMP
    `).run(String(toUserId), amount);
    logAudit(fromUserId, 'ECONOMY_TRANSFER', toUserId, null, { amount });
  });

  transferTx();
  return { success: true, amount };
}

module.exports = {
  getBalance,
  addBalance,
  transferWallet
};
