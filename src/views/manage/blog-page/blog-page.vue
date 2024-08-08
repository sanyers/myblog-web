<template>
  <div class="blog-page" v-show="pageType === 1">
    <div class="tree-div">
      <n-tree block-line :data="treeData" selectable :node-props="nodeProps" />
    </div>
    <div class="blog-list">
      <div class="blog-top" v-if="isAdd">
        <n-button @click="onItem()">
          <i class="iconfont icon-tianjia"></i>添加
        </n-button>
      </div>
      <ul>
        <li
          class="blog-item"
          v-for="item in blogData"
          :key="item._id"
          @click="onItem(item)">
          <span> {{ item.name }}</span>
          <i
            class="iconfont icon-shanchu"
            title="删除"
            @click.stop="onDelete(item)"></i>
        </li>
      </ul>
    </div>
  </div>
  <div class="blog-edit" v-show="pageType === 2">
    <div class="edit-header">
      <n-button @click="pageType = 1">返回</n-button>
      <n-input class="edit-input" v-model:value="currentItem.name" />
    </div>
    <MdEditor
      class="edit-content"
      v-model="currentItem.content"
      :theme="theme"
      :preview="false"
      @onSave="onSave" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { categoryList } from '@/api/category'
import { getBlogList, blogUpdate, blogDelete } from '@/api/blog'
import { CategoryItem } from '../../pages/data'
import type { TreeOption } from 'naive-ui'
import { BlogItem } from '@/views/pages/list/data'
import { getTheme } from '@/utils/device'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { BlogEdit } from './data'

const treeData = ref([])
const pageType = ref(1)
const blogData = ref<BlogItem[]>([])
let type1 = ''
let type2 = ''
const isAdd = ref(false)
const theme = getTheme()
const currentItem = ref<BlogEdit>({ name: '', content: '' })

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      if (option.parentId) {
        isAdd.value = true
        type1 = option.parentId as string
        type2 = option.key as string
        getBlogData()
      } else {
        isAdd.value = false
        blogData.value = []
      }
    },
  }
}

const getBlogData = async () => {
  const params = {
    type1,
    type2,
    pageNum: 1,
    pageSize: 1000,
  }
  const { data } = await getBlogList(params)
  if (data) {
    blogData.value = data.list
  }
}

const getCategoryData = async () => {
  const { data } = await categoryList()
  if (data) {
    treeData.value = data.map((i: CategoryItem) => ({
      label: i.name,
      key: i._id,
      children: i.typeList.map(j => ({
        label: j.name,
        key: j._id,
        parentId: i._id,
      })),
    }))
  }
}

const onItem = (item?: BlogItem) => {
  currentItem.value = item || { name: '', content: '' }
  pageType.value = 2
}

const onSave = async () => {
  const { _id, name, content } = currentItem.value
  const params: any = { type1, type2, name, content }
  if (_id) {
    params.id = _id
  }
  const { data } = await blogUpdate(params)
  if (data) {
    window.$message.success('保存成功')
  }
}

const onDelete = (item: BlogItem) => {
  window.$dialog.warning({
    title: '删除',
    content: '是否删除该博客文章？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { data } = await blogDelete({ id: item._id })
      if (data) {
        window.$message.success('删除成功')
        getBlogData()
      }
    },
  })
}

onMounted(() => {
  getCategoryData()
})
</script>
<style lang="less" scoped>
.blog-page {
  height: 100%;
  display: flex;
  .tree-div {
    height: 100%;
    overflow: auto;
    margin-right: 16px;
  }
  .blog-list {
    width: 220px;
    height: 100%;
    .blog-top {
      margin-bottom: 6px;
    }
    ul {
      height: calc(100% - 40px);
      overflow: auto;
      .blog-item {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        padding: 6px 12px;
        &:hover {
          background-color: #18a058;
          color: #fff;
        }
      }
    }
  }
}
.blog-edit {
  height: 100%;
  .edit-header {
    .edit-input {
      width: 220px;
      margin: 0 24px;
    }
  }
  .edit-content {
    height: calc(100% - 50px) !important;
    margin-top: 6px;
  }
}
</style>
