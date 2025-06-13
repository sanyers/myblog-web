<template>
  <div class="user-list">
    <n-tabs type="line">
      <n-tab-pane name="user" tab="用户列表" class="tab-item">
        <div class="search-div">
          <n-button type="info" @click="onAdd" style="margin-right: 16px">
            <i class="iconfont icon-tianjia"></i>
            <span style="margin-left: 6px">添加用户</span>
          </n-button>
        </div>
        <div class="table-div">
          <n-data-table
            class="table-list"
            :columns="userData.columns"
            remote
            :data="userData.list"
            :bordered="false"
            :flex-height="true"
            :loading="loading"
            :pagination="paginationData"
            :row-key="userData.rowKey"
            @update:page="handlePage"
            @update-page-size="handlePageSize" />
        </div>
      </n-tab-pane>
      <n-tab-pane name="manage" tab="管理列表" class="tab-item">
        <div class="table-div" style="height: 100%">
          <n-data-table
            class="table-list"
            :columns="adminData.columns"
            remote
            :data="adminData.list"
            :bordered="false"
            :flex-height="true"
            :loading="loading"
            :pagination="adminPaginationData"
            :row-key="adminData.rowKey"
            @update:page="handlePageAdmin"
            @update-page-size="handlePageSizeAdmin" />
        </div>
      </n-tab-pane>
    </n-tabs>
    <SetRole ref="setRoleRef" @on-update="getAdminLists" />
    <AddUsers ref="addUsersRef" @on-update="updateUsers" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserList, setUserRole, deleteUser } from '@/api/user'
import { getUserData, UserItem } from './data'
import { pagination } from '@/utils/pagination'
import SetRole from './components/set-role.vue'
import AddUsers from './components/add-users.vue'
import { LOGIN_CONF } from '@/config'

const setRoleRef = ref()
const addUsersRef = ref()

const paginationData = ref(pagination())
const userName = localStorage.getItem(LOGIN_CONF.NAME)
const userData = ref(getUserData(0, userName, handleSelect))
const loading = ref(false)

// 管理员
const adminPaginationData = ref(pagination())
const adminData = ref(getUserData(1, userName, handleSelect))
const adminLoading = ref(false)

const getUserLists = async () => {
  loading.value = true
  const params = {
    pageSize: paginationData.value.pageSize,
    pageNum: paginationData.value.page,
  }
  const { data } = await getUserList(params)
  if (data) {
    userData.value.list = data.list
    paginationData.value.pageCount = data.pageCount
    paginationData.value.itemCount = data.itemCount
  }
  loading.value = false
}

const getAdminLists = async () => {
  adminLoading.value = true
  const params = {
    pagesize: adminPaginationData.value.pageSize,
    pagenum: adminPaginationData.value.page,
    isAdmin: 'true',
  }
  const { data } = await getUserList(params)
  if (data) {
    adminData.value.list = data.list
    adminPaginationData.value.pageCount = data.pageCount
    adminPaginationData.value.itemCount = data.itemCount
  }
  adminLoading.value = false
}

const updateUsers = () => {
  paginationData.value.page = 1
  adminPaginationData.value.page = 1
  getUserLists()
  getAdminLists()
}

onMounted(() => {
  getUserLists()
  getAdminLists()
})

const onAdd = async () => {
  addUsersRef.value.show()
}

const onDelete = async (item: UserItem) => {
  window.$dialog.warning({
    title: '删除',
    content: '是否删除该用户？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { data } = await deleteUser({ userName: item.userName })
      if (data) {
        window.$message.success('删除成功')
        paginationData.value.page = 1
        getUserLists()
      }
    },
  })
}

function handleSelect(key: string, row: UserItem) {
  switch (key) {
    case 'setRole':
      setRoleRef.value.show(row)
      break
    case 'delete':
      onDelete(row)
      break
    case 'deletes':
      onDeleteAdmin(row)
      break
    default:
      break
  }
}

// const onSearch = (val: any) => {
//   searchParams = val
//   paginationData.value.page = 1
//   getUserLists()
// }

const handlePage = (page: number) => {
  paginationData.value.page = page
  getUserLists()
}
const handlePageSize = (pageSize: number) => {
  paginationData.value.page = 1
  paginationData.value.pageSize = pageSize
  getUserLists()
}

const onDeleteAdmin = async (item: UserItem) => {
  window.$dialog.warning({
    title: '移除',
    content: '是否移除该用户管理员的权限？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { data } = await setUserRole({
        userName: item.userName,
        role: 1,
      })
      if (data) {
        window.$message.success('移除成功')
        adminPaginationData.value.page = 1
        getAdminLists()
      }
    },
  })
}

const handlePageAdmin = (page: number) => {
  adminPaginationData.value.page = page
  getAdminLists()
}
const handlePageSizeAdmin = (pageSize: number) => {
  adminPaginationData.value.page = 1
  adminPaginationData.value.pageSize = pageSize
  getAdminLists()
}
</script>
<style lang="less" scoped>
.user-list {
  height: 100%;
  .n-tabs {
    height: 100%;
    ::v-deep(.search-input) {
      width: 220px;
    }
  }
  ::v-deep(.n-tabs-pane-wrapper) {
    height: calc(100% - 42px);
  }
  .tab-item {
    height: 100%;
    padding: 0;
    padding-top: 13px;
    box-sizing: border-box;
  }
  .search-div {
    margin-bottom: 16px;
  }
  .table-div {
    height: calc(100% - 50px);
    .table-list {
      height: 100%;
    }
  }
}
</style>
