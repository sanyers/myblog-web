<template>
  <div style="height: 100%">
    <link
      rel="resource"
      type="application/l10n"
      href="/web/viewer.properties" />
    <PreviewPdf v-if="fileUrl" :url="fileUrl" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PreviewPdf from '@/components/preview-pdf.vue'

const route = useRoute()
const fileUrl = ref('')

onMounted(() => {
  const url = route.query.url as string
  fileUrl.value = url
})
</script>
