<template>
  <n-layout class="layout-list" has-sider>
    <n-layout-sider
      class="blog-nav"
      bordered
      collapse-mode="width"
      :collapsed-width="18"
      :width="200"
      :collapsed="collapsed"
      show-trigger
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
    <n-layout-content class="layout-content" v-if="currentIndex">
      <div class="content-title">{{ currentIndex.name }}</div>
      <div class="content-desc">
        <span>{{ getTimes }}</span>
        <span>{{ currentIndex.author }}</span>
      </div>
      <MdPreview
        class="content-body"
        :modelValue="currentIndex.content"
        :theme="theme" />
    </n-layout-content>
  </n-layout>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBlogList } from '@/api/blog'
import { BlogItem } from './data'
import { MdPreview, MdCatalog } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { getTheme } from '@/utils/device'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
let blogData: BlogItem[] = []
let types: Array<string> = []
const menuOptions = ref([])
const activeKey = ref('')
const currentIndex = ref<BlogItem>()
const theme = getTheme()

const getTimes = computed(() => {
  return new Date(currentIndex.value.ctime).toLocaleString()
})

const getPageType = (isInit: boolean) => {
  const type = route.params.types as Array<string>
  if (type && type.length > 1) {
    if (isInit) {
      types = type
      getBlogData()
    } else {
      if (type.toString() !== types.toString()) {
        types = type
        getBlogData()
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
    getPageType(false)
  },
  { immediate: false },
)

const handleUpdateValue = async () => {
  currentIndex.value = blogData.find(i => i._id === activeKey.value)
  router.push({
    name: 'list',
    params: { types },
    query: { id: activeKey.value },
  })
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
      label: i.name,
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
    router.push({ name: 'list', params: { types }, query: { id } })
  }
}

onMounted(() => {
  getPageType(true)
})
</script>
<style lang="less" scoped>
.layout-list {
  height: 100%;
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
      max-width: 840px;
      margin: 0 auto;
      margin-top: 20px;
      background-color: transparent;
      ::v-deep(table) {
        width: 100%;
      }
    }
  }
}
</style>
