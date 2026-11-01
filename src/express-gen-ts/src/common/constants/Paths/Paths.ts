import { ep, pp } from './helpers.ts';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const BASE = '/api';

const USERS_BASE = '/user';
const USERS = BASE + USERS_BASE;

const ACCOUNTS_BASE = '/account';
const ACCOUNTS = BASE + ACCOUNTS_BASE;

const TRANSFERS_BASE = '/transfer';
const TRANSFERS = BASE + TRANSFERS_BASE;

const Paths = {
  PATH: BASE,
  Users: {
    PATH: USERS_BASE,
    Get: ep(USERS, '', 'GET'),
    Add: ep(USERS, '', 'POST'),
    Update: ep(USERS, '', 'PUT'),
    Delete: {
      ...ep(USERS, `/:id`, 'DELETE'),
      format: (id: string) => `${USERS}/${pp(id)}`,
    },
  },
  Accounts: {
    PATH: ACCOUNTS_BASE,
    Get: ep(ACCOUNTS, '', 'GET'),
    Add: ep(ACCOUNTS, '', 'POST'),
  },
  Transfers: {
    PATH: TRANSFERS_BASE,
    Get: ep(TRANSFERS, '', 'GET'),
    Add: ep(TRANSFERS, '', 'POST')
  }
} as const;

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default Paths;
