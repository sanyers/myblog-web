<template>
  <div class="my-comment">
    <div class="content" v-if="pageType === 0">
      <n-data-table
        class="table-list"
        :columns="commentList.columns"
        remote
        :data="commentList.list"
        :bordered="false"
        :flex-height="true"
        :loading="loading"
        :pagination="paginationData"
        :row-key="commentList.rowKey"
        @update:page="handlePage"
        @update-page-size="handlePageSize" />
    </div>
    <div class="comment-info" v-if="pageType === 1">
      <div class="header">
        <n-button @click="onBack">
          <i class="iconfont icon-left"></i>
          <span>返回</span>
        </n-button>
        <div>{{ commentCurrent.blogName }}</div>
        <div>
          <n-button
            @click="onUpdateComment"
            type="success"
            style="margin-right: 16px">
            <i class="iconfont icon-refresh"></i>
            <span style="margin-left: 6px">刷新评论</span>
          </n-button>
          <n-button @click="onAdd" type="info" style="margin-right: 16px">
            <i class="iconfont icon-tianjia"></i>
            <span style="margin-left: 6px">添加评论</span>
          </n-button>
          <n-button @click="onDeleteAll()" type="error">
            <i class="iconfont icon-shanchu"></i>
            <span style="margin-left: 6px">删除评论</span>
          </n-button>
        </div>
      </div>
      <div class="comment-data">
        <ul class="comment-list">
          <li v-for="item in commentCurrent.comments" :key="item.id">
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
              <n-button
                type="info"
                text
                @click="onReply(item)"
                style="margin-right: 6px">
                回复
              </n-button>
              <n-button type="error" text @click="onDelete(item)">
                删除
              </n-button>
            </p>
          </li>
        </ul>
      </div>
    </div>

    <CommentReply ref="commentReplyRef" @on-update="onUpdateComment" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { commentDelete, getComments } from '@/api/comment'
import { pagination } from '@/utils/pagination'
import { getCommentData } from './data'
import { CommentData, CommentItem } from '@/utils/types'
import CommentReply from '@/views/pages/list/components/comment-reply.vue'

const pageType = ref(0)
const loading = ref(false)
const paginationData = ref(pagination())
const commentList = ref(getCommentData(handleSelect))
const commentCurrent = ref<CommentData>()
const commentReplyRef = ref()

const getQuoteItem = computed(() => {
  return function (row: CommentItem) {
    return commentCurrent.value.comments.find(i => i.id === row.quoteId)
  }
})

const onBack = () => {
  pageType.value = 0
}

const onReply = (item: CommentItem) => {
  commentReplyRef.value.show(commentCurrent.value.blogId, item.id)
}

const onAdd = () => {
  commentReplyRef.value.show(commentCurrent.value.blogId, '')
}

const onDeleteAll = (blogId?: string) => {
  window.$dialog.warning({
    title: '删除',
    content: '是否删除该文章所有评论？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const params = { blogId: blogId || commentCurrent.value.blogId }
      const { data } = await commentDelete(params)
      if (data) {
        window.$message.success('删除成功')
        paginationData.value.page = 1
        await getComment()
        onBack()
      }
    },
  })
}

const onDelete = (item: CommentItem) => {
  window.$dialog.warning({
    title: '删除',
    content: '是否删除该评论？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const params = {
        blogId: commentCurrent.value.blogId,
        commentId: item.id,
      }
      const { data } = await commentDelete(params)
      if (data) {
        window.$message.success('删除成功')
        onUpdateComment()
      }
    },
  })
}

const onUpdateComment = async () => {
  await getComment()
  const row = commentList.value.list.find(
    i => i.blogId === commentCurrent.value.blogId,
  )
  commentCurrent.value = row
}

const getComment = async () => {
  loading.value = true
  const params = {
    pageSize: paginationData.value.pageSize,
    pageNum: paginationData.value.page,
  }
  const { data } = await getComments(params)
  if (data) {
    commentList.value.list = data.list
    paginationData.value.pageCount = data.pageCount
    paginationData.value.itemCount = data.itemCount
  }
  loading.value = false
}

const onQuery = (row: CommentData) => {
  commentCurrent.value = row
  pageType.value = 1
}

function handleSelect(key: string, row: CommentData) {
  switch (key) {
    case 'query':
      onQuery(row)
      break
    case 'delete':
      onDeleteAll(row.blogId)
      break
    default:
      break
  }
}

const handlePage = (page: number) => {
  paginationData.value.page = page
  getComment()
}
const handlePageSize = (pageSize: number) => {
  paginationData.value.page = 1
  paginationData.value.pageSize = pageSize
  getComment()
}

onMounted(() => {
  getComment()
})
</script>
<style lang="less" scoped>
.my-comment {
  height: 100%;
  .content {
    height: 100%;
    .table-list {
      height: 100%;
    }
  }
  .comment-info {
    height: 100%;
    .header {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .comment-data {
      height: calc(100% - 50px);
      overflow: auto;
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

.dark {
  .my-comment {
    .comment-list {
      --desc-border-color: rgba(255, 255, 255, 0.24);
    }
  }
}
</style>
