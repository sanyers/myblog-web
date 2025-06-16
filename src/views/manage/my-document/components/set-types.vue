<template>
  <n-modal v-model:show="showModal">
    <div class="modal-index">
      <p class="header">
        <i class="iconfont icon-close" @click="showModal = false"></i>
      </p>
      <div class="title">修改栏目</div>
      <div class="content">
        <div class="item">
          <span>栏目：</span>
          <n-select
            class="input-item"
            v-model:value="type1"
            :options="type1Options"
            @update:value="onUpdateType" />
          <n-select
            class="input-item"
            v-if="type1"
            v-model:value="type2"
            :options="type2Options" />
        </div>
        <n-button
          v-if="type2"
          class="btn-item"
          @click="onSave"
          :loading="loading">
          确定
        </n-button>
      </div>
    </div>
  </n-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { setBlogType } from '@/api/blog'
import { CategoryItem } from '@/utils/types'

let id = ''
const type1 = ref('')
const type1Options = ref([])
const type2 = ref('')
const type2Options = ref([])
const showModal = ref(false)
const loading = ref(false)
let categoryData: CategoryItem[] = []
const emits = defineEmits(['on-update'])

const onUpdateType = () => {
  type2.value = ''
  const item = categoryData.find(i => i._id === type1.value)
  if (item) {
    type2Options.value = item.typeList.map((i: CategoryItem) => ({
      label: i.name,
      value: i._id,
    }))
  }
}

const initTypes = (_type1: string, _type2: string) => {
  type1Options.value = categoryData.map((i: CategoryItem) => ({
    label: i.name,
    value: i._id,
  }))
  type1.value = _type1

  const item = categoryData.find(i => i._id === type1.value)
  if (item) {
    type2Options.value = item.typeList.map((i: CategoryItem) => ({
      label: i.name,
      value: i._id,
    }))
  }
  type2.value = _type2
}

const show = (
  _id: string,
  _type1: string,
  _type2: string,
  _categoryData: CategoryItem[],
) => {
  id = _id
  categoryData = _categoryData
  initTypes(_type1, _type2)
  showModal.value = true
}

const hide = () => {
  showModal.value = false
}

const onSave = async () => {
  loading.value = true
  const params = { id, type1: type1.value, type2: type2.value }
  const { data } = await setBlogType(params)
  if (data) {
    emits('on-update')
    hide()
  }
  loading.value = false
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
      margin-bottom: 16px;
    }
    .item {
      margin-bottom: 16px;
    }
  }
}
</style>
