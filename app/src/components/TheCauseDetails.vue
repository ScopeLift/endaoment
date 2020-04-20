<template>
  <div class="text-center q-mt-lg">
    TODO Read data for cause with ID {{ id }} from cause contract storage.
    We also read all proposals for this cause and show them as cards.
  </div>
</template>

<script>
export default {
  name: 'TheCauseDetails',

  props: {
    id: {
      require: true,
      type: Number,
      default: undefined,
    },
  },

  data() {
    return {};
  },
};
</script>
