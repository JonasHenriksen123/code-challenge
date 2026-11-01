import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import HttpStatusCodes from '#src/common/constants/HttpStatusCodes.ts';
import Paths from '#src/common/constants/Paths/index.ts';
import Account, { type AccountEntity } from '#src/entities/Account/index.ts';
import User, { type UserEntity } from '#src/entities/User/index.ts';
import Id from '#src/entities/common/index.ts';

import AccountRepo, { AccountRepoTestOnly } from '#src/repos/AccountRepo.ts';
import UserRepo, { UserRepoTestOnly } from '#src/repos/UserRepo.ts';
import AccountService from '#src/services/AccountService.ts';

import { agent } from './support/agent.ts';
import {
  extractErrMsg,
  type TypedErrRes,
  type TypedRes,
} from './support/utils.ts';

// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

// Shorthand the `Paths`
const P = {
  Get: {
    CALL: Paths.Accounts.Get.FULL_PATH,
    DISPLAY: Paths.Users.Get.DISPLAY,
  },
  Add: {
    CALL: Paths.Accounts.Add.FULL_PATH,
    DISPLAY: Paths.Users.Add.DISPLAY,
  },
} as const;

// Errors
const Errors = {
  ...AccountService.Errors,
} as const;

// Status codes
const { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK, NOT_FOUND } =
  HttpStatusCodes;

const DUMMY_USERS = [
  User.of('Sean Maxwell', 'sean.maxwell@gmail.com'),
  User.of('John Smith', 'john.smith@gmail.com'),
  User.of('Gordan Freeman', 'gordan.freeman@gmail.com'),
] as const;

const DUMMY_ACCOUNTS = [
  Account.of('My account', DUMMY_USERS[0].id, 200),
  Account.of('Savings account', DUMMY_USERS[2].id, 3000),
  Account.of('Shared account', DUMMY_USERS[1].id, 1000),
] as const;

// ========================================================================= //
//                                   TESTS                                   //
// ========================================================================= //

describe('AccountRouter', () => {
  let dbUsers: UserEntity[] = [];
  let dbAccounts: AccountEntity[] = [];

  beforeEach(async () => {
    await UserRepoTestOnly.deleteAllUsers();
    dbUsers = await UserRepoTestOnly.insertMultiple(DUMMY_USERS);

    await AccountRepoTestOnly.deleteAllAccounts();
    dbAccounts = await AccountRepoTestOnly.insertMultiple(DUMMY_ACCOUNTS)
  });

  // --- `Get` ---
  describe(P.Get.DISPLAY, () => {
    describe('on success', () => {
      it(`returns all accounts as JSON with status "${OK}"`, async () => {
        const res: TypedRes<{ accounts: AccountEntity[] }> = await agent.get(
          P.Get.CALL,
        );
        assert.equal(res.status, OK);
        assert.deepEqual(res.body.accounts, DUMMY_ACCOUNTS);
      });
    });

    describe('when an unexpected error is thrown', () => {
      it(`returns status "${INTERNAL_SERVER_ERROR}"`, async (t) => {
        const error = new Error('boom');
        // Mocks made through `t.mock` are restored when the test ends
        t.mock.method(AccountService, 'getAll', () => Promise.reject(error));
        const res: TypedErrRes = await agent.get(P.Get.CALL);
        assert.equal(res.status, INTERNAL_SERVER_ERROR);
        assert.equal(res.body.error, 'Internal Server Error');
      });
    });
  });

  // --- `Add` ---
  describe(P.Add.DISPLAY, () => {
    describe('on success', () => {
      it(`persists the account and returns status "${CREATED}"`, async () => {
        // Same payload shape the front-end sends
        const input = { user: DUMMY_USERS[0].id,  name: 'second account', balance: 2000 };
        const res: TypedRes<{ account: AccountEntity }> = await agent
          .post(P.Add.CALL)
          .send({ account: input });
        assert.equal(res.status, CREATED);
        const isId = Id.is.id(res.body.account.id);
        assert.equal(isId, true);
        const all = await AccountRepo.getAll();
        assert.equal(all.length, DUMMY_ACCOUNTS.length + 1);
        const saved = all.find((u) => u.id === res.body.account.id);
        assert.deepEqual(saved, res.body.account);
      });
    });

    describe('when the account param is missing', () => {
      it('returns a validation error', async () => {
        const res = await agent.post(P.Add.CALL).send({ account: null });
        assert.equal(res.status, BAD_REQUEST);
        const errMsg = extractErrMsg(res);
        assert.equal(errMsg, 'Invalid input: expected object, received null');
      });
    });

    describe('when the name is empty', () => {
      it(`returns status "${BAD_REQUEST}"`, async () => {
        const res = await agent
          .post(P.Add.CALL)
          .send({ account: { user: DUMMY_USERS[0].id, name: '', balance: 200 } });
        assert.equal(res.status, BAD_REQUEST);
        // Verify it didn't persist in the database
        const allAccounts = await AccountRepo.getAll();
        assert.equal(allAccounts.length, DUMMY_ACCOUNTS.length);
      });
    });

    describe('when the request body cannot be parsed', () => {
      it('returns 400 for malformed JSON without persisting an account', async () => {
        const res: TypedErrRes = await agent
          .post(P.Add.CALL)
          .set('Content-Type', 'application/json')
          .send('{"account":');
        assert.equal(res.status, BAD_REQUEST);
        assert.deepEqual(res.body, { error: 'Invalid JSON' });
        assert.deepEqual(await AccountRepo.getAll(), DUMMY_ACCOUNTS);
      });

      const oversizedBodies = [
        [
          'application/json',
          JSON.stringify({ account: { name: 'a'.repeat(110000) } }),
        ],
        [
          'application/x-www-form-urlencoded',
          `account[name]=${'a'.repeat(110000)}`,
        ],
      ] as const;

      for (const [contentType, body] of oversizedBodies) {
        it(`returns 413 for an oversized ${contentType} body`, async () => {
          const res: TypedErrRes = await agent
            .post(P.Add.CALL)
            .set('Content-Type', contentType)
            .send(body);
          assert.equal(res.status, HttpStatusCodes.PAYLOAD_TOO_LARGE);
          assert.deepEqual(res.body, { error: 'Request body too large' });
          assert.deepEqual(await AccountRepo.getAll(), DUMMY_ACCOUNTS);
        });
      }
    });
  });
});
