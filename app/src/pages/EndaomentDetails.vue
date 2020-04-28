<template>
  <q-page padding>
    <the-endaoment-details :id="$route.params.id" />
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
