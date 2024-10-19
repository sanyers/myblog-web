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
              <!-- <span class="info-desc" :title="item.desc">
                {{ item.desc || '暂无描述' }}
              </span> -->
              <div class="info-tag">
                <n-tag> {{ getType(item.type1) }} </n-tag>
                <n-tag>
                  {{ getTypes(item.type1, item.type2) }}
                </n-tag>
              </div>
              <span class="info-utime">
                {{ new Date(item.utime).toLocaleString() }}
              </span>
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
              <!-- <span class="info-desc" :title="item.desc">
                {{ item.desc || '暂无描述' }}
              </span> -->
              <div class="info-tag">
                <n-tag> {{ getType(item.type1) }} </n-tag>
                <n-tag>
                  {{ getTypes(item.type1, item.type2) }}
                </n-tag>
              </div>
              <span class="info-utime">
                {{ new Date(item.utime).toLocaleString() }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <p class="copyright">
        <span>Copyright © 2021-2024 sanyer | </span>
        <n-button text type="info" @click="onOldLink">旧版</n-button>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBlogTop, getBlogLast } from '@/api/blog'
import { categoryList } from '@/api/category'
import { BlogItem } from '../list/data'
import { CategoryItem } from '../data'

const router = useRouter()
const topList = ref<BlogItem[]>([])
const lastList = ref<BlogItem[]>([])
let typeList: Array<CategoryItem> = []

const getType = computed(() => {
  return function (id: string) {
    return typeList.find(i => i._id === id).name
  }
})

const getTypes = computed(() => {
  return function (type1: string, type2: string) {
    const item = typeList.find(i => i._id === type1)
    return item.typeList.find(i => i._id === type2).name
  }
})

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

const getCategoryData = async () => {
  const { data } = await categoryList()
  if (data) {
    typeList = data
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

const onOldLink = () => {
  const url = 'https://sanyer.top/blog/'
  window.open(url, '_blank')
}

onMounted(async () => {
  await getCategoryData()
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
        // .info-desc {
        //   white-space: nowrap;
        //   text-overflow: ellipsis;
        //   overflow: hidden;
        //   flex: 1;
        // }
        .info-tag {
          .n-tag {
            margin-right: 16px;
          }
        }
        .info-utime {
          margin-left: 16px;
        }
      }
    }
  }

  .copyright {
    text-align: center;
  }
}

@media only screen and (max-width: 768px) {
  .home-page {
    .page-main {
      width: 100%;
      padding: 20px;
    }
  }
}
</style>
