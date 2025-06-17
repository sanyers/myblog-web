<template>
  <div class="my-document">
    <div class="search-header">
      <div class="header-left">
        <span>置顶：</span>
        <n-select
          class="input-item min-input-item"
          v-model:value="isTop"
          :options="topOptions"
          @update:value="onUpdateTop" />

        <span>发布：</span>
        <n-select
          class="input-item min-input-item"
          v-model:value="release"
          :options="releaseOptions"
          @update:value="onUpdateRelease" />

        <span>栏目：</span>
        <n-select
          class="input-item"
          v-model:value="type1"
          :options="type1Options"
          @update:value="onUpdateType1" />
        <n-select
          class="input-item"
          v-if="type1"
          v-model:value="type2"
          :options="type2Options"
          @update:value="onUpdateType2" />
      </div>
      <div class="header-right">
        <n-button type="info" @click="onCreate"> 创建文档 </n-button>
      </div>
    </div>
    <div class="content">
      <n-data-table
        class="table-list"
        :columns="blogData.columns"
        remote
        :data="blogData.list"
        :bordered="false"
        :flex-height="true"
        :loading="loading"
        :pagination="paginationData"
        :row-key="blogData.rowKey"
        @update:page="handlePage"
        @update-page-size="handlePageSize" />
    </div>

    <SetTime ref="setTimeRef" @on-update="getBlogList" />
    <SetTypes ref="setTypesRef" @on-update="getBlogList" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CategoryItem, BlogItem } from '@/utils/types'
import { categoryList } from '@/api/category'
import { getBlogLists, blogTop, blogRelease, blogDelete } from '@/api/blog'
import { getBlogData } from './data'
import { pagination } from '@/utils/pagination'
import SetTime from './components/set-time.vue'
import SetTypes from './components/set-types.vue'

const setTimeRef = ref()
const setTypesRef = ref()

const route = useRoute()
const router = useRouter()
let categoryData: CategoryItem[] = []
const type1 = ref('')
const type1Options = ref([])
const type2 = ref('')
const type2Options = ref([])

const isTop = ref('')
const topOptions = ref([
  { label: '全部', value: '' },
  { label: '置顶', value: 'true' },
  { label: '未置顶', value: 'false' },
])

const release = ref('')
const releaseOptions = ref([
  { label: '全部', value: '' },
  { label: '已发布', value: 'true' },
  { label: '未发布', value: 'false' },
])

const loading = ref(false)
const paginationData = ref(pagination())
const blogData = ref(getBlogData(getTypes, handleSelect))

function getTypes(type1: string, type2: string) {
  const item = categoryData.find(i => i._id === type1)
  const items = item.typeList.find(i => i._id === type2)
  return { name1: item.name, name2: items.name }
}

const getCategoryData = async () => {
  const { data } = await categoryList()
  if (data) {
    categoryData = data
    type1Options.value = data.map((i: CategoryItem) => ({
      label: i.name,
      value: i._id,
    }))
    type1Options.value.unshift({ label: '全部', value: '' })

    const {
      top,
      release: r,
      type1: t1,
      type2: t2,
      page,
      pageSize,
    } = route.query
    if (top) {
      isTop.value = top as string
    }
    if (r) {
      release.value = r as string
    }
    if (t1) {
      type1.value = t1 as string
      getType2Options()
    }
    if (t2) {
      type2.value = t2 as string
    }
    if (page) {
      paginationData.value.page = Number(page)
    }
    if (pageSize) {
      paginationData.value.pageSize = Number(pageSize)
    }
  }
}

const getBlogList = async () => {
  loading.value = true
  const params = {
    type1: type1.value,
    type2: type2.value,
    isTop: isTop.value,
    release: release.value,
    pageSize: paginationData.value.pageSize,
    pageNum: paginationData.value.page,
  }
  const { data } = await getBlogLists(params)
  if (data) {
    blogData.value.list = data.list
    paginationData.value.pageCount = data.pageCount
    paginationData.value.itemCount = data.itemCount
  }
  loading.value = false
}

