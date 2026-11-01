# code-challenge

This project implements a simple api to handle transfers between accounts. The use case for this is to handle simple banking.

## Stories
The basic user stories for this project.

### Create user

A user is created by sending a `POST` http request to the endpoint `<domain>/api/user`.

Expects a name and email address.

### Create account

An account is created by sending a `POST` http request to the endpoint `<domain>/api/account`.

Expects a user id, name and balance.

#### Requirements

The user id must match the id of an existing user 

### Transfer amount

A transfer is created by sending a `POST` http request to the endpoint `<domain>/api/transfer`.

Expects a from account id, a to account id and an amount.

#### Requirements

The two account ids must match the id of existing accounts and must not be the same.

The amount must not exceed the balance of the 'from' account

## Development

The code is implemented in typescript using express.js. See `./src/express-gen-ts/README.md`.

To ease development it is possible to use the api routes set up in `./bruno/code-challenge/*`.



## Disclaimer

The base structure for this repo has been generated with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript)