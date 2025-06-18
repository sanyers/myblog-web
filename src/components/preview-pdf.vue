<template>
  <div class="preview-pdf">
    <VuePdfApp :pdf="url" :title="true" />
  </div>
</template>
<script setup lang="ts">
import VuePdfApp from 'vue3-pdf-app'
import 'vue3-pdf-app/dist/icons/main.css'

defineProps({
  url: {
    type: String,
    default: '',
  },
})
</script>
<style lang="less" scoped>
.preview-pdf {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  background-color: #e1e1e1;
  .pdf-app {
    width: 100%;
    height: 100%;
  }
}
</style>
