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
            v-model="name"
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
            v-model="description"
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
            :loading="isLoading"
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
import helpers from 'src/mixins/helpers';
import ConnectWallet from 'components/ConnectWallet';

const addresses = require('../../../addresses.json');

export default {
  name: 'CreateEndaoment',

  components: {
    ConnectWallet,
  },

  mixins: [helpers],

  data() {
    return {
      approvedToken: addresses.dai, // Dai
      periodDuration: 17280, // 4.8 hours, in seconds (5 periods per day)
      votingPeriodLength: 35, // 35 periods (7 days)
      gracePeriodLength: 35, // 35 periods (7 days)
      abortWindow: 5, // 5 periods (1 day)
      proposalDeposit: '100000000000000000000', // 100 Dai deposit to submit proposal
      dilutionBound: 3, // max multiplier a YES voter will be obligated to pay if mass ragequits
      processingReward: '1000000000000000000', // 1 Dai given to whoever processes a proposal
      name: undefined,
      description: undefined,
      //
      isLoading: undefined,
    };
  },

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
      factory: (state) => state.user.endaomentFactory,
      endaoments: (state) => state.user.endaoments,
    }),

    isFormValid() {
      return this.isValidName() && this.isValidDescription();
    },
  },

  methods: {
    isValidName() {
      if (!this.name) return false;
      return this.name.length > 2;
    },

    isValidDescription() {
      if (!this.description) return false;
      return this.description.length > 29;
    },

    async createEndaoment() {
      this.isLoading = true;
      const overrides = { gasLimit: 6000000 };
      console.log('Sending transation to create new endaoment...');
      const tx = await this.factory.createEndaoment(
        String(this.userAddress),
        String(this.approvedToken),
        String(this.periodDuration),
        String(this.votingPeriodLength),
        String(this.gracePeriodLength),
        String(this.abortWindow),
        String(this.proposalDeposit),
        String(this.dilutionBound),
        String(this.processingReward),
        String(this.name),
        String(this.description),
        overrides,
      );

      console.log('Transaction hash: ', tx.hash);
      console.log('Transaction: ', tx);
      console.log('Waiting for transaction to be mined...');
      await tx.wait();
      console.log('Endaoment created!');
      await this.$store.dispatch('user/getEndaoments');

      // Redirect to newest endaoment
      this.notifyUser('positive', 'Your Endaoment has successfully been created!');
      const { address } = this.endaoments[this.endaoments.length - 1];
      this.$router.push({ name: 'endaomentDetails', params: { address } });
      this.isLoading = false;
    },
  },
};
</script>
