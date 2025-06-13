<template>
  <n-layout class="layout-list" has-sider>
    <n-layout-sider
      class="blog-nav"
      bordered
      collapse-mode="width"
      :collapsed-width="0"
      :width="200"
      :collapsed="collapsed"
      show-trigger="bar"
      :show-collapsed-content="false"
      @collapse="collapsed = true"
      @expand="collapsed = false">
      <n-menu
        class="menu-index"
        v-model:value="activeKey"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :inverted="true"
        @update:value="handleUpdateValue" />
    </n-layout-sider>
    <n-layout-content
      class="layout-content"
      v-if="isContent"
      id="layoutContent">
      <div class="content-title">{{ currentIndex.name }}</div>
      <!-- <div v-if="currentIndex.desc" class="content-desc" style="margin: 12px 0">
        {{ currentIndex.desc }}
      </div> -->
      <div class="content-desc">
        <span>
          创建时间：{{ new Date(currentIndex.ctime).toLocaleString() }}
        </span>
        <span>
          修改时间：{{ new Date(currentIndex.utime).toLocaleString() }}
        </span>
        <span>{{ currentIndex.author }}</span>
      </div>
      <div class="content-body">
        <template v-if="currentIndex.format === 'md'">
          <!-- 预览组件 -->
          <MdPreview
            class="content-preview"
            editorId="previewId"
            :modelValue="currentIndex.content"
            :theme="theme"
            noImgZoomIn
            @click="onPreview" />
          <!-- 目录组件 -->
          <MdCatalog
            class="content-catalog"
            editorId="previewId"
            :theme="theme"
            :scrollElementOffsetTop="60"
            :scrollElement="scrollElement" />
        </template>
        <div
          v-if="currentIndex.format === 'html'"
          class="content-view"
          v-html="currentIndex.content"></div>
      </div>

      <div class="nav-btn">
        <div v-if="prveItem" style="margin-bottom: 6px">
          <span>上一篇：</span>
          <n-button text type="info" @click="toNav(prveItem._id)">
            {{ prveItem.name }}
          </n-button>
        </div>

        <div v-if="nextItem">
          <span>下一篇：</span>
          <n-button text type="info" @click="toNav(nextItem._id)">
            {{ nextItem.name }}
          </n-button>
        </div>
      </div>

      <div class="content-bottom">
        <CommentInput :blog-id="activeKey" @on-update="onUpdateComment" />
        <div class="comment-div" v-if="commentData.length">
          <p class="comment-title">评论列表</p>
          <ul class="comment-list">
            <li v-for="item in commentData" :key="item.id">
              <div class="quote-desc" v-if="item.quoteId && getQuoteItem(item)">
                <p>回复{{ item.quoteId }}楼：</p>
                <p>
                  <i class="iconfont icon-user"></i
                  >{{ getQuoteItem(item).userName }}：
                </p>
                <p>{{ getQuoteItem(item).desc }}</p>
              </div>
              <p class="name">
                <i class="iconfont icon-user"></i>
                <span>{{ item.userName }}</span>
                <span class="author" v-if="item.isAuthor">（作者）</span>
                <span>：</span>
              </p>
              <p class="desc">{{ item.desc }}</p>
              <p class="info">
                <span class="info-id">{{ item.id }}楼</span>
                <span class="info-time">
                  {{ new Date(item.ctime).toLocaleString() }}
                </span>
                <n-button type="info" text @click="onReply(item)">
                  回复
                </n-button>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <CommentReply ref="commentReplyRef" @on-update="onUpdateComment" />
    </n-layout-content>
  </n-layout>
</template>
<script setup lang="ts">
import { h, ref, watch, computed, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBlogList } from '@/api/blog'
import { getComment } from '@/api/comment'
import { BlogItem, CommentItem } from '@/utils/types'
import { MdPreview, MdCatalog } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { getTheme } from '@/utils/device'
import CommentInput from './components/comment-input.vue'
import CommentReply from './components/comment-reply.vue'
import { isMobile } from '@/utils/device'
import { NEllipsis } from 'naive-ui'
import { previewImage } from '@/utils/previewImage'
import 'highlight.js/styles/atom-one-dark.min.css'
import hljs from 'highlight.js'

