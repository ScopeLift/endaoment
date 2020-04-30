<template>
  <q-page padding>
    <h2 class="page-header q-mb-lg">
      Find Your Endaoment
    </h2>
    <div
      v-if="endaoments"
      class="row justify-center"
    >
      <div
        v-for="endaoment in endaoments"
        :key="endaoment.id"
      >
        <endaoment-card
          :address="endaoment.address"
          :name="endaoment.name"
          :description="endaoment.description"
          :bank-address="endaoment.bankAddress"
          :bank-balance="endaoments[endaoment.id].bankBalance"
          :total-shares="endaoment.totalShares"
        />
      </div>
    </div>
    <div class="text-center q-mt-xl">
      Don't see one you like?
      <router-link
        class="hyperlink"
        :to="{name: 'create'}"
      >
        Create One
      </router-link>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import EndaomentCard from 'components/EndaomentCard';

export default {
  name: 'FindEndaoment',

  components: {
    EndaomentCard,
  },

  computed: {
    ...mapState({
      endaoments: (state) => state.user.endaoments,
    }),
  },

  async mounted() {
    await this.$store.dispatch('user/getEndaoments');
  },
};
</script>
