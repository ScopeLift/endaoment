<template>
  <div class="text-center q-mt-lg">
    TODO Read data for endaoment with ID {{ id }} from endaoment contract storage.
    We also read all proposals for this endaoment and show them as cards.
  </div>
</template>

<script>
export default {
  name: 'TheEndaomentDetails',

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
