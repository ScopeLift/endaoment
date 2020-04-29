<template>
  <div
    class="text-center q-pt-lg"
    style="max-width: 600px; margin:0 auto;"
  >
    <!-- IF LOADING -->
    <div v-if="isLoading">
      <q-spinner
        color="primary"
        size="3rem"
      />
      <div>Loading data...</div>
    </div>
    <!-- IF LOADED -->
    <div v-else>
      <!-- DAO DATA  -->
      <div class="primary-light text-bold q-mb-sm">
        Endaoment Overview
      </div>
      <div class="primary header-bold text-h4 text-bold q-mb-md">
        {{ name }}
      </div>
      <div class="text-justify q-mb-lg">
        {{ description }}
      </div>
      <div class="header-bold accent text-h5 text-bold q-mt-xl">
        Stats
      </div>
      <div class="row justify-center text-left">
        <div class="col-xs-4">
          Proposals in Queue: {{ numberOfProposals }}
        </div>
        <div class="col-xs-4">
          Number of Members: 1
        </div>
        <div class="col-xs-4">
          Bank Balance: ${{ numberOfProposals }}
          <div class="text-caption text-grey">
            {{ bankAddress }}
          </div>
        </div>
      </div>
      <!-- DAO ACTIONS -->
      <div class="header-bold accent text-h5 text-bold q-mt-xl">
        Member Actions
      </div>
      <div>
        If you are a member of this Endaoment, you can login to create or vote on proposals
      </div>
      <div class="row justify-center q-mt-md">
        <q-btn
          class="q-mb-xl q-mx-sm"
          color="primary"
          :disabled="!isMember"
          label="New Member"
          outline
        />
        <q-btn
          class="q-mb-xl q-mx-sm"
          color="primary"
          :disabled="!isMember"
          label="New Grant"
          outline
        />
        <q-btn
          class="q-mb-xl q-mx-sm"
          color="primary"
          :disabled="!isMember"
          label="Revoke Grant"
          outline
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { ethers } from 'ethers';

const { abi } = require('../../../build/contracts/Endaoment.json');

export default {
  name: 'TheEndaomentDetails',

  props: {
    address: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: undefined,
      endaoment: undefined,
      numberOfProposals: undefined,
      bankAddress: undefined,
      bankBalance: undefined,
      memberData: undefined,
      name: undefined,
      description: undefined,
    };
  },

  computed: {
    ...mapState({
      provider: (state) => state.user.ethersProvider,
      userAddress: (state) => state.user.userAddress,
    }),

    isMember() {
      return this.memberData && this.memberData[2];
    },
  },

  watch: {
    async userAddress() {
      this.memberData = await this.endaoment.members(this.userAddress);
    },
  },

  async mounted() {
    this.isLoading = true;
    this.endaoment = new ethers.Contract(this.address, abi, this.provider);
    this.numberOfProposals = await this.endaoment.getProposalQueueLength();
    this.bankAddress = await this.endaoment.guildBank();
    this.name = await this.endaoment.name();
    this.description = await this.endaoment.description();
    if (this.userAddress) {
      this.memberData = await this.endaoment.members(this.userAddress);
    }
    this.isLoading = false;
  },
};
</script>
