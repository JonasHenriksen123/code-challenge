import { BadRequestError } from '#src/common/classes/route-errors.ts';
import Transfer, {
  type TransferEntity,
  type TransferInput,
} from '#src/entities/Transfer/index.ts';
import TransferRepo from '#src/repos/TransferRepo.ts';
import AccountService from './AccountService.ts'

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const TransferServiceErrors = {
  NO_COVERAGE: 'Account balnce does not cover amount',
} as const;

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Get all transfers.
 * TODO: Should be scoped to transfers connected to account and accounts owned by user
 */
function getAll(): Promise<TransferEntity[]> {
  return TransferRepo.getAll();
}

/**
 * Create a transfer from client input; the id and created date are set here.
 * TODO: Should be transactional to protect db state
 * TODO: Should be scoped to allow from to be accounts owned by user
 * TDOO: Implement rounding error safe amount/balance handling 
 */
async function addOne(input: TransferInput): Promise<TransferEntity> {
  const from = await AccountService.getAccount(input.from)
    
  const to = await AccountService.getAccount(input.to)
  
  //check account balance covers transfer amount
  if (from.balance < input.amount) throw new BadRequestError(TransferServiceErrors.NO_COVERAGE)

  from.balance -= input.amount
  to.balance += input.amount

  await AccountService.updateOne(from)
  await AccountService.updateOne(to)
  
  const transfer = Transfer.create(input);
  await TransferRepo.addOne(transfer);
  return transfer;
}

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default {
  Errors: TransferServiceErrors,
  getAll,
  addOne,
} as const;
