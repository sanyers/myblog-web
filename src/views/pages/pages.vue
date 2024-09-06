<template>
  <n-layout
    class="pages-layout"
    :style="{ '--border-color': themeVars.borderColor }">
    <n-layout-header class="pages-header">
      <div class="header-left">
        <div @click="goHome" class="to-home">
          <img class="logo" src="/logo.png" />
          <span class="title">{{ title }}</span>
        </div>

        <ul class="nav-list">
          <li class="nav-item" @click="goHome">首页</li>
          <li class="nav-item" v-for="item in categoryData" :key="item._id">
            <n-dropdown
              trigger="hover"
              :options="item.children"
              :render-label="renderDropdownLabel"
              @select="(key:string,option:DropdownOption)=>handleSelect(item._id,key,option)">
              <n-button text>{{ item.name }}</n-button>
            </n-dropdown>
          </li>
        </ul>
      </div>
      <div class="header-right">
        <i class="iconfont icon-search" @click="onSearch"></i>
        <i class="iconfont icon-baitian" @click="setTheme()"></i>
        <n-dropdown
          :options="categoryData"
          placement="bottom-start"
          trigger="click"
          @select="handleSelects">
          <i class="iconfont icon-menu"></i>
        </n-dropdown>
      </div>
    </n-layout-header>
    <div class="pages-view">
      <router-view />
    </div>
    <SearchInput ref="searchInputRef" />
  </n-layout>
</template>
<script setup lang="ts">
import { onMounted, ref, h, VNodeChild } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage, useDialog, DropdownOption, useThemeVars } from 'naive-ui'
import { setTheme } from '@/utils/device'
import { categoryList } from '@/api/category'
import { CategoryItem } from './data'
import SearchInput from './components/search-input.vue'

const themeVars = useThemeVars()
window.$message = useMessage()
window.$dialog = useDialog()
const route = useRoute()
const router = useRouter()
const title = ref('sanyer')
const categoryData = ref<CategoryItem[]>([])
let oldOption: DropdownOption = null
const searchInputRef = ref()

const getCategoryData = async () => {
  const types = route.params.types as Array<string>
  const { data } = await categoryList()
  if (data) {
    data.forEach((element: CategoryItem) => {
      element.label = element.name
      element.key = element._id
      if (element.typeList) {
        element.children = []
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
          element.children.push(items)
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

const handleSelects = (key: string, option: DropdownOption) => {
  let type1 = ''
  categoryData.value.forEach(element => {
    element.children.forEach(item => {
      if (item.key === key) {
        type1 = element.key
      }
    })
  })
  handleSelect(type1, key, option)
}

const onSearch = () => {
  searchInputRef.value.show()
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
      .to-home {
        display: flex;
        align-items: center;
      }
      .logo {
        width: 36px;
        height: 36px;
        margin-right: 16px;
      }
      .title {
        font-size: 18px;
        font-weight: 600;
      }
    }
    .header-right {
      .iconfont {
        margin-left: 24px;
        font-size: 24px;
        cursor: pointer;
      }
      .icon-menu {
        display: none;
      }
    }
  }

  .nav-list {
    display: flex;
    margin-left: 24px;
    font-size: 16px;
    .nav-item {
      margin-right: 24px;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: #36ad6a;
      }
    }
  }
  .pages-view {
    height: calc(100% - 60px);
  }
}

@media only screen and (max-width: 768px) {
  .pages-layout {
    .nav-list {
      display: none;
    }
    .pages-header {
      .header-right {
        .icon-menu {
          display: inline;
        }
      }
    }
  }
}
</style>
