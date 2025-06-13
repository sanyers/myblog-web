<template>
  <div class="home-page">
    <ul v-if="systemInfo">
      <li>
        <span><b>主机名：</b></span>
        <span>{{ systemInfo.hostname }}</span>
      </li>
      <li>
        <span><b>系统类型：</b></span>
        <span>{{ systemInfo.type }}</span>
      </li>
      <li>
        <span><b>机器类型：</b></span>
        <span>{{ systemInfo.machine }}</span>
      </li>
      <li>
        <span><b>系统CPU架构：</b></span>
        <span>{{ systemInfo.arch }}</span>
      </li>
      <li>
        <span><b>CPU：</b></span>
        <span>{{ systemInfo.cpu }}</span>
      </li>
      <li>
        <span><b>运行内存：</b></span>
        <span>{{ bytesToSize(systemInfo.rss) }}</span>
      </li>
      <li>
        <span><b>运行时间：</b></span>
        <span>{{ systemInfo.uptime }}</span>
      </li>
    </ul>

    <n-button v-if="isAdmin" @click="onRestart">重启服务</n-button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSystem, setSystemRestart } from '@/api/system'
import { bytesToSize } from '@/utils/bytes'
import { LOGIN_CONF } from '@/config'

const systemInfo = ref()
const isAdmin = ref(false)

const getSystemData = async () => {
  const { data } = await getSystem()
  if (data) {
    systemInfo.value = data
  }
}

const onRestart = () => {
  window.$dialog.warning({
    title: '重启服务',
    content: '是否立即重启服务？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { data } = await setSystemRestart()
      if (data) {
        window.$message.success('重启成功')
        setTimeout(() => {
          getSystemData()
        }, 3000)
      }
    },
  })
}

onMounted(() => {
  const role = localStorage.getItem(LOGIN_CONF.role)
  isAdmin.value = role === '0'
  getSystemData()
})
</script>
<style lang="less" scoped>
.home-page {
  height: 100%;
  li {
    line-height: 34px;
  }
}
</style>
