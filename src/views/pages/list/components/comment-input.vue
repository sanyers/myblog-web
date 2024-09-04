<template>
  <div class="comment-input">
    <div class="input-info">
      <span class="label">昵称：</span>
      <n-input v-model:value="userName" placeholder="请输入昵称" />
      <span class="label" style="margin-left: 24px">邮箱：</span>
      <n-input v-model:value="userEmail" placeholder="请输入邮箱" />
    </div>

    <span>内容：</span>
    <n-input
      ref="descValueRef"
      v-model:value="userDesc"
      type="textarea"
      :autosize="{ minRows: 4, maxRows: 4 }"
      placeholder="请输入评论内容" />
    <n-button style="margin-top: 16px" @click="onSubmit" :loading="loading">
      提交
    </n-button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { commentUpdate } from '@/api/comment'
import { LOGIN_CONF } from '@/config'

const props = defineProps({
  blogId: {
    type: String,
    default: '',
  },
  quoteId: {
    type: Number,
    default: 0,
  },
  isFocus: {
    type: Boolean,
    default: false,
  },
})

const userName = ref(
  localStorage.getItem(LOGIN_CONF.NAME) ||
    localStorage.getItem(LOGIN_CONF.user) ||
    '',
)
const userEmail = ref(localStorage.getItem(LOGIN_CONF.email))
const userDesc = ref('')
const loading = ref(false)
const descValueRef = ref()
const emits = defineEmits(['on-update'])

const onSubmit = async () => {
  if (!userName.value) {
    window.$message.warning('昵称不能为空！')
    return
  }
  if (!userDesc.value) {
    window.$message.warning('评论内容不能为空！')
    return
  }
  const params: any = {
    blogId: props.blogId,
    desc: userDesc.value,
    userName: userName.value,
    email: userEmail.value,
  }
  if (props.quoteId) {
    params.quoteId = props.quoteId
  }

  loading.value = true
  try {
    await commentUpdate(params)
  } catch (e) {}
  loading.value = false
  emits('on-update')
  userDesc.value = ''
  if (!localStorage.getItem(LOGIN_CONF.NAME)) {
    localStorage.setItem(LOGIN_CONF.user, userName.value)
  }
  if (userEmail.value) {
    localStorage.setItem(LOGIN_CONF.email, userEmail.value)
  }
}

onMounted(() => {
  if (props.isFocus) {
    nextTick(() => {
      const div: any = descValueRef.value
      if (div) {
        div.focus()
      }
    })
  }
})
</script>
<style lang="less" scoped>
.comment-input {
  .input-info {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .n-input {
      flex: 1;
    }
  }
}
</style>
