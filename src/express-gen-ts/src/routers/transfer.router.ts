import { Router } from 'express';
import validate from 'express-zod-safe';

import HttpStatusCodes from '#src/common/constants/HttpStatusCodes.ts';
import Paths from '#src/common/constants/Paths/index.ts';
import Transfer from '#src/entities/Transfer/index.ts';
import TransferService from '#src/services/TransferService.ts';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

// Shorthand for the path strings
const P = {
  GET: Paths.Transfers.Get.PATH,
  ADD: Paths.Transfers.Add.PATH,
} as const;

// Middleware `validators`
const V = {
  add: validate({ body: { transfer: Transfer.Schemas.Input } }),
} as const;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const router = Router();

// Get all transfers
router.get(P.GET, async (_, res) => {
  const transfers = await TransferService.getAll();
  res.status(HttpStatusCodes.OK).json({ transfers });
});

// Add one transfer
router.post(P.ADD, V.add, async (req, res) => {
  const { transfer: transfer } = req.body;
  const created = await TransferService.addOne(transfer);
  res.status(HttpStatusCodes.CREATED).json({ transfer: created });
});


// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default router;
