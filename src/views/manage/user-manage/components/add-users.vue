<template>
  <n-modal v-model:show="showModal">
    <div class="modal-index">
      <p class="header">
        <i class="iconfont icon-close" @click="showModal = false"></i>
      </p>
      <div class="title">添加用户</div>
      <div class="content">
        <p class="items"><span style="color: #f00">*</span><b>账号：</b></p>
        <n-input
          class="input-item"
          v-model:value="userName"
          placeholder="请输入账号" />

        <p class="items"><span style="color: #f00">*</span><b>密码：</b></p>
        <n-input
          class="input-item"
          type="password"
          v-model:value="userPwd"
          placeholder="请输入密码" />

        <p class="items">
          <b>权限：</b>
        </p>
        <n-select
          class="input-item"
          style="margin-bottom: 16px"
          v-model:value="rolesValue"
          placeholder="请选择权限"
          :options="rolesOption" />
        <n-button class="btn-item" @click="onSave" :loading="loading">
          确定
        </n-button>
      </div>
    </div>
  </n-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { addUser } from '@/api/user'
import { getRoleOptions } from '../data'
import i18n from '@/i18n'

const { t } = i18n.global
const showModal = ref(false)
const userName = ref('')
const userPwd = ref('')
const rolesValue = ref(1)
const rolesOption = getRoleOptions()
const loading = ref(false)

const show = () => {
  userName.value = ''
  userPwd.value = ''
  rolesValue.value = 1
  loading.value = false
  showModal.value = true
}

const hide = () => {
  showModal.value = false
}

defineExpose({ show, hide })

const emits = defineEmits(['on-update'])

const onSave = async () => {
  if (!userName.value) {
    window.$message.info('账号名不能为空')
    return
  }
  if (!userPwd.value) {
    window.$message.info('密码不能为空')
    return
  }
  loading.value = true
  const params = {
    userName: userName.value,
    userPwd: userPwd.value,
    role: rolesValue.value,
  }
  try {
    const { data } = await addUser(params)
    if (data) {
      window.$message.success('添加成功')
      emits('on-update')
      hide()
    }
  } catch (e) {}

  loading.value = false
}
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
      margin-bottom: 16px;
    }
    .items {
      margin-bottom: 6px;
    }
  }
}
</style>
