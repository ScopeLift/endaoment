<template>
  <q-page padding>
    <div class="text-center">
      <h1 class="header-black primary">
        Stream Donations
      </h1>
      <h4 class="body-bold q-mt-md">
        Join your cause. Choose your amount. Start streaming.
      </h4>

      <div class="row justify-center q-mb-xl">
        <div>
          <div class="q-mt-xl q-mb-md">
            Featured Cause
          </div>
          <cause-card
            :id="featuredId"
            class="center"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import CauseCard from 'components/CauseCard';

export default {
  name: 'Home',

  components: {
    CauseCard,
  },

  data() {
    return {
      featuredId: 0,
    };
  },
};
</script>
