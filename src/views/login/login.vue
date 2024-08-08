<template>
  <n-layout>
    <div class="login-page">
      <p class="login-top">
        <i class="iconfont icon-baitian" @click="setTheme()"></i>
      </p>
      <login-input />
      <div class="page-right">
        <!-- <p class="page-title">我的博客</p> -->
      </div>
    </div>
  </n-layout>
</template>
<script setup lang="ts">
import { setTheme } from '@/utils/device'
import LoginInput from '@/components/login-input/login-input.vue'
import { useMessage, useDialog } from 'naive-ui'

window.$message = useMessage()
window.$dialog = useDialog()
</script>
<style lang="less" scoped>
.n-layout {
  height: 100%;
  background-color: rgb(0, 122, 255);
}
.login-page {
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-top {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #fff;
    .iconfont {
      margin-left: 13px;
      font-size: 28px;
      cursor: pointer;
    }
  }
  .page-title {
    font-size: 95px;
    font-weight: 700;
    color: #fff;
  }
  .page-right {
    position: relative;
    margin-left: 10vw;
  }
}

@media only screen and (max-width: 768px) {
  .login-page {
    width: 100%;
    display: block;
    .login-top {
      position: relative;
      top: auto;
      right: auto;
      text-align: right;
      padding-right: 16px;
    }
    .page-right {
      display: none;
    }
  }
}
</style>
