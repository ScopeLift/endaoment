<template>
  <q-page padding>
    <h2 class="page-header">
      Create Endaoment
    </h2>
    <div style="max-width: 400px; margin:0 auto">
      <div
        v-if="!userAddress"
        class="text-center q-my-lg"
      >
        Connect your wallet to sign in and create a new Endaoment
        <connect-wallet class="q-mt-lg" />
      </div>
      <div
        v-else
        class="q-mt-lg"
      >
        <q-form>
          <div class="text-caption">
            Enter a name describing for this Endaoment
          </div>
          <q-input
            v-model="constructor.name"
            :rules="[ val => isValidName() || 'Name must be at least 3 characters']"
            label="Name"
            lazy-rules
            outlined
          />
          <br>
          <div class="text-caption">
            Provide details describing the mission of this Endaoment
          </div>
          <q-input
            v-model="constructor.description"
            :rules="[ val => isValidDescription() ||
              'Description must be at least 30 characters']"
            label="Description"
            lazy-rules

            type="textarea"
            outlined
          />
          <q-btn
            color="primary"
            class="full-width q-my-xl"
            :disabled="!isFormValid"
            label="Create Endaoment"
            @click="createEndaoment"
          />
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import ConnectWallet from 'components/ConnectWallet';

export default {
  name: 'CreateEndaoment',

  components: {
    ConnectWallet,
  },

  data() {
    return {
      constructor: {
        approvedToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // Dai
        periodDuration: 17280, // 4.8 hours, in seconds (5 periods per day)
        votingPeriodLength: 35, // 35 periods (7 days)
        gracePeriodLength: 35, // 35 periods (7 days)
        abortWindow: 5, // 5 periods (1 day)
        proposalDeposit: '100000000000000000000', // 100 Dai deposit to submit proposal
        dilutionBound: 3, // max multiplier a YES voter will be obligated to pay if mass ragequits
        processingReward: '1000000000000000000', // 1 Dai given to whoever processes a proposal
        name: undefined,
        description: undefined,
      },
    };
  },

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
      factory: (state) => state.user.endaomentFactory,
    }),

    isFormValid() {
      return this.isValidName() && this.isValidDescription();
    },
  },

  methods: {
    isValidName() {
      if (!this.constructor.name) return false;
      return this.constructor.name.length > 2;
    },

    isValidDescription() {
      if (!this.constructor.description) return false;
      return this.constructor.description.length > 29;
    },

    async createEndaoment() {
      console.log(this.userAddress);
      console.log(this.constructor.approvedToken);
      console.log(this.constructor.periodDuration);
      console.log(this.constructor.votingPeriodLength);
      console.log(this.constructor.gracePeriodLength);
      console.log(this.constructor.abortWindow);
      console.log(this.constructor.proposalDeposit);
      console.log(this.constructor.dilutionBound);
      console.log(this.constructor.processingReward);
      console.log(this.constructor.name);
      console.log(this.constructor.description);
      const tx = await this.factory.createEndaoment(
        this.constructor.userAddress,
        this.constructor.approvedToken,
        String(this.constructor.periodDuration),
        String(this.constructor.votingPeriodLength),
        String(this.constructor.gracePeriodLength),
        String(this.constructor.abortWindow),
        this.constructor.proposalDeposit,
        String(this.constructor.dilutionBound),
        this.constructor.processingReward,
        'd',
        'w',
      );

      console.log('Transaction hash: ', tx.hash);
      console.log('Waiting for transaction to be mined...');
      await tx.wait();
      console.log('Endaoment created!');
    },
  },
};
</script>
