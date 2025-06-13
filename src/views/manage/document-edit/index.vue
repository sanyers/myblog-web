<template>
  <div
    class="document-edit"
    v-if="(pageType === '0' || pageType === '1') && documentInfo">
    <div class="header">
      <n-button @click="onBack" class="back">
        <i class="iconfont icon-left"></i>
        <span>返回</span>
      </n-button>

      <span>标题：</span>
      <n-input
        class="input-item"
        v-model:value="documentInfo.name"
        placeholder="请输入标题" />

      <template v-if="pageType === '0'">
        <span>格式：</span>
        <n-select
          class="input-item"
          style="width: 150px"
          v-model:value="formatValue"
          :options="formatOptions" />

        <span>栏目：</span>
        <n-select
          class="input-item"
          v-model:value="documentInfo.type1"
          :options="type1Options"
          @update:value="onUpdateType(true)" />
        <n-select
          class="input-item"
          v-if="documentInfo.type1"
          v-model:value="documentInfo.type2"
          :options="type2Options" />
      </template>

      <n-button
        @click="onRelease"
        v-if="pageType === '1'"
        style="margin-right: 16px">
        <i
          :class="
            'iconfont icon-' + (documentInfo.release ? 'unrelease' : 'fabu')
          "></i>
        <span style="margin-left: 6px">
          {{ documentInfo.release ? '取消发布' : '发布' }}
        </span>
      </n-button>

      <n-button
        type="warning"
        v-if="pageType === '1' && documentInfo.release"
        style="margin-right: 16px"
        @click="onQuery">
        <i class="iconfont icon-query"></i>
        <span style="margin-left: 6px">查看</span>
      </n-button>

      <n-button type="info" v-if="documentInfo.content" @click="onSave">
        <i class="iconfont icon-save"></i>
        <span style="margin-left: 6px">保存</span>
      </n-button>
    </div>
    <MdEditor
      v-if="documentInfo.type2 && formatValue === 'md'"
      class="md-content"
      v-model="documentInfo.content"
      :theme="theme"
      :preview="false"
      :noPrettier="true"
      @onSave="onSave"
      @onUploadImg="onUploadImg" />
    <div
      class="html-content"
      v-if="documentInfo.type2 && formatValue === 'html'">
      <Toolbar
        class="html-toolbar"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="default" />
      <Editor
        class="html-Editor"
        v-model="documentInfo.content"
        :defaultConfig="editorConfig"
        defaultHtml=""
        mode="default"
        :style="{ height: `calc(100% - ${height}px)` }"
        @onCreated="handleCreated" />
    </div>
  </div>
  <div class="document-edit" v-else></div>
</template>
<script setup lang="ts">
import { ref, shallowRef, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BlogItem, CategoryItem } from '@/utils/types'
import { getTheme } from '@/utils/device'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { categoryList } from '@/api/category'
import {
  blogRelease,
  blogUpdate,
  blogUploadImage,
  getBlogbyIds,
} from '@/api/blog'

import '@wangeditor-next/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import { LOGIN_CONF } from '@/config'

const route = useRoute()
const router = useRouter()
const theme = getTheme()
const pageType = ref('-1')
const documentInfo = ref<BlogItem>()
const type1Options = ref([])
const type2Options = ref([])

let id = ''
let categoryData: CategoryItem[] = []
let fromPage = ''

const formatValue = ref('md')
const formatOptions = ref([
  { label: 'HTML格式', value: 'html' },
  { label: 'Markdown格式', value: 'md' },
])

type ImageInsertFnType = (url: string, alt?: string, href?: string) => void
type VideoInsertFnType = (url: string, poster?: string) => void
const height = ref(41)
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig: any = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      customUpload(file: File, insertFn: ImageInsertFnType) {
        onUploadImg([file], (d: Array<string>) => {
          insertFn(d[0])
        })
      },
    },
    uploadVideo: {
      customUpload(file: File, insertFn: VideoInsertFnType) {
        onUploadImg([file], (d: Array<string>) => {
          insertFn(d[0])
        })
      },
    },
  },
}

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  nextTick(() => {
    height.value = document.querySelector('.html-toolbar').clientHeight + 1
  })
}

const getCategoryData = async () => {
  const { data } = await categoryList()
  if (data) {
    categoryData = data
    type1Options.value = data.map((i: CategoryItem) => ({
      label: i.name,
      value: i._id,
    }))
  }
}

const getBlogbyInfo = async () => {
  const { data } = await getBlogbyIds({ id })
  if (data) {
    documentInfo.value = data
    formatValue.value = documentInfo.value.format
  }
}

const onBack = () => {
  router.push({ name: fromPage })
}

const onRelease = async () => {
  const params = { id, release: !documentInfo.value.release }
  const { data } = await blogRelease(params)
  if (data) {
    window.$message.success('操作成功')
    documentInfo.value.release = !documentInfo.value.release
  }
}

