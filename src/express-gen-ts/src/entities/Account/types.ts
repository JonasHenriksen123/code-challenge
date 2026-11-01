import type { Entity } from '#src/entities/common/entity-base-types.ts';

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

/**
 * @entity `accounts`
 */
export interface AccountEntity extends Entity {
  user: string;
  name: string;
  balance: number;
}

/**
 * Fields a client supplies when creating a user; the server sets the rest.
 */
export type AccountInput = Pick<AccountEntity, 'user' | 'name' | 'balance'>;

