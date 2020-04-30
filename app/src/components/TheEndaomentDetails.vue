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
      <div class="row justify-center text-center">
        <div class="col-xs-4">
          Proposals in Queue: {{ numberOfProposals }}
        </div>
        <div class="col-xs-4">
          Number of Members: 1
        </div>
        <div class="col-xs-4">
          Number of Shares: {{ totalShares }}
        </div>
        <div class="col-xs-6 q-mt-md">
          <div>
            Bank Balance: ${{ bankBalance }}
          </div>
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
          v-if="numberOfProposals === 0"
          class="text-italic text-center q-mb-xl q-pb-xl"
        >
          There are no proposals for this Endaoment
        </div>
        <div
          v-for="(proposal, index) in proposals"
          :key="proposal.id"
          class="q-ma-md"
        >
          <q-card class="endaoment">
            <q-card-section>
              <!-- Proposal type -->
              <div class="text-caption text-bold primary">
                <div v-if="proposal[12]===0">
                  Membership Proposal
                </div>
                <div v-else-if="proposal[12]===1">
                  New Grant Proposal
                </div>
                <div v-else-if="proposal[12]===2">
                  Revoke Grant Proposal
                </div>
              </div>
              <!-- Proposal description -->
              <div
                class="text-bold"
                style="font-size:1.1rem;"
              >
                {{ proposal[10] }}
              </div>

              <!-- Membership Specific Stuff -->
              <div v-if="proposal[12]===0">
                <div class="q-mb-md text-caption text-grey">
                  Applicant: {{ proposal[1] }}
                </div>
                <div>
                  Tribute Amount: ${{ formatBigNumber(proposal[9]) }}
                </div>
                <div>
                  Shares Requested: {{ formatNumber(proposal[2]) }}
                </div>
                <div v-if="proposal[6]">
                  <br>
                  Proposal Status:
                  <span
                    v-if="proposal[7]"
                    style="color:green;"
                  >Passed!</span>
                  <span v-else>Rejected</span>
                </div>
              </div>
              <!-- Grant Specific Stuff -->
              <div v-if="proposal[12]===1">
                <div class="q-mb-md text-caption text-grey">
                  Recipient: {{ proposal[1] }}
                </div>
                <div>
                  Stream Amount: ${{ cdaiToDai(proposal[9]) }}
                </div>
                <div>
                  Stream Duration: {{ formatNumber(proposal[13] / (3600 * 24 )) }} days
                </div>
                <div class="row justify-evenly q-mt-lg">
                  <div class="col-auto">
                    <div class="text-caption">
                      {{ formatNumber(proposal[4]) }} votes
                    </div>
                    <q-btn
                      color="primary"
                      :disabled="!isMember"
                      label="Vote Yes"
                      outline
                      @click="submitGrantVote(index, 1)"
                    />
                  </div>
                  <div class="col-auto">
                    <div class="text-caption">
                      {{ formatNumber(proposal[5]) }} votes
                    </div>
                    <q-btn
                      color="primary"
                      :disabled="!isMember"
                      label="Vote No"
                      outline
                      @click="submitGrantVote(index, 2)"
                    />
                  </div>
                </div>
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
      //
      exchangeRate: undefined,
      totalShares: undefined,
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
    await this.getAllData();
    this.isLoading = false;
  },

  methods: {
    formatBigNumber(x) {
      return Math.round(utils.formatEther(utils.bigNumberify(x).toString()));
    },
    formatNumber(x) {
      return Math.round(utils.bigNumberify(x).toString());
    },
    cdaiToDai(x) {
      const y = utils.bigNumberify(x);
      const z = y.mul(this.exchangeRate);
      const val = utils.formatUnits(z, 36);
      return Math.round(val);
    },

    async getAllData() {
      if (!this.provider) await this.$store.dispatch('user/setDefaultEthereumData');
      this.endaoment = new ethers.Contract(this.address, abi.endaoment, this.provider);
      const cdai = new ethers.Contract(addresses.cdai, abi.cdai, this.provider);
      this.numberOfProposals = Number((await this.endaoment.getProposalQueueLength()).toString());
      this.bankAddress = await this.endaoment.guildBank();
      const cdaiBankBalance = await cdai.balanceOf(this.bankAddress);
      this.exchangeRate = await cdai.exchangeRateStored();
      this.bankBalance = Math.round(utils.formatUnits(cdaiBankBalance.mul(this.exchangeRate), 36));
      this.name = await this.endaoment.name();
      this.description = await this.endaoment.description();
      this.totalShares = await this.endaoment.totalShares();

      this.proposals = [];
      for (let i = 0; i < this.numberOfProposals; i += 1) {
        // eslint-disable-next-line
        this.proposals.push(await this.endaoment.proposalQueue(String(i)));
      }

      if (this.userAddress) {
        this.memberData = await this.endaoment.members(this.userAddress);
      }
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

    async submitGrantVote(index, response) {
      console.log(index, response);
      console.log('Submitting grant vote...');
      const endaoment = new ethers.Contract(this.address, abi.endaoment, this.signer);
      await endaoment.submitVote(index, response);
      console.log('Vote submitted!');
      await this.getAllData();
      this.notifyUser('positive', 'Your vote was successfully submitted!');
    },
  },
};
</script>
