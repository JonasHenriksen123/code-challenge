import type { Entity } from '#src/entities/common/entity-base-types.ts';

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

/**
 * @entity `transfers`
 */
export interface TransferEntity extends Entity {
  from: string;
  to: string;
  amount: number;
}

/**
 * Fields a client supplies when creating a user; the server sets the rest.
 */
export type TransferInput = Pick<TransferEntity, 'from' | 'to' | 'amount'>;

