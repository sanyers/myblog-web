<template>
  <div :class="'login-input ' + (isDark ? 'dark' : '')">
    <template v-if="isLogon">
      <p class="login-title">
        {{ loginText.title }}
      </p>
      <n-tabs default-value="userLogin" size="large" animated>
        <n-tab-pane name="userLogin" :tab="loginText.user">
          <sf-form
            ref="userFormRef"
            :data="userFormValue"
            @on-password-enter="onUserLogin" />
          <n-button type="info" block @click="onUserLogin">
            {{ loginText.button }}
          </n-button>
        </n-tab-pane>
      </n-tabs>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import SfForm from '@/components/st-form.vue'
import { useRouter, useRoute } from 'vue-router'
import { userLogin } from '@/api/user'
import userData from './user-data'
import { LOGIN_CONF } from '@/config'
import { getTheme } from '@/utils/device'

const { userLoginData, loginText } = userData

const route = useRoute()
const router = useRouter()
const isLogon = ref(true)
const isDark = ref(getTheme())

const userFormValue = ref(userLoginData())
const userFormRef = ref(null)
const onUserLogin = () => {
  userFormRef.value?.validate(async (d: any) => {
    const { data } = await userLogin(d)
    if (data) {
      logoSuccess(data)
    }
  })
}

function logoSuccess(data: any) {
  localStorage.setItem(LOGIN_CONF.NAME, data.userName)
  localStorage.setItem(LOGIN_CONF.KEY, data.token)
  const url = route.query.url as string
  if (url) {
    location.href = url
  } else {
    router.push({ path: '/manage' })
  }
}
</script>
<style lang="less" scoped>
.login-input {
  width: 30rem;
  box-shadow: 0 5px 20px hsla(0, 0%, 7%, 0.1);
  background-color: #fff;
  border-radius: 20px;
  padding: 2rem;
  padding-top: 1rem;
  box-sizing: border-box;
  position: relative;
  .login-title {
    font-size: 30px;
    text-align: center;
    font-weight: 500;
    margin: 16px 0;
  }
}
.dark {
  background-color: #423e3e;
}
@media only screen and (max-width: 768px) {
  .login-input {
    width: 100%;
    box-shadow: none;
    .login-title {
      font-size: 24px;
      text-align: left;
      margin: 8px 0;
    }
  }
  .dark {
    background-color: var(--n-color);
  }
}
</style>
