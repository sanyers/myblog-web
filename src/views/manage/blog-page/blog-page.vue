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
          <div>
            <span class="title"> {{ item.name }}</span>
            <p class="desc">{{ item.desc || '暂无描述' }}</p>
          </div>
          <div class="item-right">
            <template v-if="item.release">
              <i
                v-if="item.isTop"
                class="iconfont icon-untop"
                title="取消置顶"
                @click.stop="onTop(item)"></i>
              <i
                v-else
                class="iconfont icon-top"
                title="置顶"
                @click.stop="onTop(item)"></i>
            </template>

            <i
              v-if="item.release"
              class="iconfont icon-unrelease"
              title="取消发布"
              @click.stop="onRelease(item)"></i>
            <i
              v-else
              class="iconfont icon-fabu"
              title="发布"
              @click.stop="onRelease(item)"></i>

            <i
              class="iconfont icon-shanchu"
              title="删除"
              @click.stop="onDelete(item)"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="blog-edit" v-show="pageType === 2">
    <div class="edit-header">
      <n-button @click="pageType = 1" class="back">返回</n-button>
      <n-input
        class="edit-input"
        v-model:value="currentItem.name"
        placeholder="请输入标题" />
      <n-input
        class="edit-input"
        v-model:value="currentItem.desc"
        placeholder="请输入描述" />
      <n-button @click="onRelease()" v-if="currentItem._id">{{
        currentItem.release ? '取消发布' : '发布'
      }}</n-button>
    </div>
    <MdEditor
      class="edit-content"
      v-model="currentItem.content"
      :theme="theme"
      :preview="false"
      :noPrettier="true"
      @onSave="onSave"
      @onUploadImg="onUploadImg" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { categoryList } from '@/api/category'
import {
  getBlogList,
  blogUpdate,
  blogDelete,
  blogRelease,
  blogTop,
  blogUploadImage,
} from '@/api/blog'
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
const currentItem = ref<BlogEdit>({
  name: '',
  content: '',
  release: false,
  isTop: false,
  desc: '',
})

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
  currentItem.value = item || {
    name: '',
    content: '',
    release: false,
    isTop: false,
    desc: '',
  }
  pageType.value = 2
}

const onSave = async () => {
  const { _id, name, content, desc } = currentItem.value
  const params: any = { type1, type2, name, content, desc }
  if (_id) {
    params.id = _id
  }
  const { data } = await blogUpdate(params)
  if (data) {
    if (!_id) {
      currentItem.value._id = data
    }
    window.$message.success('保存成功')
    getBlogData()
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

const onTop = async (item?: BlogItem) => {
  const params = {
    id: item ? item._id : currentItem.value._id,
    isTop: item ? !item.isTop : !currentItem.value.isTop,
  }
  const { data } = await blogTop(params)
  if (data) {
    window.$message.success('操作成功')
    if (item) {
      item.isTop = params.isTop
    } else {
      currentItem.value.isTop = params.isTop
    }
  }
}

const onRelease = (item?: BlogItem) => {
  window.$dialog.warning({
    title: '发布',
    content: '是否发布该博客文章？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const params = {
        id: item ? item._id : currentItem.value._id,
        release: item ? !item.release : !currentItem.value.release,
      }
      const { data } = await blogRelease(params)
      if (data) {
        window.$message.success('操作成功')
        if (item) {
          item.release = params.release
        } else {
          currentItem.value.release = params.release
          getBlogData()
        }
      }
    },
  })
}

const onUploadImg = async (files: File[], callback: any) => {
  const d = new FormData()
  d.append('id', currentItem.value._id)
  d.append('type1', type1)
  d.append('type2', type2)
  files.forEach(element => {
    d.append('file', element, element.name)
  })
  const { data } = await blogUploadImage(d, () => {})
  if (data) {
    callback(data)
  }
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
    width: 320px;
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
        .title {
          font-size: 20px;
        }
        .desc {
          font-size: 12px;
          margin-top: 2px;
        }
        &:hover {
          background-color: #18a058;
          color: #fff;
        }
        .item-right {
          .iconfont {
            margin-right: 16px;
          }
        }
      }
    }
  }
}
.blog-edit {
  height: 100%;
  .edit-header {
    .back {
      margin-right: 16px;
    }
    .edit-input {
      width: 220px;
      margin-right: 16px;
    }
  }
  .edit-content {
    height: calc(100% - 50px) !important;
    margin-top: 6px;
  }
}
</style>
