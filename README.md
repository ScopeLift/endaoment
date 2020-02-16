# Endaoment

A no-loss grant system that redirects interest earned on deposits to a
selected recipient.

## Getting Started

```bash
# Setup
npm install
truffle compile --all
npm run app-setup # setup contract ABIs
npm run ganache # start ganache
truffle test test/RToken.test.js # initialize contracts

# Start application
cd app
npm install
npm run start

# After submitting a proposal, skip time to vote
truffle test test/skipTime-hours.js

# Skip to end of voting period and end of grace period
truffle test test/skipTime-weeks.js

# Accrue interest
truffle test test/accrueInterest.js
```