const onQuery = () => {
  const url = router.resolve({
    path: `/list/${documentInfo.value.type1}/${documentInfo.value.type2}`,
    query: {
      id: documentInfo.value._id,
    },
  })
  window.open(url.href, '_blank')
}

const onSave = async () => {
  if (!documentInfo.value.name) {
    return window.$message.warning('请输入标题')
  }
  const params: any = {
    type1: documentInfo.value.type1,
    type2: documentInfo.value.type2,
    name: documentInfo.value.name,
    content: documentInfo.value.content,
    desc: '',
    format: formatValue.value,
  }
  if (id) {
    params.id = id
  }
  const { data } = await blogUpdate(params)
  if (data) {
    window.$message.success('保存成功')
    if (!id) {
      router.push({
        name: 'document-edit',
        query: { pageType: '1', id: data, from: fromPage },
      })
      id = data
      pageType.value = '1'
      getBlogbyInfo()
    }
  }
}

const onUpdateType = (isInit: boolean) => {
  const item = categoryData.find(i => i._id === documentInfo.value.type1)
  if (item) {
    type2Options.value = item.typeList.map((i: CategoryItem) => ({
      label: i.name,
      value: i._id,
    }))
    if (isInit) {
      documentInfo.value.type2 = item.typeList[0]._id
    }
  }
}

const onUploadImg = async (files: File[], callback: any) => {
  const d = new FormData()
  d.append('type1', documentInfo.value.type1)
  d.append('type2', documentInfo.value.type2)
  files.forEach(element => {
    d.append('file', element, element.name)
  })
  const { data } = await blogUploadImage(d, () => {})
  if (data) {
    callback(data)
  }
}

onMounted(async () => {
  const {
    pageType: _types,
    type1: _type1,
    type2: _type2,
    id: _id,
    from,
  } = route.query
  fromPage = from as string
  pageType.value = _types as string
  await getCategoryData()
  if (_types === '1') {
    id = _id as string
    await getBlogbyInfo()
  } else if (_types === '0') {
    documentInfo.value = {
      _id: '',
      name: '',
      type1: (_type1 as string) || categoryData[0]._id,
      type2: '',
      ctime: 0,
      utime: 0,
      isTop: false,
      content: '',
      author: '',
      authorLink: '',
      format: formatValue.value,
      release: false,
    }
    if (_type2) {
      documentInfo.value.type2 = _type2 as string
      onUpdateType(false)
    } else {
      onUpdateType(true)
    }
  }
})
</script>
<style lang="less" scoped>
.document-edit {
  height: 100%;
  --html-border-color: #ccc;
  .header {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    .back {
      margin-right: 16px;
    }
    .input-item {
      width: 220px;
      margin-right: 16px;
    }
  }
  .md-content {
    height: calc(100% - 50px);
  }
  .html-content {
    height: calc(100% - 52px);
    border: 1px solid var(--html-border-color);
    .html-toolbar {
      border-bottom: 1px solid var(--html-border-color);
    }
    ::v-deep(.w-e-textarea-video-container) {
      background-image: none !important;
      background-color: #fff;
      video {
        width: 100%;
      }
    }
  }
}

.dark {
  .document-edit {
    --html-border-color: #2d2d2d;
    ::v-deep(.w-e-text-container) {
      table {
        td {
          border: 1px solid var(--w-e-textarea-border-color) !important;
        }
      }
      pre > code {
        text-shadow: none !important;
      }
    }
    ::v-deep(.w-e-textarea-video-container) {
      background-image: none !important;
      background-color: #000;
    }

    // textarea - css vars
    --w-e-textarea-bg-color: var(--n-color);
    --w-e-textarea-color: #fff;
    --w-e-textarea-border-color: #2d2d2d;
    --w-e-textarea-slight-border-color: #2d2d2d;
    --w-e-textarea-slight-color: #d4d4d4;
    --w-e-textarea-slight-bg-color: #000;
    --w-e-textarea-selected-border-color: #6680a3; // 选中的元素，如选中了分割线
    --w-e-textarea-handler-bg-color: #4290f7; // 工具，如图片拖拽按钮

    // toolbar - css vars
    --w-e-toolbar-color: #d8d8d8;
    --w-e-toolbar-bg-color: var(--n-color);
    --w-e-toolbar-active-color: #fff;
    --w-e-toolbar-active-bg-color: #6b6b6b;
    --w-e-toolbar-disabled-color: #9c9c9c;
    --w-e-toolbar-border-color: #2d2d2d;

    // modal - css vars
    --w-e-modal-button-bg-color: #3d3d3d;
    --w-e-modal-button-border-color: #2d2d2d;
  }
}
</style>
