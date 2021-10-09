<template>
  <div>
    <UploadFile v-model="picture"></UploadFile>
    <!-- <img :src="picture" /> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'upload',
  data() {
    return {
      picture: null,
    }
  },
})
</script>

<style>
</style>