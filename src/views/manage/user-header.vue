<template>
  <div class="user-header">
    <div class="header-left">
      <span class="title">我的博客管理系统</span>
      <n-popover placement="bottom" trigger="click">
        <template #trigger>
          <i class="iconfont icon-menu"></i>
        </template>
        <div>
          <p
            v-for="item in nav"
            :key="item.key"
            style="cursor: pointer; margin-top: 6px"
            @click="onNav(item)">
            <template v-if="typeof item.label === 'string'">
              {{ item.label }}
            </template>
            <component v-else :is="item.label"></component>
          </p>
        </div>
      </n-popover>
    </div>
    <div class="header-right">
      <i class="iconfont icon-baitian" @click="setTheme()"></i>
      <n-popover placement="bottom">
        <template #trigger>
          <label class="label-item">
            <i class="iconfont icon-user"></i>
            {{ userName }}
          </label>
        </template>
        <div>
          <p style="cursor: pointer" @click="onInfor">个人中心</p>
          <p style="cursor: pointer; margin-top: 6px" @click="onLogout">
            退出登录
          </p>
        </div>
      </n-popover>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LOGIN_CONF } from '@/config'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { setTheme } from '@/utils/device'
import { userLogout } from '@/api/user'

type NavItem = {
  label: string | any
  key: string
  icon?: any
}

defineProps({
  nav: {
    type: Array<NavItem>,
    default: () => [],
  },
})

const router = useRouter()
const userName = ref('')
const emits = defineEmits(['on-router'])

onMounted(() => {
  const isKey = localStorage.getItem(LOGIN_CONF.KEY)
  const name = localStorage.getItem(LOGIN_CONF.NAME)
  if (isKey && name) {
    userName.value = localStorage.getItem(LOGIN_CONF.NAME)
  } else {
    router.push({ name: 'login', query: { url: location.href } })
  }
})

const onLogout = async () => {
  await userLogout()
  localStorage.setItem(LOGIN_CONF.NAME, '')
  localStorage.setItem(LOGIN_CONF.KEY, '')
  router.push({ name: 'login' })
}

const onInfor = () => {
  emits('on-router', 'userInfor')
  router.push({ name: 'userInfor' })
}

const onNav = (item: any) => {
  if (typeof item.label === 'string') {
    router.push({ name: item.key })
  }
}
</script>
<style lang="less" scoped>
.user-header {
  height: 60px;
  line-height: 60px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--n-border-color);
  .header-left {
    font-size: 20px;
    .iconfont {
      display: none;
      font-size: 24px;
    }
  }
  .header-right {
    .iconfont {
      margin-left: 13px;
      font-size: 24px;
      cursor: pointer;
    }
  }
}
@media only screen and (max-width: 768px) {
  .user-header {
    .header-left {
      .title {
        display: none;
      }
      .iconfont {
        display: block;
      }
    }
  }
}
</style>