const onUpdateTop = () => {
  const query = { ...route.query, top: isTop.value || undefined, page: '1' }
  router.replace({ query })

  paginationData.value.page = 1
  getBlogList()
}

const onUpdateRelease = () => {
  const query = {
    ...route.query,
    release: release.value || undefined,
    page: '1',
  }
  router.replace({ query })

  paginationData.value.page = 1
  getBlogList()
}

const getType2Options = () => {
  const item = categoryData.find(i => i._id === type1.value)
  if (item) {
    type2Options.value = item.typeList.map((i: CategoryItem) => ({
      label: i.name,
      value: i._id,
    }))
  }
}

const onUpdateType1 = () => {
  const query = {
    ...route.query,
    type1: type1.value || undefined,
    type2: undefined,
    page: '1',
  }
  router.replace({ query })

  type2.value = ''
  getType2Options()

  paginationData.value.page = 1
  getBlogList()
}

const onUpdateType2 = () => {
  const query = { ...route.query, type2: type2.value || undefined, page: '1' }
  router.replace({ query })

  paginationData.value.page = 1
  getBlogList()
}

const handlePage = (page: number) => {
  const query = { ...route.query, page: page.toString() }
  router.replace({ query })

  paginationData.value.page = page
  getBlogList()
}
const handlePageSize = (pageSize: number) => {
  const query = { ...route.query, page: 1, pageSize: pageSize.toString() }
  router.replace({ query })

  paginationData.value.page = 1
  paginationData.value.pageSize = pageSize
  getBlogList()
}

const onQuery = (row: BlogItem) => {
  const url = router.resolve({
    path: `/list/${row.type1}/${row.type2}`,
    query: {
      id: row._id,
    },
  })
  window.open(url.href, '_blank')
}

const onTop = async (row: BlogItem, isTop: boolean) => {
  const params = { id: row._id, isTop }
  const { data } = await blogTop(params)
  if (data) {
    window.$message.success('操作成功')
    getBlogList()
  }
}

const onRelease = async (row: BlogItem, release: boolean) => {
  const params = { id: row._id, release }
  const { data } = await blogRelease(params)
  if (data) {
    window.$message.success('操作成功')
    getBlogList()
  }
}

const onDelete = (row: BlogItem) => {
  window.$dialog.warning({
    title: '删除',
    content: '是否删除该文章？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { data } = await blogDelete({ id: row._id })
      if (data) {
        window.$message.success('删除成功')
        paginationData.value.page = 1
        getBlogList()
      }
    },
  })
}

const onEdit = (row: BlogItem) => {
  router.push({
    name: 'document-edit',
    query: { pageType: '1', id: row._id },
  })
}

const onCreate = () => {
  router.push({
    name: 'document-edit',
    query: { pageType: '0', type1: type1.value, type2: type2.value },
  })
}

function handleSelect(key: string, row: BlogItem) {
  switch (key) {
    case 'query':
      onQuery(row)
      break
    case 'edit':
      onEdit(row)
      break
    case 'top':
      onTop(row, true)
      break
    case 'untop':
      onTop(row, false)
      break
    case 'release':
      onRelease(row, true)
      break
    case 'unrelease':
      onRelease(row, false)
      break
    case 'ctime':
      setTimeRef.value.show(row._id, row.ctime)
      break
    case 'types':
      setTypesRef.value.show(row._id, row.type1, row.type2, categoryData)
      break
    case 'delete':
      onDelete(row)
      break
    default:
      break
  }
}

onMounted(async () => {
  await getCategoryData()
  await getBlogList()
})
</script>
<style lang="less" scoped>
.my-document {
  height: 100%;
  .search-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    .header-left {
      display: flex;
      align-items: center;
    }
    .input-item {
      width: 220px;
      margin-right: 16px;
    }
    .min-input-item {
      width: 100px;
    }
  }
  .content {
    height: calc(100% - 50px);
    .table-list {
      height: 100%;
      ::v-deep(.types-item) {
        .n-tag {
          margin-bottom: 6px;
          margin-right: 6px;
        }
      }
      ::v-deep(.blog-title) {
        color: #6baffe;
        cursor: pointer;
      }
    }
  }
}
</style>
