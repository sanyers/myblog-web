<template>
  <n-modal v-model:show="showModal">
    <div class="modal-index">
      <p class="header">
        <i class="iconfont icon-close" @click="showModal = false"></i>
      </p>
      <div class="title">搜索</div>
      <div class="content">
        <n-input-group>
          <n-input v-model:value="searchValue" @keyup.enter="onSearch" />
          <n-button type="primary" ghost :loading="loading" @click="onSearch">
            搜索
          </n-button>
        </n-input-group>
        <ul class="search-list">
          <li v-for="item in searchList">
            <p class="title">
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
  </n-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getBlogSearch } from '@/api/blog'
import { BlogItem } from '../list/data'

const router = useRouter()
const showModal = ref(false)
const loading = ref(false)
const searchValue = ref('')
const searchList = ref<BlogItem[]>([])

const show = () => {
  // searchValue.value = ''
  // searchList.value = []
  showModal.value = true
}

const hide = () => {
  showModal.value = false
}

const onSearch = async () => {
  loading.value = true
  try {
    const { data } = await getBlogSearch({ name: searchValue.value })
    if (data) {
      searchList.value = data.list
    }
  } catch (e) {}
  loading.value = false
}

const onLink = (item: BlogItem) => {
  const types = [item.type1, item.type2]
  router.push({
    name: 'list',
    params: { types },
    query: { id: item._id },
  })
  hide()
}

defineExpose({ show, hide })
</script>
<style lang="less" scoped>
.modal-index {
  width: 400px;
  box-shadow: 0 5px 20px hsla(0, 0%, 7%, 0.1);
  background-color: var(--n-color);
  border-radius: 2px;
  padding: 2rem;
  padding-top: 1rem;
  box-sizing: border-box;
  position: relative;
  .title {
    font-size: 18px;
  }
  .header {
    position: absolute;
    right: 1rem;
    .iconfont {
      cursor: pointer;
    }
  }
  .content {
    margin-top: 13px;
    .search-list {
      margin-top: 16px;
      max-height: 500px;
      overflow: auto;
      li {
        margin-bottom: 16px;
      }
      .info {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
@media only screen and (max-width: 768px) {
  .modal-index {
    width: 100%;
    padding: 1rem;
  }
}
</style>
