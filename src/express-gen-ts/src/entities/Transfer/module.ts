import { z } from 'zod';

import {
  getISOString,
  type ISOString,
  ISOStringSchema,
} from '#src/common/utils/date.utils.ts';

import type { TransferEntity, TransferInput } from './types.ts';
import common from '../common/index.ts'

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

/** @ValueFactoryFunction */
const TransferDefaults = () => ({
  id: common.genId(),
  from: common.genId(),
  to: common.genId(),
  amount: 1,
  created: getISOString(),
});

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const TransferInputSchema = z.object({
  from: common.Schemas.Id,
  to: common.Schemas.Id,
  amount: z.number().refine(
    (val) => {
      // Refuse more than two decimals
      const split = val.toString().split('.');
      return !split[1] || split[1].length <= 2;
    },
    {
      message: "Amount must have at most two decimals"
    }
  )
}).refine((val) => {
  // Refuse the account id for 'from' and 'to' being equal
  return val.from !== val.to;
},
{
  message: "from and to account must not be the same"
})

const TransferSchema = TransferInputSchema.extend({
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
function create(transfer?: Partial<TransferEntity>): TransferEntity {
  return { ...TransferDefaults(), ...transfer };
}

/**
 * Factory-function.
 *
 * Create a `UserEntity` from individual properties
 */
function of(from: string, to?: string, amount?: number, created?: ISOString): TransferEntity {
  const retVal = TransferDefaults();
  if (from) retVal.from = from;
  if (to) retVal.to = to;
  if (amount) retVal.amount = amount;
  if (created) retVal.created = created;
  return retVal;
}

/**
 * Check if a valid user object
 */
function isTransfer(val: unknown): val is TransferEntity {
  return TransferSchema.safeParse(val).success;
}

/**
 * Check if a valid end users input fields are valid.
 */
function isTransferInput(val: unknown): val is TransferEntity {
  return TransferInputSchema.safeParse(val).success;
}



// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  of,
  create,
  is: {
    account: isTransfer,
    accountInput: isTransferInput
  },
  Schemas: {
    Main: TransferSchema,
    Input: TransferInputSchema,
  },
} as const;
