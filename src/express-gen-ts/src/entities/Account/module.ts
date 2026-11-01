import { z } from 'zod';

import {
  getISOString,
  type ISOString,
  ISOStringSchema,
} from '#src/common/utils/date.utils.ts';

import type { AccountEntity, AccountInput } from './types.ts';
import common from '../common/index.ts'

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

/** @ValueFactoryFunction */
const AccountDefaults = () => ({
  id: common.genId(),
  name: '--',
  user: common.genId(),
  balance: 0,
  created: getISOString(),
});

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const AccountInputSchema = z.object({
  user: common.Schemas.Id,
  name: z.string().min(1, 'Name cannot be empty'),
  balance: z.number().refine(
    (val) => {
      // Refuse more than two decimals
      const split = val.toString().split('.');
      return !split[1] || split[1].length <= 2;
    },
    {
      message: "Balance must have at most two decimals"
    }
  )
})

const AccountSchema = AccountInputSchema.extend({
  id: common.Schemas.Id,
  created: ISOStringSchema,
})

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Factory-function.
 *
 * Create a `UserEntity` from a partial or `undefined`
 */
function create(account?: Partial<AccountEntity>): AccountEntity {
  return { ...AccountDefaults(), ...account };
}

/**
 * Factory-function.
 *
 * Create a `UserEntity` from individual properties
 */
function of(name: string, user?: string, balance?: number, created?: ISOString): AccountEntity {
  const retVal = AccountDefaults();
  if (name) retVal.name = name;
  if (user) retVal.user = user;
  if (balance) retVal.balance = balance;
  if (created) retVal.created = created;
  return retVal;
}

/**
 * Check if a valid user object
 */
function isAccount(val: unknown): val is AccountEntity {
  return AccountSchema.safeParse(val).success;
}

/**
 * Check if a valid end users input fields are valid.
 */
function isAccountInput(val: unknown): val is AccountInput {
  return AccountInputSchema.safeParse(val).success;
}



// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  of,
  create,
  is: {
    account: isAccount,
    accountInput: isAccountInput
  },
  Schemas: {
    Main: AccountSchema,
    Input: AccountInputSchema,
  },
} as const;
