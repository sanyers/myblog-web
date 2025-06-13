<template>
  <n-modal v-model:show="showModal">
    <div class="modal-index">
      <p class="header">
        <i class="iconfont icon-close" @click="showModal = false"></i>
      </p>
      <div class="title">配置权限</div>
      <div class="content" v-if="currentUser">
        <p class="items"><b>当前用户：</b>{{ currentUser.userName }}</p>
        <p class="items">
          <b>权限：</b>
        </p>
        <n-select
          class="input-item"
          style="margin-bottom: 16px"
          v-model:value="rolesValue"
          placeholder="请选择权限"
          :options="rolesOption" />
        <n-button class="btn-item" @click="onSave"> 确定 </n-button>
      </div>
    </div>
  </n-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { UserItem, getRoleOptions } from '../data'
import { setUserRole } from '@/api/user'

const showModal = ref(false)
const currentUser = ref<UserItem>()
const rolesValue = ref()
const rolesOption = ref(getRoleOptions())
const emits = defineEmits(['on-update'])

const show = (user: UserItem) => {
  currentUser.value = user
  rolesValue.value = user.role
  showModal.value = true
}

const hide = () => {
  showModal.value = false
}

const onSave = async () => {
  const params = {
    userName: currentUser.value.userName,
    role: rolesValue.value,
  }
  const { data } = await setUserRole(params)
  if (data) {
    window.$message.success('设置成功')
    emits('on-update')
    hide()
  }
}

defineExpose({ show, hide })
</script>
<style lang="less" scoped>
.modal-index {
  width: 30rem;
  box-shadow: 0 5px 20px hsla(0, 0%, 7%, 0.1);
  background-color: var(--n-color);
  border-radius: 2px;
  padding: 2rem;
  padding-top: 1rem;
  box-sizing: border-box;
  position: relative;
  .title {
    font-size: 18px;
  }
  .header {
    position: absolute;
    right: 1rem;
    .iconfont {
      cursor: pointer;
    }
  }
  .content {
    margin-top: 13px;
    .input-item {
      margin-bottom: 6px;
    }
    .items {
      margin-bottom: 10px;
    }
  }
}
</style>
