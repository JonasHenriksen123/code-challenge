import { type TransferEntity  } from '#src/entities/Transfer/index.ts';

import orm from './MockOrm.ts';

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * See if a transfer with the given id exists.
 */
async function persists(id: string): Promise<boolean> {
  const db = await orm.openDb();
  for (const account of db.accounts) {
    if (account.id === id) return true;
  }
  return false;
}

/**
 * Get all transfers
 * .
 */
async function getAll(): Promise<TransferEntity[]> {
  const db = await orm.openDb();
  return db.transfers.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Add one transfer.
 */
async function addOne(transfer: TransferEntity): Promise<void> {
  const db = await orm.openDb();
  db.transfers.push(transfer);
  return orm.saveDb(db);
}


// ============================ Unit-tests Only ============================ //

/**
 * Delete every transfer record.
 *
 * @testOnly
 */
async function deleteAllTransfers(): Promise<void> {
  const db = await orm.openDb();
  db.transfers = [];
  return orm.saveDb(db);
}

/**
 * Insert copies of `transfers` with fresh ids; the inputs are not modified.
 *
 * @testOnly
 */
async function insertMultiple(
  transfers: TransferEntity[] | readonly TransferEntity[],
): Promise<TransferEntity[]> {
  const db = await orm.openDb();
  db.transfers = [...db.transfers, ...transfers];
  await orm.saveDb(db);
  return [...transfers];
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export const UserRepoTestOnly = {
  deleteAllTransfers,
  insertMultiple,
} as const;

export default {
  persists,
  getAll,
  addOne,
} as const;
