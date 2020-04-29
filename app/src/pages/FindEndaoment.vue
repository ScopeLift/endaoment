<template>
  <q-page padding>
    <h2 class="page-header">
      Find Your Endaoment
    </h2>
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
export default {
  name: 'FindEndaoment',

  async mounted() {
    await this.$store.dispatch('user/getEndaoments');
  },
};
</script>
