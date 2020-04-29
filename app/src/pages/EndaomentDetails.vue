<template>
  <q-page padding>
    <the-endaoment-details :address="$route.params.address" />
  </q-page>
</template>

<script>
import TheEndaomentDetails from 'components/TheEndaomentDetails';

export default {
  name: 'EndaomentDetails',

  components: {
    TheEndaomentDetails,
  },
};
</script>
