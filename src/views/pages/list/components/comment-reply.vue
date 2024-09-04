<template>
  <n-modal v-model:show="showModal">
    <div class="modal-index">
      <p class="header">
        <i class="iconfont icon-close" @click="showModal = false"></i>
      </p>
      <div class="title">回复</div>
      <div class="content">
        <CommentInput
          @on-update="onUpdate"
          :blog-id="blogId"
          :quote-id="quoteId"
          :is-focus="true" />
      </div>
    </div>
  </n-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import CommentInput from './comment-input.vue'

const showModal = ref(false)
const emits = defineEmits(['on-update'])
const blogId = ref('')
const quoteId = ref(0)

const show = (blogIds: string, quoteIds: number) => {
  blogId.value = blogIds
  quoteId.value = quoteIds
  showModal.value = true
}

const hide = () => {
  showModal.value = false
}

const onUpdate = () => {
  hide()
  emits('on-update')
}

defineExpose({ show, hide })
</script>
<style lang="less" scoped>
.modal-index {
  width: 600px;
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
  }
}
@media only screen and (max-width: 768px) {
  .modal-index {
    width: 100%;
    padding: 1rem;
  }
}
</style>
