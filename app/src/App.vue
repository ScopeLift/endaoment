<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script >
export default {
  name: 'App',

  created() {
    // Check local storage for a dark mode setting
    const isDark = this.$q.localStorage.getItem('isDark');
    this.$q.dark.set(isDark);
  },

  async mounted() {
    await this.$store.dispatch('user/setDefaultEthereumData');
  },
};
</script>
