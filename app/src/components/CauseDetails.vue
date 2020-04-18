<template>
  <div>
    <q-card class="cause">
      <q-card-section>
        <h4 class="header-black accent">
          {{ title }}
        </h4>
        <div class="text-caption text-grey">
          ${{ bankSize }} pledged
          <br>
          {{ numberOfMembers }} member<span v-if="numberOfMembers !== 1">s</span>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-justify">
          {{ description.slice(0,280) }}...
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'CauseDetails',

  props: {
    description: {
      required: true,
      type: String,
      default: undefined,
    },

    id: {
      require: true,
      type: Number,
      default: undefined,
    },

    title: {
      required: true,
      type: String,
      default: undefined,
    },
  },

  data() {
    return {};
  },

  computed: {
    // Get cause data based on ID
    numberOfMembers() {
      return 7;
    },
    bankSize() {
      return 1150;
    },
  },
};
</script>

<style lang="scss" scoped>
.cause {
  max-width: 500px;
  padding: 2rem;
  text-align: left;
}
</style>
