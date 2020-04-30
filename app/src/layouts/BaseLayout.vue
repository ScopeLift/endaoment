<template>
  <q-layout view="hhh Lpr fff">
    <!-- HEADER -->
    <q-header
      class="q-mx-md q-mt-md"
      style="color: #000000; background-color: rgba(0,0,0,0)"
    >
      <div class="row justify-between items-center">
        <!-- Left half -->
        <div class="col-auto">
          <!-- Logo and app name -->
          <div>
            <div
              class="row justify-start items-center"
            >
              <img
                alt="Endaoment logo"
                class="cursor-pointer q-ml-md"
                src="statics/app-logo-128x128.png"
                style="max-width: 50px;"
                @click="$router.push({ name: 'home' });"
              >
              <div
                class="cursor-pointer header-black dark-toggle q-pl-md"
                style="font-size: 2rem"
                @click="$router.push({ name: 'home' });"
              >
                Endaoment
              </div>
              <div class="q-ml-xl" />
              <router-link
                :to="{name: 'endaoments'}"
                active-class="page-active"
                class="page dark-toggle"
              >
                Find Endaoments
              </router-link>
              <router-link
                :to="{name: 'about'}"
                active-class="page-active"
                class="page dark-toggle"
              >
                About
              </router-link>
            </div>
          </div>
        </div>
        <!-- Right half -->
        <!-- User info and settings -->
        <div class="col-auto">
          <div
            v-if="userAddress"
            class="text-caption dark-toggle q-mr-md"
          >
            Account: {{ userAddress }}
          </div>
          <div class="row justify-end items-center q-mt-xs">
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
            <div class="q-mx-md" />
            <div
              v-if="!userAddress"
              class="q-mr-md"
            >
              <connect-wallet label="Sign in" />
            </div>
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
      <div class="text-center dark-toggle q-my-xl">
        <div>
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
        </div>
        <br><br>
        <div class="text-caption">
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
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex';
import ConnectWallet from 'components/ConnectWallet';

export default {
  name: 'BaseLayout',

  components: {
    ConnectWallet,
  },

  computed: {
    ...mapState({
      userAddress: (state) => state.user.userAddress,
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

<style lang="scss">
.page, .page-active {
  font-family: 'body';
  font-size: 1rem;
  margin: 0.3rem 1rem 0 1rem;
  text-decoration: none;
}

.page-active {
  font-family: 'bodyBold'
}
</style>
