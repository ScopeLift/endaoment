<template>
  <q-page padding>
    <the-cause-details :id="$route.params.id" />
  </q-page>
</template>

<script>
import TheCauseDetails from 'components/TheCauseDetails';

export default {
  name: 'CauseDetails',

  components: {
    TheCauseDetails,
  },
};
</script>
