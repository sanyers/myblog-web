<template>
  <div class="category-page">
    <ul class="category-list">
      <li class="item-top">
        <n-button @click="onAddType()">
          <i class="iconfont icon-tianjia"></i>添加
        </n-button>
      </li>
      <li
        v-for="item in categoryData"
        :key="item._id"
        :class="{ 'item-li': true, active: item.isActive }"
        @click="onItem(item)">
        <span> {{ item.name }}</span>
        <span>
          <i
            class="iconfont icon-bianji"
            title="编辑"
            @click.stop="onEditType(item.name, item._id)"></i>
          <i
            class="iconfont icon-shanchu"
            title="删除"
            @click.stop="onDelete(item, 1)"></i>
        </span>
      </li>
    </ul>
    <ul class="category-list" v-if="currentIndex">
      <li class="item-top">
        <n-button @click="onAddType(currentIndex._id)">
          <i class="iconfont icon-tianjia"></i>添加
        </n-button>
      </li>
      <li class="item-li" v-for="item in currentIndex.typeList" :key="item._id">
        <span> {{ item.name }}</span>
        <span>
          <i
            class="iconfont icon-bianji"
            title="编辑"
            @click.stop="onEditType(item.name, item._id, currentIndex._id)"></i>
          <i
            class="iconfont icon-shanchu"
            title="删除"
            @click.stop="onDelete(item, 2)"></i>
        </span>
      </li>
    </ul>

    <CategoryUpdate ref="categoryUpdateRef" @on-update="getCategoryData" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { categoryList, categoryDelete } from '@/api/category'
import { CategoryItem } from '../../pages/data'
import CategoryUpdate from './category-update.vue'

const categoryData = ref<CategoryItem[]>([])
const currentIndex = ref<CategoryItem>()
const categoryUpdateRef = ref()

const getCategoryData = async () => {
  const { data } = await categoryList()
  if (data) {
    data.forEach((element: CategoryItem) => {
      element.isActive = false
    })
    categoryData.value = data
    currentIndex.value = null
  }
}

const onItem = (item: CategoryItem) => {
  categoryData.value.forEach(element => {
    element.isActive = false
  })
  item.isActive = true
  currentIndex.value = item
}

const onAddType = (typeId?: string) => {
  categoryUpdateRef.value.add(typeId)
}

const onEditType = (name: string, id: string, typeId?: string) => {
  categoryUpdateRef.value.edit(name, id, typeId)
}

const onDelete = (item: CategoryItem, type: number) => {
  window.$dialog.warning({
    title: '删除',
    content: '是否删除该分类？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { data } = await categoryDelete({ id: item._id, type })
      if (data) {
        window.$message.success('删除成功')
        getCategoryData()
      }
    },
  })
}

onMounted(() => {
  getCategoryData()
})
</script>
<style lang="less" scoped>
.category-page {
  height: 100%;
  display: flex;
  .category-list {
    width: 240px;
    margin-right: 6px;
    overflow: auto;
    .item-top {
      margin-bottom: 6px;
      .iconfont {
        margin-right: 6px;
      }
    }
    .item-li {
      padding: 6px 12px;
      margin-bottom: 6px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      &:hover {
        background-color: #18a058;
        color: #fff;
      }
      .iconfont {
        margin-left: 16px;
      }
    }
    .active {
      background-color: #18a058;
      color: #fff;
    }
  }
}
</style>
