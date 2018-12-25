# CSP COPE Backend

## General usage:
### Files:
- .env.default: put the variables that you want to be accessed globally
- .env.testing: same as above, but used in testing
- .env.secret(gitignored): for secret keys
### Commands:
- `yarn dev`: Start a nodemon instance for developing
- `yarn build`: Compile into usable js distribution.
- `yarn unit_test`: Run the unit tests (test if single modules work)
- `yarn integration_test`: Run the integration tests (test if the whole thing works)


## How to run:

-   Add a .env.secret file with the following fields:

```
    SESSION_SECRET
```

-   Execute `yarn dev` to dev, `yarn build` to create a js distribution

## Development note:

-   Unless approved, you are not allowed to push to `master`.
-   Create a new branch instead, in the following name format:
    `${username}/dev-${featurename}`
-   Push your work to this branch instead.
-   Create a pull request in case you want to merge it to `master`, or contact me and I will merge it myself
