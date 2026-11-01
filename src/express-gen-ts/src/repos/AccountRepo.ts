import { type AccountEntity } from '#src/entities/Account/index.ts';

import orm from './MockOrm.ts';

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * See if a account with the given id exists.
 */
async function persists(id: string): Promise<boolean> {
  const db = await orm.openDb();
  for (const account of db.accounts) {
    if (account.id === id) return true;
  }
  return false;
}

/**
 * Get all accounts.
 */
async function getAll(): Promise<AccountEntity[]> {
  const db = await orm.openDb();
  return db.accounts.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Get one account.
 */
async function getOne(id: string): Promise<AccountEntity | undefined> {
  const db = await orm.openDb();
  return db.accounts.find( account => account.id === id)
}

/**
 * Add one account.
 */
async function addOne(account: AccountEntity): Promise<void> {
  const db = await orm.openDb();
  db.accounts.push(account);
  return orm.saveDb(db);
}

/**
 * Update a account.
 */
async function updateOne(account: AccountEntity): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.accounts.length; i++) {
    if (db.accounts[i].id === account.id) {
      const dbAccount = db.accounts[i];
      db.accounts[i] = {
        ...dbAccount,
        name: account.name,
        balance: account.balance,
        user: account.user
      };
      return orm.saveDb(db);
    }
  }
}

/**
 * Delete one account.
 */
async function deleteOne(id: string): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.accounts.length; i++) {
    if (db.accounts[i].id === id) {
      db.accounts.splice(i, 1);
      return orm.saveDb(db);
    }
  }
}

// ============================ Unit-tests Only ============================ //

/**
 * Delete every account record.
 *
 * @testOnly
 */
async function deleteAllAccounts(): Promise<void> {
  const db = await orm.openDb();
  db.accounts = [];
  return orm.saveDb(db);
}

/**
 * Insert copies of `account` with fresh ids; the inputs are not modified.
 *
 * @testOnly
 */
async function insertMultiple(
  accounts: AccountEntity[] | readonly AccountEntity[],
): Promise<AccountEntity[]> {
  const db = await orm.openDb();
  db.accounts = [...db.accounts, ...accounts];
  await orm.saveDb(db);
  return [...accounts];
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export const AccountRepoTestOnly = {
  deleteAllAccounts,
  insertMultiple,
} as const;

export default {
  persists,
  getAll,
  addOne,
  updateOne,
  deleteOne,
  getOne,
} as const;
