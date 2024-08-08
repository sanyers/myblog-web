<template>
  <n-config-provider :locale="locale" :date-locale="dateLocale" :theme="theme">
    <n-dialog-provider>
      <n-message-provider>
        <n-notification-provider>
          <router-view />
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { zhCN, dateZhCN, darkTheme } from 'naive-ui'
import { getLanguage, getTheme } from '@/utils/device'

const locale = ref(null)
const dateLocale = ref(null)
const theme = ref(null)
onMounted(() => {
  const lang = getLanguage()
  if (lang === 'zh') {
    locale.value = zhCN
    dateLocale.value = dateZhCN
  }
  const style = getTheme()
  if (style === 'dark') {
    theme.value = darkTheme
  }
})
</script>
