<template>
  <n-layout class="pages-layout">
    <n-layout-header class="pages-header">
      <div class="header-left">
        <img class="logo" src="/logo.png" />
        <span class="title">{{ title }}</span>

        <ul class="nav-list">
          <li class="nav-item" @click="goHome">首页</li>
          <li class="nav-item" v-for="item in categoryData" :key="item._id">
            <n-dropdown
              trigger="hover"
              :options="item.typeOption"
              :render-label="renderDropdownLabel"
              @select="(key:string,option:DropdownOption)=>handleSelect(item._id,key,option)">
              <n-button text>{{ item.name }}</n-button>
            </n-dropdown>
          </li>
        </ul>
      </div>
      <div class="header-right">
        <i class="iconfont icon-baitian" @click="setTheme()"></i>
      </div>
    </n-layout-header>
    <div class="pages-view">
      <router-view />
    </div>
  </n-layout>
</template>
<script setup lang="ts">
import { onMounted, ref, h, VNodeChild } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage, useDialog, DropdownOption } from 'naive-ui'
import { setTheme } from '@/utils/device'
import { categoryList } from '@/api/category'
import { CategoryItem } from './data'

window.$message = useMessage()
window.$dialog = useDialog()
const route = useRoute()
const router = useRouter()
const title = ref('sanyer')
const categoryData = ref<CategoryItem[]>([])
let oldOption: DropdownOption = null

const getCategoryData = async () => {
  const types = route.params.types as Array<string>
  const { data } = await categoryList()
  if (data) {
    data.forEach((element: CategoryItem) => {
      if (element.typeList) {
        element.typeOption = []
        element.typeList.forEach(item => {
          const isActive = types
            ? element._id === types[0] && item._id === types[1]
            : false
          const items = {
            label: item.name,
            key: item._id,
            isActive,
          }
          if (isActive) {
            oldOption = items
          }
          element.typeOption.push(items)
        })
      }
    })
    categoryData.value = data
  }
}

const renderDropdownLabel = (option: DropdownOption) => {
  return h(
    'span',
    {
      style: option.isActive ? 'color:#7fe7c4' : '',
    },
    {
      default: () => option.label as VNodeChild,
    },
  )
}

const goHome = () => {
  if (oldOption) {
    oldOption.isActive = false
    oldOption = null
  }
  router.push({ name: 'home' })
}

const handleSelect = (type1: string, type2: string, option: DropdownOption) => {
  if (oldOption) {
    oldOption.isActive = false
  }
  option.isActive = true
  oldOption = option
  router.push({ name: 'list', params: { types: [type1, type2] } })
}

onMounted(() => {
  getCategoryData()
})
</script>
<style lang="less" scoped>
.pages-layout {
  font-size: 14px;
  height: 100%;
  .pages-header {
    height: 60px;
    line-height: 60px;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--n-border-color);
    .header-left {
      display: flex;
      align-items: center;
      .logo {
        width: 36px;
        height: 36px;
        margin-right: 16px;
      }
      .title {
        font-size: 18px;
        font-weight: 600;
      }
      .nav-list {
        display: flex;
        margin-left: 24px;
        font-size: 16px;
        .nav-item {
          margin-right: 24px;
          cursor: pointer;
          &:hover {
            color: #36ad6a;
          }
        }
      }
    }
    .header-right {
      .iconfont {
        margin-left: 13px;
        font-size: 24px;
        cursor: pointer;
      }
    }
  }
  .pages-view {
    height: calc(100% - 60px);
  }
}
</style>