const scrollElement = ref('#layoutContent .n-layout-scroll-container')
const route = useRoute()
const router = useRouter()
const isMobiles = isMobile()
const collapsed = ref(isMobiles)
let blogData: BlogItem[] = []
let types: Array<string> = []
const menuOptions = ref([])
const activeKey = ref('')
const currentIndex = ref<BlogItem>()
const theme = getTheme()
const commentData = ref<CommentItem[]>([])
const commentReplyRef = ref()

const prveItem = computed(() => {
  let item: BlogItem | null = null
  if (blogData.length) {
    const idx = blogData.findIndex(i => i._id === activeKey.value)
    const prveIdx = idx - 1
    if (prveIdx > -1) {
      item = blogData[prveIdx]
    }
  }
  return item
})

const nextItem = computed(() => {
  let item: BlogItem | null = null
  if (blogData.length) {
    const idx = blogData.findIndex(i => i._id === activeKey.value)
    const prveIdx = idx + 1
    if (prveIdx < blogData.length) {
      item = blogData[prveIdx]
    }
  }
  return item
})

const isContent = computed(() => {
  if (isMobiles) {
    return collapsed.value && Boolean(currentIndex.value)
  } else {
    return Boolean(currentIndex.value)
  }
})

const getQuoteItem = computed(() => {
  return function (row: CommentItem) {
    return commentData.value.find(i => i.id === row.quoteId)
  }
})

const onPreview = (e: any) => {
  const target = e.target
  if (target.className === 'md-zoom') {
    previewImage(target.src)
  }
}

const getPageType = () => {
  const type = route.params.types as Array<string>
  if (type && type.length > 1) {
    const id = route.query.id as string
    if (id) {
      getCommentData(id)
    }

    if (type.toString() !== types.toString()) {
      types = type
      getBlogData()
    } else {
      if (id) {
        activeKey.value = id
        currentIndex.value = blogData.find(i => i._id === activeKey.value)
        if (currentIndex.value.format === 'html') {
          nextTick(() => {
            hljs.highlightAll()
          })
        }
      }
    }
  } else {
    menuOptions.value = []
    currentIndex.value = null
  }
}

watch(
  () => route.params,
  () => {
    getPageType()
  },
  { immediate: false },
)

const toNav = (id: string) => {
  activeKey.value = id
  handleUpdateValue()
}

const setScrollTop = () => {
  const d = document
    .getElementById('layoutContent')
    ?.querySelector('.n-layout-scroll-container')
  if (d) {
    d.scrollTop = 0
  }
}

const handleUpdateValue = () => {
  currentIndex.value = blogData.find(i => i._id === activeKey.value)
  router.push({
    name: 'list',
    params: { types },
    query: { id: activeKey.value },
  })
  if (isMobiles) {
    collapsed.value = true
  }
  setScrollTop()
}

const getBlogData = async () => {
  const params = {
    type1: types[0],
    type2: types[1],
    pageNum: 1,
    pageSize: 1000,
  }
  const { data } = await getBlogList(params)
  if (data) {
    menuOptions.value = data.list.map((i: BlogItem) => ({
      label: () => h(NEllipsis, null, { default: () => i.name }),
      key: i._id,
    }))
    blogData = data.list
    let idx = 0
    let id = route.query.id as string
    if (id) {
      idx = blogData.findIndex(i => i._id === id)
    } else {
      id = blogData[idx]._id
    }
    activeKey.value = id
    currentIndex.value = blogData[idx]
    if (currentIndex.value.format === 'html') {
      nextTick(() => {
        hljs.highlightAll()
      })
    }
    router.push({ params: { types }, query: { id } })
    setScrollTop()
  }
}

const onUpdateComment = () => {
  getCommentData(activeKey.value)
}

const getCommentData = async (blogId: string) => {
  const { data } = await getComment({ blogId })
  if (data) {
    commentData.value = data
  }
}

const onReply = (item: CommentItem) => {
  commentReplyRef.value.show(activeKey.value, item.id)
}

// const onDelete = (item: CommentItem) => {
//   window.$dialog.warning({
//     title: '删除',
//     content: '是否删除该评论？',
//     positiveText: '确定',
//     negativeText: '取消',
//     onPositiveClick: async () => {
//       const params = {
//         blogId: activeKey.value,
//         commentId: item.id,
//       }
//       const { data } = await commentDelete(params)
//       if (data) {
//         window.$message.success('删除成功')
//         getCommentData(activeKey.value)
//       }
//     },
//   })
// }

