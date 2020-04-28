<template>
  <div
    class="cursor-pointer"
    @click="$router.push({ name: 'endaomentDetails', params: {id} })"
  >
    <q-card class="endaoment">
      <q-card-section>
        <h4 class="header-black accent">
          {{ title }}
        </h4>
        <div class="text-caption text-grey">
          ${{ bankSize }} pledged
          <br>
          {{ numberOfMembers }} member<span v-if="numberOfMembers !== 1">s</span>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-justify">
          {{ description.slice(0,280) }}...
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'EndaomentCard',

  props: {
    id: {
      require: true,
      type: Number,
      default: undefined,
    },
  },

  data() {
    return {};
  },

  computed: {
    // TODO Fetch endaoment data based on ID
    bankSize() {
      return 1150;
    },
    description() {
        return 'TODO this title and description should be loaded from endaoment contract storage. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lorem velit, vestibulum sed dictum ac, molestie vel sapien. Mauris ac faucibus justo, a lacinia mauris. Cras aliquam tortor nec est commodo, nec convallis ligula molestie. Nunc elementum in risus nec placerat. Duis viverra, tellus quis dignissim pharetra, ipsum lectus dignissim urna, a fringilla enim lacus non velit. Aliquam vulputate lacus vitae metus varius, in interdum massa pretium. Nunc id diam urna. Cras gravida est eu justo aliquet hendrerit' // eslint-disable-line
    },
    numberOfMembers() {
      return 7;
    },
    title() {
      return 'COVID-19 Relief';
    },
  },
};
</script>

<style lang="scss" scoped>
.endaoment {
  max-width: 500px;
  padding: 2rem;
  text-align: left;
}
</style>
