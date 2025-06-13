<template>
  <n-dropdown trigger="hover" :options="options" @select="handleSelect">
    <n-button type="info" size="small" text>
      <i class="iconfont icon-more" @click.stop></i>
    </n-button>
  </n-dropdown>
</template>
<script lang="ts" setup>
defineProps({
  options: Array<any>,
  handleSelect: Function,
})
</script>
