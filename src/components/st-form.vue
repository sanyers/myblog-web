<template>
  <n-form ref="formRef" :model="data" :show-require-mark="false">
    <n-form-item-row v-for="item in data" v-bind="item">
      <n-input
        v-if="item.type === 'text'"
        v-model:value="item.value"
        type="text"
        :placeholder="item.placeholder" />

      <n-input
        v-if="item.type === 'password'"
        v-model:value="item.value"
        type="password"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        :input-props="{ autocomplete: 'off' }"
        show-password-on="mousedown"
        @input="item.onInput"
        @keyup.enter="onPasswordEnter" />

      <n-input-group v-if="item.type === 'phone'">
        <n-input-group-label>{{ item.leftTxt }}</n-input-group-label>
        <n-input
          type="text"
          v-model:value="item.value"
          :placeholder="item.placeholder" />
      </n-input-group>

      <n-input-group v-if="item.type === 'code'">
        <n-input
          type="text"
          v-model:value="item.value"
          :disabled="item.disabled"
          :placeholder="item.placeholder"
          @input="item.onInput"
          @keyup.enter="onCodeEnter" />
        <n-button
          type="primary"
          ghost
          :disabled="item.rightDisabled"
          @click="onCodeSend(item)">
          {{ item.rightTxt }}
        </n-button>
      </n-input-group>
    </n-form-item-row>
  </n-form>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
const message = useMessage()
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  showRequireMark: {
    type: Boolean,
    defalut: false,
  },
})
const emits = defineEmits([
  'on-password-enter',
  'on-code-enter',
  'on-code-send',
])
const onPasswordEnter = () => {
  emits('on-password-enter')
}
const onCodeEnter = () => {
  emits('on-code-enter')
}
const onCodeSend = (item: any) => {
  emits('on-code-send', () => {
    item.rightWait = true
    item.rightDisabled = true
    message.success(item.codeTitle)
    setFun(60, item, () => {
      item.rightTxt = item.rightTxt3
      item.rightDisabled = false
      item.rightWait = false
    })
  })
}

function setFun(count: number, item: any, cb: Function) {
  item.rightTxt = count + ' ' + item.rightTxt2
  count--
  if (count === 0) {
    cb()
  } else {
    setTimeout(() => {
      setFun(count, item, cb)
    }, 1000)
  }
}

const formRef = ref(null)
const validate = (success: Function, error: Function) => {
  if (formRef.value) {
    const v = formRef.value as any
    v.validate((errors: any) => {
      if (!errors) {
        const obj = {}
        for (let i in props.data) {
          const item = props.data[i]
          obj[item.bindKey] = item.value
        }
        success && success(obj)
      } else {
        error && error()
      }
    })
  }
}
defineExpose({ validate })
</script>
<style lang="less" scoped></style>
