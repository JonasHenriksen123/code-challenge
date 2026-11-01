import { Router } from 'express';

import Paths from '#src/common/constants/Paths/index.ts';

import userRouter from './user.router.ts';
import accountRouter from './account.router.ts';
import transferRouter from './transfer.router.ts';

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

const apiRouter = Router();

// Add more routers as your app grows (e.g. `postsRouter`)
apiRouter.use(Paths.Users.PATH, userRouter);

apiRouter.use(Paths.Accounts.PATH, accountRouter)

apiRouter.use(Paths.Transfers.PATH, transferRouter)

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default apiRouter;
