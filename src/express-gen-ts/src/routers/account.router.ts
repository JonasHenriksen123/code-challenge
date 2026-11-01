import { Router } from 'express';
import validate from 'express-zod-safe';

import HttpStatusCodes from '#src/common/constants/HttpStatusCodes.ts';
import Paths from '#src/common/constants/Paths/index.ts';
import Account from '#src/entities/Account/index.ts';
import AccountService from '#src/services/AccountService.ts';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

// Shorthand for the path strings
const P = {
  GET: Paths.Accounts.Get.PATH,
  ADD: Paths.Accounts.Add.PATH
} as const;

// Middlware `validators`
const V = {
  add: validate({ body: { account: Account.Schemas.Input } }),
} as const;

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const router = Router();

// Get all accounts
router.get(P.GET, async (_, res) => {
  const account = await AccountService.getAll();
  res.status(HttpStatusCodes.OK).json({ accounts: account });
});

// Add one account
router.post(P.ADD, V.add, async (req, res) => {
  const { account: account } = req.body;
  const created = await AccountService.addOne(account);
  res.status(HttpStatusCodes.CREATED).json({ account: created });
});

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default router;
