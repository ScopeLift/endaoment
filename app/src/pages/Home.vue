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
          <cause-details
            class="center"
            :title="featured.title"
            :description="featured.description"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import CauseDetails from 'components/CauseDetails';

export default {
  name: 'Home',

  components: {
    CauseDetails,
  },

  data() {
    return {
      featured: {
        title: 'COVID-19 Relief',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lorem velit, vestibulum sed dictum ac, molestie vel sapien. Mauris ac faucibus justo, a lacinia mauris. Cras aliquam tortor nec est commodo, nec convallis ligula molestie. Nunc elementum in risus nec placerat. Duis viverra, tellus quis dignissim pharetra, ipsum lectus dignissim urna, a fringilla enim lacus non velit. Aliquam vulputate lacus vitae metus varius, in interdum massa pretium. Nunc id diam urna. Cras gravida est eu justo aliquet hendrerit' // eslint-disable-line
      },
    };
  },
};
</script>
