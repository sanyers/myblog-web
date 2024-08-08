<template>
  <n-modal v-model:show="showModal">
    <div class="modal-index">
      <p class="header">
        <i class="iconfont icon-close" @click="showModal = false"></i>
      </p>
      <div class="title">{{ pageType === 1 ? '添加分类' : '编辑分类' }}</div>
      <div class="content">
        <n-input v-model:value="categoryName" placeholder="请输入分类名称" />
        <n-button @click="onSave">确定</n-button>
      </div>
    </div>
  </n-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { categoryCreate, categoryUpdate } from '@/api/category'

const showModal = ref(false)
const pageType = ref(1)
const categoryName = ref('')
let parentId = ''
let editId = ''
const emits = defineEmits(['on-update'])

const add = (id?: string) => {
  pageType.value = 1
  parentId = id || ''
  categoryName.value = ''
  showModal.value = true
}

const edit = (name: string, id: string, parentIds?: string) => {
  pageType.value = 2
  categoryName.value = name
  editId = id
  parentId = parentIds || ''
  showModal.value = true
}

const hide = () => {
  showModal.value = false
}

const onSave = async () => {
  if (pageType.value === 1) {
    const params: any = { name: categoryName.value }
    if (parentId) {
      params.parentId = parentId
      params.type = 2
    } else {
      params.type = 1
    }
    const { data } = await categoryCreate(params)
    if (data) {
      window.$message.success('添加成功')
      emits('on-update')
      hide()
    }
  } else {
    const params: any = {
      id: editId,
      name: categoryName.value,
      type: parentId ? 2 : 1,
    }
    const { data } = await categoryUpdate(params)
    if (data) {
      window.$message.success('修改成功')
      emits('on-update')
      hide()
    }
  }
}

defineExpose({ add, edit, hide })
</script>
<style lang="less" scoped>
.modal-index {
  width: 400px;
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
