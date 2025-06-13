<template>
  <n-modal v-model:show="showModal">
    <div class="modal-index">
      <p class="header">
        <i class="iconfont icon-close" @click="showModal = false"></i>
      </p>
      <div class="title">修改密码</div>
      <div class="content">
        <p><span style="color: #f00">*</span>旧密码</p>
        <n-input
          class="input-item"
          v-model:value="oldPwd"
          type="password"
          :input-props="{ spellcheck: false }"
          placeholder="请输入旧密码" />

        <p><span style="color: #f00">*</span>新密码</p>
        <n-input
          class="input-item"
          v-model:value="newPwd"
          type="password"
          :input-props="{ spellcheck: false }"
          placeholder="请输入新密码" />

        <p><span style="color: #f00">*</span>重复密码</p>
        <n-input
          class="input-item"
          v-model:value="renewText"
          type="password"
          :input-props="{ spellcheck: false }"
          placeholder="请输入重复密码" />

        <n-button class="input-item" @click="onSend"> 确定 </n-button>
      </div>
    </div>
  </n-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userResetpassword } from '@/api/user'
import { LOGIN_CONF } from '@/config'

const showModal = ref(false)
const oldPwd = ref('')
const newPwd = ref('')
const renewText = ref('')
const router = useRouter()

const show = () => {
  oldPwd.value = ''
  newPwd.value = ''
  renewText.value = ''
  showModal.value = true
}
const hide = () => {
  showModal.value = false
}
defineExpose({ show, hide })

const onSave = async () => {
  const params = {
    oldPwd: oldPwd.value,
    newPwd: newPwd.value,
  }
  const { data } = await userResetpassword(params)
  if (data) {
    window.$message.success('修改成功')
    localStorage.setItem(LOGIN_CONF.NAME, '')
    localStorage.setItem(LOGIN_CONF.KEY, '')
    router.push({ name: 'login' })
  }
}
const onSend = () => {
  if (!oldPwd.value) {
    window.$message.warning('旧密码不能为空')
    return
  }
  if (!newPwd.value) {
    window.$message.warning('新密码不能为空')
    return
  }
  if (!renewText.value) {
    window.$message.warning('重复密码不能为空')
    return
  }
  if (newPwd.value === renewText.value) {
    onSave()
  } else {
    window.$message.warning('重复密码与新密码不一致')
  }
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
      margin-bottom: 6px;
    }
  }
}
</style>
