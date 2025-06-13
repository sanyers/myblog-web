<template>
  <n-modal v-model:show="showModal">
    <div class="modal-index">
      <p class="header">
        <i class="iconfont icon-close" @click="showModal = false"></i>
      </p>
      <div class="title">修改创建时间</div>
      <div class="content">
        <n-date-picker v-model:value="ctime" type="datetime" />
        <n-button class="btn-item" @click="onSave"> 确定 </n-button>
      </div>
    </div>
  </n-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { blogTime } from '@/api/blog'

let id = ''
const ctime = ref(0)
const showModal = ref(false)
const emits = defineEmits(['on-update'])

const show = (_id: string, time: number) => {
  id = _id
  ctime.value = time
  showModal.value = true
}

const hide = () => {
  showModal.value = false
}

const onSave = async () => {
  const params = { id, time: ctime.value }
  const { data } = await blogTime(params)
  if (data) {
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
