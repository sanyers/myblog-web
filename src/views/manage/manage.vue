<template>
  <div class="user-page">
    <n-layout class="layout-index">
      <n-layout-header>
        <user-header @on-router="onRouter" :nav="menuOptions" />
      </n-layout-header>
      <n-layout class="layout-div" has-sider>
        <n-layout-sider
          class="layout-nav"
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="200"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false">
          <n-menu
            class="menu-index"
            v-model:value="activeKey"
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :inverted="true"
            @update:value="handleUpdateValue" />
        </n-layout-sider>
        <n-layout-content class="layout-content">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserHeader from './user-header.vue'
import { navList } from './data'
import { useRoute, useRouter } from 'vue-router'
import { useMessage, useDialog } from 'naive-ui'

window.$message = useMessage()
window.$dialog = useDialog()
const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const menuOptions = ref(navList())
const activeKey = ref('')

const handleUpdateValue = () => {
  router.push({ name: activeKey.value })
}

const onRouter = (name: string) => {
  activeKey.value = name
}

onMounted(() => {
  activeKey.value = route.name as string
})
</script>
<style lang="less" scoped>
.user-page {
  font-size: 14px;
  height: 100%;
  .layout-index {
    height: 100%;
    .layout-content {
      padding: 13px;
    }
    .layout-div {
      height: calc(100% - 61px);
    }
    .menu-index {
      --n-item-text-color-hover: #18a058 !important;
      --n-item-icon-color-hover: #18a058 !important;
      ::v-deep(.iconfont) {
        font-size: 20px;
      }
    }
  }
}
@media only screen and (max-width: 768px) {
  .user-page {
    .layout-nav {
      display: none;
    }
  }
}
</style>
