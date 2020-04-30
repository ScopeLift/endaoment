# Endaoment

TODO

## Getting Started

To use this app, follow the steps below:

1. Clone this repository
2. Install dependencies with `npm run config`. This will use npm to install ganache-cli globally, install contract dependencies, and install app dependencies
3. Create a file in the project root called `.env` with the following contents

  ```bash
  export INFURA_ID=yourInfuraId
  export MNEMONIC="your mnemonic phrase"
  export DAI_ADDR=0x6B175474E89094C44Da98b954EedeAC495271d0F
  export DAI_FUNDER=0x447a9652221f46471a2323B98B73911cda58FD8A
  export CDAI_ADDR=0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643
  ```

4. Create a file in the `app` folder called `.env` with the following contents. The Blocknative API key is free and you can find instructions for obtaining one [here](https://docs.blocknative.com/onboard#quickstart).

  ```bash
  export INFURA_ID=yourInfuraId
  export MNEMONIC="your mnemonic phrase"
  export BLOCKNATIVE_API_KEY=yourBlocknativeApiKey
  ```

5. Run `cd app && npm run dev` to start and use the app.