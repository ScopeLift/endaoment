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
          Number of Shares: 300
        </div>
        <div class="col-xs-4">
          Bank Balance: ${{ bankBalance }}
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
          @click="isAddingMember = !isAddingMember; isCreatingGrant = false "
        />
        <q-btn
          class="q-mb-xl q-mx-sm"
          color="primary"
          :disabled="!isMember"
          label="New Grant"
          outline
          @click="isCreatingGrant = !isCreatingGrant; isAddingMember = false "
        />
        <q-btn
          class="q-mb-xl q-mx-sm"
          color="primary"
          :disabled="!isMember"
          label="Revoke Grant"
          outline
        />
      </div>
      <!-- New Grant Proposal -->
      <div
        v-if="isCreatingGrant"
        class="q-mb-xl"
        style="max-width: 400; margin:0 auto;"
      >
        <div class="header-bold accent text-h5 text-bold q-mb-md">
          Create Grant Proposal
        </div>
        <q-form class="text-left">
          <div class="text-caption">
            Enter the address of the recipient
          </div>
          <q-input
            v-model="applicant"
            label="Recipient"
            outline
          />
          <div class="text-caption q-mt-lg">
            Enter the amount of Dai to give recipient
          </div>
          <q-input
            v-model="tokenGrant"
            label="Amount"
            outline
          />
          <div class="text-caption q-mt-lg">
            Enter the stream duration, in weeks
          </div>
          <q-input
            v-model="grantDuration"
            label="Duration"
            outline
          />
          <div class="text-caption q-mt-lg">
            Enter any relevant details that will help members vote
          </div>
          <q-input
            v-model="details"
            label="Description"
            outline
            type="textarea"
          />
          <q-btn
            class="full-width q-my-xl"
            color="primary"
            label="Submit Grant Proposal"
            @click="onGrantSubmit"
          />
        </q-form>
      </div>
      <!-- NEW MEMBER PROPOSAL -->
      <div
        v-if="isAddingMember"
        class="q-mb-xl"
        style="max-width: 400; margin:0 auto;"
      >
        <div class="header-bold accent text-h5 text-bold q-mb-md">
          Add Member Proposal
        </div>
        <q-form class="text-left">
          <div class="text-caption">
            Enter the address of the applicant
          </div>
          <q-input
            v-model="applicant"
            label="Recipient"
            outline
          />
          <div class="text-caption q-mt-lg">
            Enter the amount of Dai applicant will contribute
          </div>
          <q-input
            v-model="tokenGrant"
            label="Amount"
            outline
          />
          <div class="text-caption q-mt-lg">
            Enter the the number of shares requested
          </div>
          <q-input
            v-model="grantDuration"
            label="Number of Shares"
            outline
          />
          <div class="text-caption q-mt-lg">
            Enter any relevant details that will help members vote
          </div>
          <q-input
            v-model="details"
            label="Description"
            outline
            type="textarea"
          />
          <q-btn
            class="full-width q-my-xl"
            color="primary"
            label="Submit Member Proposal"
            @click="onMemberSubmit"
          />
        </q-form>
      </div>
      <!-- Proposals -->
      <div class="q-mt-md q-mb-xl">
        <div class="header-bold accent text-h5 text-bold q-mb-md">
          Proposals
        </div>

        <div
          v-for="proposal in proposals"
          :key="proposal.id"
        >
          <q-card class="endaoment">
            <q-card-section>
              <!-- Proposal type -->
              <div class="text-caption">
                <div v-if="proposal[12]===0">Type: Membership</div>
                <div v-else-if="proposal[12]===1">Type: New Grant</div>
                <div v-else-if="proposal[12]===2">Type: Revoke Grant</div>
              </div>
              <!-- Proposal description -->
              <div>{{ proposal[10] }}</div>

              <!-- Membership Specific Stuff -->
              <div v-if="proposal[12]===0">
                <div>
                  Tribute Amount: ${{ formatBigNumber(proposal[9]) }}
                </div>
                <div>
                  Shares Requested: {{ formatNumber(proposal[2]) }}
                </div>
                <div v-if="proposal[6]">
                  Proposal Status:
                  <span v-if="proposal[7]">Passed!</span>
                  <span v-else>Rejected</span>
                </div>
              </div>
              <!-- OLD!!! -->
              <h4 class="header-black accent">
              {{ name }}
              </h4>
              <div class="text-caption text-grey">
              Bank Balance: ${{ bankBalance }}
              <br>
              {{ totalShares }} share<span v-if="totalShares !== '1'">s</span>
              </div>
            </q-card-section>
            <q-card-section>
                <div
                v-if="description"
                class="text-justify"
                >
                {{ description.slice(0,280) }}...
                </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { ethers } from 'ethers';
import helpers from 'src/mixins/helpers';

const { utils } = ethers;

const addresses = require('../../../addresses.json');

const abi = {
  /* eslint-disable global-require */
  endaoment: require('../../../build/contracts/Endaoment.json').abi,
  dai: require('../../../abi/dai.json').abi,
  cdai: require('../../../abi/cdai.json').abi,
};

export default {
  name: 'TheEndaomentDetails',

  mixins: [helpers],

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
      proposals: [],
      //
      isCreatingGrant: undefined,
      isAddingMember: undefined,
      //
      applicant: undefined,
      tokenGrant: undefined,
      grantDuration: undefined,
      details: undefined,
    };
  },

  computed: {
    ...mapState({
      provider: (state) => state.user.ethersProvider,
      signer: (state) => state.user.signer,
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
    if (!this.provider) await this.$store.dispatch('user/setDefaultEthereumData');
    this.endaoment = new ethers.Contract(this.address, abi.endaoment, this.provider);
    const cdai = new ethers.Contract(addresses.cdai, abi.cdai, this.provider);
    this.numberOfProposals = await this.endaoment.getProposalQueueLength();
    this.bankAddress = await this.endaoment.guildBank();
    const cdaiBankBalance = await cdai.balanceOf(this.bankAddress);
    const exchangeRate = await cdai.exchangeRateStored();
    this.bankBalance = Math.round(utils.formatUnits(cdaiBankBalance.mul(exchangeRate), 36));
    this.name = await this.endaoment.name();
    this.description = await this.endaoment.description();
    this.totalShares = await this.endaoment.totalShares();

    for (let i = 0; i < this.numberOfProposals; i += 1) {
      // eslint-disable-next-line
      this.proposals.push(await this.endaoment.proposalQueue(String(i)));
    }

    if (this.userAddress) {
      this.memberData = await this.endaoment.members(this.userAddress);
    }
    this.isLoading = false;
  },

  methods: {
    formatBigNumber(x) {
      return Math.round(utils.formatEther(utils.bigNumberify(x).toString()));
    },
    formatNumber(x) {
      return Math.round(utils.bigNumberify(x).toString());
    },

    async onGrantSubmit() {
      console.log('Submitting grant proposal...');
      const endaoment = new ethers.Contract(this.address, abi.endaoment, this.signer);
      await endaoment.submitGrantProposal(
        this.applicant,
        this.tokenGrant,
        this.grantDuration,
        this.details,
      );
      this.notifyUser('positive', 'Proposal successfully submitted!');
      console.log('Proposal submitted!');
    },
    async onMemberSubmit() {
      console.log('Submitting member proposal...');
      const endaoment = new ethers.Contract(this.address, abi.endaoment, this.signer);
      await endaoment.submitGrantProposal(
        this.applicant,
        this.tokenGrant,
        this.grantDuration,
        this.details,
      );
      this.notifyUser('positive', 'Proposal successfully submitted!');
      console.log('Proposal submitted!');
    },
  },
};
</script>
