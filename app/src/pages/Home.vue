<template>
  <q-page padding>
    <div class="text-center">
      <h1 class="header-black primary">
        Stream Donations
      </h1>
      <h4 class="body-bold q-mt-md">
        Join your Endaoment. Choose your amount. Start streaming.
      </h4>

      <div class="row justify-center q-mb-xl">
        <div>
          <div class="q-mt-xl q-mb-md">
            Featured Endaoment
          </div>
          <endaoment-card
            :id="featuredId"
            class="center"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import EndaomentCard from 'components/EndaomentCard';

export default {
  name: 'Home',

  components: {
    EndaomentCard,
  },

  data() {
    return {
      featuredId: 0,
    };
  },
};
</script>