onMounted(() => {
  getPageType()
})
</script>
<style lang="less" scoped>
.layout-list {
  height: 100%;
  .blog-nav {
    ::v-deep(.n-layout-toggle-button) {
      right: -18px;
    }
  }
  .menu-index {
    --n-item-text-color-hover: #18a058 !important;
    --n-item-icon-color-hover: #18a058 !important;
  }
  .layout-content {
    ::v-deep(.n-layout-scroll-container) {
      padding: 16px;
      box-sizing: border-box;
      overflow: auto;
    }
    .content-title {
      font-size: 28px;
      text-align: center;
    }
    .content-desc {
      text-align: center;
      span {
        margin-right: 16px;
      }
    }
    .content-body {
      position: relative;
      .content-preview {
        background-color: transparent;
        max-width: 840px;
        margin: 0 auto;
        margin-top: 20px;
        ::v-deep(table) {
          width: 100%;
        }
      }
    }
    .content-bottom {
      margin-top: 60px;
      .comment-input {
        width: 800px;
        margin: 0 auto;
        margin-bottom: 60px;
      }
      .comment-div {
        .comment-title {
          font-size: 20px;
          margin-bottom: 16px;
        }
      }
    }
  }
  .content-catalog {
    position: fixed;
    right: 20px;
    top: 160px;
    bottom: 80px;
    overflow: auto;
    width: 200px;
  }

  .nav-btn {
    width: 800px;
    margin: 0 auto;
    margin-top: 20px;
  }

  ::v-deep(.content-view) {
    background-color: transparent;
    max-width: 840px;
    margin: 0 auto;
    margin-top: 20px;
    p,
    li {
      white-space: pre-wrap; /* 保留空格 */
    }
    blockquote {
      border-left: 8px solid #d0e5f2;
      padding: 10px 10px;
      margin: 10px 0;
      background-color: #f1f1f1;
    }
    code {
      padding: 3px;
      border-radius: 3px;
    }
    pre > code {
      display: block;
      padding: 10px;
    }
    table {
      border-collapse: collapse;
    }
    td,
    th {
      border: 1px solid #ccc;
      min-width: 50px;
      height: 20px;
    }
    th {
      background-color: #f1f1f1;
    }
    ul,
    ol {
      padding-left: 20px;
    }
    input[type='checkbox'] {
      margin-right: 5px;
    }
    img,
    video {
      max-width: 100%;
    }
    a {
      color: #4290f7;
    }
  }

  .comment-list {
    width: 800px;
    margin: 0 auto;
    --desc-border-color: rgba(0, 0, 0, 0.1);
    li {
      margin-bottom: 16px;
    }
    .quote-desc {
      margin-bottom: 6px;
      background-color: var(--desc-border-color);
      padding: 12px 16px;
    }
    .name {
      font-size: 18px;
      .iconfont {
        margin-right: 6px;
      }
      .author {
        font-size: 14px;
      }
    }
    .desc {
      margin-top: 6px;
    }
    .info {
      font-size: 12px;
      text-align: right;
      border-bottom: 1px solid var(--desc-border-color);
      padding-bottom: 12px;
      margin-top: 6px;
      .info-id {
        margin-right: 16px;
      }
      .info-time {
        margin-right: 16px;
      }
    }
  }
}

@media only screen and (max-width: 1430px) {
  .layout-list {
    .content-catalog {
      display: none;
    }
  }
}

@media only screen and (max-width: 768px) {
  .layout-list {
    .layout-content {
      .content-body {
        .content-preview {
          width: 100%;
        }
      }
      .content-desc {
        span {
          display: block;
        }
      }
      .content-bottom {
        .comment-input {
          width: 100%;
        }
        .comment-div {
          .comment-list {
            width: 100%;
          }
        }
      }
    }

    .nav-btn {
      width: 100%;
    }
  }
}

.dark {
  .layout-list {
    ::v-deep(.content-view) {
      blockquote {
        border-left: 8px solid #91989c;
        padding: 10px 10px;
        margin: 10px 0;
        background-color: #3f3f3f;
      }
      td,
      th {
        border: 1px solid #2d2d2d !important;
      }
      th {
        background-color: #000;
      }
    }
    .comment-list {
      --desc-border-color: rgba(255, 255, 255, 0.24);
    }
  }
}
</style>
