<template>
  <q-page padding>
    <div
      v-if="isLoading"
      class="row justify-center text-center q-pt-xl"
      style="max-width: 600px; margin:0 auto;"
    >
      <q-spinner
        color="primary"
        size="3rem"
      />
      <div class="col-xs-12">
        Loading data...
      </div>
    </div>
    <div
      v-else
      class="text-center"
    >
      <h1 class="header-black primary">
        Stream Donations
      </h1>
      <h4 class="body-bold q-mt-md">
        Join your Endaoment. Choose your amount. Start streaming.
      </h4>

      <div class="row justify-center q-mb-xl">
        <div>
          <div class="q-mt-xl q-mb-md">
            Featured Endaoment
          </div>
          <div>
            <endaoment-card
              :address="endaoments[0].address"
              :name="endaoments[0].name"
              :description="endaoments[0].description"
              :bank-address="endaoments[0].bankAddress"
              :bank-balance="endaoments[0].bankBalance"
              :total-shares="endaoments[0].totalShares"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
// import { ethers } from 'ethers';
import EndaomentCard from 'components/EndaomentCard';

// const { abi } = require('../../../build/contracts/Endaoment.json');

export default {
  name: 'Home',

  components: {
    EndaomentCard,
  },

  data() {
    return {
      isLoading: undefined,
      featuredId: 0,
      name: undefined,
      description: undefined,
      totalShares: undefined,
      bankAddress: undefined,
    };
  },

  computed: {
    ...mapState({
      endaoments: (state) => state.user.endaoments,
      provider: (state) => state.user.ethersProvider,
    }),
  },

  async mounted() {
    this.isLoading = true;
    await this.$store.dispatch('user/getEndaoments');
    // this.endaoment = new ethers.Contract(this.endaoments[0], abi, this.provider);
    // this.name = await this.endaoment.name();
    // this.description = await this.endaoment.description();
    // this.totalShares = (await this.endaoment.totalShares()).toString();
    // this.bankAddress = await this.endaoment.guildBank();
    this.isLoading = false;
  },
};
</script>
