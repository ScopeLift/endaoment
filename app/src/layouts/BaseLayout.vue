<template>
  <q-layout view="hhh Lpr fff">
    <!-- HEADER -->
    <q-header
      class="q-mx-md q-mt-md"
      style="color: #000000; background-color: rgba(0,0,0,0)"
    >
      <div class="row justify-between items-center">
        <!-- Logo and app name -->
        <div class="col-auto">
          <div
            class="row justify-start items-center"
            style="cursor: pointer;"
            @click="$router.push({ name: 'home' });"
          >
            <img
              alt="Endaoment logo"
              class="q-mx-md"
              src="statics/app-logo-128x128.png"
              style="max-width: 50px;"
            >
            <div class="header-black text-h5 dark-toggle">
              Endaoment
            </div>
          </div>
        </div>
        <!-- User info and settings -->
        <div class="col-auto">
          <div
            v-if="userAddress"
            class="text-caption dark-toggle q-mr-md"
          >
            Account: {{ userAddress }}
          </div>
          <div class="row justify-end q-mt-xs">
            <q-icon
              v-if="!$q.dark.isActive"
              class="col-auto dark-toggle"
              name="fas fa-moon"
              style="cursor: pointer;"
              @click="toggleNightMode()"
            />
            <q-icon
              v-else
              class="col-auto dark-toggle"
              name="fas fa-sun"
              style="cursor: pointer;"
              @click="toggleNightMode()"
            />
          </div>
        </div>
      </div>
    </q-header>
    <!-- MAIN CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- FOOTER -->
    <q-footer
      bordered
      class="q-mt-xl"
      style="color: #000000; background-color: rgba(0,0,0,0)"
    >
      <div class="text-center text-caption dark-toggle q-my-xl">
        Built by
        <a
          href="https://twitter.com/BenDiFrancesco"
          target="_blank"
          class="hyperlink"
        >Ben DiFrancesco</a>
        and
        <a
          href="https://twitter.com/msolomon44"
          target="_blank"
          class="hyperlink"
        >Matt Solomon</a>
        <br><br>
        Icon made by <a
          href="https://www.flaticon.com/authors/freepik"
          target="_blank"
          class="hyperlink"
        >Freepik</a> from <a
          href="http://www.flaticon.com/"
          target="_blank"
          class="hyperlink"
        >https://www.flaticon.com/</a>.
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'BaseLayout',

  computed: {
    ...mapState({
      userAddress: (state) => state.user.address,
    }),
  },

  methods: {
    toggleNightMode() {
      const isDark = !this.$q.dark.isActive;
      this.$q.dark.set(isDark);
      this.$q.localStorage.set('isDark', isDark);
    },
  },
};
</script>
