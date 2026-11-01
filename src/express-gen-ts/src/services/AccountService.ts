import { NotFoundError } from '#src/common/classes/route-errors.ts';
import Account, {
  type AccountEntity,
  type AccountInput,
} from '#src/entities/Account/index.ts';
import AccountRepo from '#src/repos/AccountRepo.ts';
import UserService from './UserService.ts'

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const AccountServiceErrors = {
  ACCOUNT_NOT_FOUND: 'Account not found',
} as const;

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Get all accounts.
 * TODO: Should be scoped to accounts owned by user
 */
function getAll(): Promise<AccountEntity[]> {
  return AccountRepo.getAll();
}

/**
 * Get an account by id.
 */
async function getAccount(id: string): Promise<AccountEntity> {
  const account = await AccountRepo.getOne(id)
  if (!account) throw new NotFoundError(AccountServiceErrors.ACCOUNT_NOT_FOUND)
  return account
}

/**
 * Create an account from client input; the id and created date are set here.
 */
async function addOne(input: AccountInput): Promise<AccountEntity> {
  // check if user exists
  await UserService.getOne(input.user)

  const account = Account.create(input);
  await AccountRepo.addOne(account);
  return account;
}

/**
 * Update one account.
 * TODO: Should be scoped to accounts owned by user
 */
async function updateOne(account: AccountEntity): Promise<void> {
  const persists = await AccountRepo.persists(account.id);
  if (!persists) throw new NotFoundError(AccountServiceErrors.ACCOUNT_NOT_FOUND);
  return AccountRepo.updateOne(account);
}

/**
 * Delete an account by their id.
 * TODO: Should be scoped to accounts owned by user
 * TODO: Should handle balance being none zero
 */
async function deleteOne(id: string): Promise<void> {
  const persists = await AccountRepo.persists(id);
  if (!persists) throw new NotFoundError(AccountServiceErrors.ACCOUNT_NOT_FOUND);
  return AccountRepo.deleteOne(id);
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  Errors: AccountServiceErrors,
  getAll,
  addOne,
  updateOne,
  deleteOne,
  getAccount,
} as const;
