<template>
  <div class="user-info">
    <ul v-if="info">
      <li>
        <span><b>账号：</b></span>
        <span>{{ info.userName }}</span>
      </li>
      <li>
        <span><b>权限：</b></span>
        <span>{{ info.role === 0 ? '管理员' : '普通用户' }}</span>
      </li>
      <li>
        <span><b>注册时间：</b></span>
        <span>{{ getTimes(info.ctime) }}</span>
      </li>
    </ul>
    <n-button @click="onUpdatePwd">修改密码</n-button>

    <UpdatePassword ref="updatePasswordRef" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { userInfo } from '@/api/user'
import UpdatePassword from './components/update-password.vue'

const updatePasswordRef = ref()
const info = ref()

const getTimes = computed(() => {
  return function (time: number) {
    return new Date(time * 1000).toLocaleString()
  }
})

const getUserInfo = async () => {
  const { data } = await userInfo()
  if (data) {
    info.value = data
  }
}

const onUpdatePwd = () => {
  updatePasswordRef.value.show()
}

onMounted(() => {
  getUserInfo()
})
</script>
<style lang="less" scoped>
.user-info {
  height: 100%;
  li {
    line-height: 34px;
  }
}
</style>
