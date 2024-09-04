<template>
  <div class="home-page">
    <div class="page-main">
      <div class="page-item" v-if="topList.length">
        <p class="page-title">置顶</p>
        <ul class="page-list">
          <li v-for="item in topList" :key="item._id">
            <p class="item-title">
              <n-button type="info" text size="24" @click="onLink(item)">
                {{ item.name }}
              </n-button>
            </p>
            <div class="info">
              <span>{{ item.desc || '暂无描述' }}</span>
              <span>{{ new Date(item.utime).toLocaleString() }}</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="page-item" v-if="lastList.length" style="margin-top: 30px">
        <p class="page-title">最近更新</p>
        <ul class="page-list">
          <li v-for="item in lastList" :key="item._id">
            <p class="item-title">
              <n-button type="info" text size="24" @click="onLink(item)">
                {{ item.name }}
              </n-button>
            </p>
            <div class="info">
              <span>{{ item.desc || '暂无描述' }}</span>
              <span>{{ new Date(item.utime).toLocaleString() }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBlogTop, getBlogLast } from '@/api/blog'
import { BlogItem } from '../list/data'

const router = useRouter()
const topList = ref<BlogItem[]>([])
const lastList = ref<BlogItem[]>([])

const getTopData = async () => {
  const { data } = await getBlogTop()
  if (data) {
    topList.value = data
  }
}

const getLastData = async () => {
  const { data } = await getBlogLast()
  if (data) {
    lastList.value = data
  }
}

const onLink = (item: BlogItem) => {
  const types = [item.type1, item.type2]
  router.push({
    name: 'list',
    params: { types },
    query: { id: item._id },
  })
}

onMounted(() => {
  getTopData()
  getLastData()
})
</script>
<style lang="less" scoped>
.home-page {
  height: 100%;
  overflow: auto;

  .page-main {
    width: 800px;
    margin: 0 auto;
    padding: 20px 0;
    box-sizing: border-box;
  }
  .page-item {
    margin-bottom: 16px;
    .page-title {
      font-size: 24px;
    }
    .page-list {
      margin-top: 16px;
      li {
        margin-bottom: 16px;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 4px;
        .item-title {
          ::v-deep(.n-button__content) {
            font-size: 24px;
          }
        }
      }
      .info {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        margin-top: 4px;
      }
    }
  }
}
</style>
