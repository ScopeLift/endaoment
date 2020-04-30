<template>
  <div
    class="cursor-pointer endaoment-div"
    @click="$router.push({ name: 'endaomentDetails', params: {address} })"
  >
    <q-card class="card-border endaoment">
      <q-card-section>
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
</template>

<script>
export default {
  name: 'EndaomentCard',

  props: {
    address: {
      type: String,
      required: true,
    },
    bankAddress: {
      type: String,
      required: true,
    },
    bankBalance: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    totalShares: {
      type: String,
      required: true,
    },
  },

};
</script>

<style lang="scss" scoped>
.endaoment-div {
  max-width: 450px;
  padding: 1rem;
  text-align: left;
}
.endaoment {
  max-width: 450px;
  padding: 1.5rem;
  text-align: left;
}
</style>
