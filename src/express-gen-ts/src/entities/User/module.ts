import { z } from 'zod';

import {
  getISOString,
  type ISOString,
  ISOStringSchema,
} from '#src/common/utils/date.utils.ts';

import type { UserEntity, UserInput } from './types.ts';
import common from '../common/index.ts'

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

/** @ValueFactoryFunction */
const UserDefaults = () => ({
  id: common.genId(),
  name: '--',
  email: '--@example.com',
  created: getISOString(),
});

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const UserInputSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  email: z.email('Not a valid email'),
}) satisfies z.ZodType<UserInput>;

const UserSchema = UserInputSchema.extend({
  id: common.Schemas.Id,
  created: ISOStringSchema,
}) satisfies z.ZodType<UserEntity>;

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Factory-function.
 *
 * Create a `UserEntity` from a partial or `undefined`
 */
function create(user?: Partial<UserEntity>): UserEntity {
  return { ...UserDefaults(), ...user };
}

/**
 * Factory-function.
 *
 * Create a `UserEntity` from individual properties
 */
function of(name: string, email?: string, created?: ISOString): UserEntity {
  const retVal = UserDefaults();
  if (name) retVal.name = name;
  if (email) retVal.email = email;
  if (created) retVal.created = created;
  return retVal;
}


/**
 * Check if a valid user object
 */
function isUser(val: unknown): val is UserEntity {
  return UserSchema.safeParse(val).success;
}

/**
 * Check if a valid end users input fields are valid.
 */
function isUserInput(val: unknown): val is UserInput {
  return UserInputSchema.safeParse(val).success;
}


// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  of,
  create,
  is: {
    user: isUser,
    userInput: isUserInput,
  },
  Schemas: {
    Main: UserSchema,
    Input: UserInputSchema,
  },
} as const;
