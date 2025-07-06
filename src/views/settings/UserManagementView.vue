<script lang="ts" setup>
import { userApi } from '@/api/user'
import { adminApi } from '@/api/admin'
import type { BannedIp, UserWithAdminInfo } from '@/types'
import { DateTime } from 'luxon'
import BanDialog from '@/components/BanDialog.vue'
import type { TabPaneName } from 'element-plus'
import IEpPlus from '~icons/ep/plus'
import BanIpDialog from '@/components/BanIpDialog.vue'

// refs
const activeTab = ref('users')
const users = ref<UserWithAdminInfo[]>([])
const bannedUsers = ref<UserWithAdminInfo[]>([])
const bannedIPs = ref<BannedIp[]>([])
const markedUsers = ref<UserWithAdminInfo[]>([])
const banDialogVisible = ref(false)
const banUserId = ref<number | undefined>()
const userCommentsDialogVisible = ref(false)
const userIdForComments = ref<number | undefined>()
const loading = ref(false)
const searchKeyword = ref('')
const banIpDialogVisible = ref(false)
const isSearching = ref(false)

// show ban dialog
const showBanDialog = (userId: number) => {
  banUserId.value = userId
  banDialogVisible.value = true
}

// hide ban dialog
const hideBanDialog = () => {
  banUserId.value = undefined
  banDialogVisible.value = false
  loadUsers()
  loadBannedUsers()
}

// show ban ip dialog
const showBanIpDialog = () => {
  banIpDialogVisible.value = true
}

// hide ban ip dialog
const hideBanIpDialog = () => {
  banIpDialogVisible.value = false
  loadBannedIPs()
}

// show user comments dialog
const showUserCommentsDialog = (userId: number) => {
  userIdForComments.value = userId
  userCommentsDialogVisible.value = true
}

// pagination
const pagination = reactive({
  users: {
    currentPage: 1,
    pageCount: 0,
    total: 0,
  },
  bannedUsers: {
    currentPage: 1,
    pageCount: 0,
    total: 0,
  },
  bannedIPs: {
    currentPage: 1,
    pageCount: 0,
    total: 0,
  },
  markedUsers: {
    currentPage: 1,
    pageCount: 0,
    total: 0,
  },
})

// view comments
const viewComments = (user: UserWithAdminInfo) => {
  showUserCommentsDialog(user.id)
}

// ban user
const banUser = async (user: UserWithAdminInfo) => {
  showBanDialog(user.id)
}

// unban user
const unbanUser = async (user: UserWithAdminInfo) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure to unban user ${user.username}?`,
      'Unban Confirmation',
      {
        type: 'warning',
      },
    )

    if (await adminApi.unbanUser(user.id)) {
      ElMessage.success(`User ${user.username} has been unbanned`)
      await loadUsers()
      await loadBannedUsers()
    } else {
      ElMessage.error('Failed to unban user')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to unban user')
    }
  }
}

// unmark ban ip for user
const unmarkBanIpForUser = async (user: UserWithAdminInfo) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure to unmark ban IP for user ${user.username}?`,
      'Unmark Ban IP Confirmation',
      {
        type: 'warning',
      },
    )

    if (await adminApi.unbanIPForUser(user.id)) {
      ElMessage.success(`Ban IP for user ${user.username} has been unmarked`)
      await loadUsers()
      await loadMarkedUsers()
    } else {
      ElMessage.error('Failed to unmark ban IP for user')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to unmark ban IP for user')
    }
  }
}

// delete user
const deleteUser = async (user: UserWithAdminInfo) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure to delete user ${user.username}? This action cannot be undone!`,
      'Delete Confirmation',
      {
        type: 'warning',
        confirmButtonText: 'Confirm Delete',
        cancelButtonText: 'Cancel',
      },
    )

    if (await userApi.deleteUser(user.id)) {
      ElMessage.success(`User ${user.username} has been deleted`)
      await loadUsers()
    } else {
      ElMessage.error('Failed to delete user')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete user')
    }
  }
}

// unban ip
const unbanIP = async (ip: BannedIp) => {
  try {
    await ElMessageBox.confirm(`Are you sure to unban IP ${ip.ipAddress}?`, 'Unban Confirmation', {
      type: 'warning',
    })
    if (await adminApi.unbanIp(ip.ipAddress)) {
      ElMessage.success(`IP ${ip.ipAddress} has been unbanned`)
      await loadBannedIPs()
    } else {
      ElMessage.error('Failed to unban IP')
      return
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to unban IP')
    } else {
      ElMessage.info('Operation cancelled')
    }
  }
}

// load users data
const loadUsers = async () => {
  loading.value = true
  try {
    const apiPage = pagination.users.currentPage - 1

    if (isSearching.value && searchKeyword.value.trim()) {
      // Search mode
      const countInfo = await userApi.searchUsersCount(searchKeyword.value.trim())
      if (countInfo) {
        pagination.users.total = countInfo.totalCount
        pagination.users.pageCount = countInfo.totalPages
      }

      const response = await userApi.searchUsers(searchKeyword.value.trim(), apiPage)
      if (response) {
        users.value = response
      }
    } else {
      // Normal mode
      const countInfo = await userApi.getAllUsersCount()
      if (countInfo) {
        pagination.users.total = countInfo.totalCount
        pagination.users.pageCount = countInfo.totalPages
      }

      const response = await userApi.getAllUsers(apiPage)
      if (response) {
        users.value = response
      }
    }
  } catch (error) {
    ElMessage.error('Failed to load users data')
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

// load banned users data
const loadBannedUsers = async () => {
  loading.value = true
  try {
    const apiPage = pagination.bannedUsers.currentPage - 1

    if (isSearching.value && searchKeyword.value.trim()) {
      // Search mode
      const countInfo = await adminApi.searchBannedUsersCount(searchKeyword.value.trim())
      if (countInfo) {
        pagination.bannedUsers.total = countInfo.totalCount
        pagination.bannedUsers.pageCount = countInfo.totalPages
      }

      const response = await adminApi.searchBannedUsers(searchKeyword.value.trim(), apiPage)
      if (response) {
        bannedUsers.value = response
      }
    } else {
      // Normal mode
      const countInfo = await adminApi.getBannedUsersCount()
      if (countInfo) {
        pagination.bannedUsers.total = countInfo.totalCount
        pagination.bannedUsers.pageCount = countInfo.totalPages
      }

      const response = await adminApi.getBannedUsers(apiPage)
      if (response) {
        bannedUsers.value = response
      }
    }
  } catch (error) {
    ElMessage.error('Failed to load banned users data')
    console.error('Error loading banned users:', error)
  } finally {
    loading.value = false
  }
}

// load banned ips data
const loadBannedIPs = async () => {
  loading.value = true
  try {
    const apiPage = pagination.bannedIPs.currentPage - 1

    if (isSearching.value && searchKeyword.value.trim()) {
      // Search mode
      const countInfo = await adminApi.searchBannedIpsCount(searchKeyword.value.trim())
      if (countInfo) {
        pagination.bannedIPs.total = countInfo.totalCount
        pagination.bannedIPs.pageCount = countInfo.totalPages
      }

      const response = await adminApi.searchBannedIps(searchKeyword.value.trim(), apiPage)
      if (response) {
        bannedIPs.value = response
      }
    } else {
      // Normal mode
      const countInfo = await adminApi.getBannedIpsCount()
      if (countInfo) {
        pagination.bannedIPs.total = countInfo.totalCount
        pagination.bannedIPs.pageCount = countInfo.totalPages
      }

      const response = await adminApi.getBannedIps(apiPage)
      if (response) {
        bannedIPs.value = response
      }
    }
  } catch (error) {
    ElMessage.error('Failed to load banned IPs data')
    console.error('Error loading banned IPs:', error)
  } finally {
    loading.value = false
  }
}

// load marked users data
const loadMarkedUsers = async () => {
  loading.value = true
  try {
    const apiPage = pagination.markedUsers.currentPage - 1

    if (isSearching.value && searchKeyword.value.trim()) {
      // Search mode
      const countInfo = await adminApi.searchMarkedUsersCount(searchKeyword.value.trim())
      if (countInfo) {
        pagination.markedUsers.total = countInfo.totalCount
        pagination.markedUsers.pageCount = countInfo.totalPages
      }

      const response = await adminApi.searchMarkedUsers(searchKeyword.value.trim(), apiPage)
      if (response) {
        markedUsers.value = response
      }
    } else {
      // Normal mode
      const countInfo = await adminApi.getMarkedUsersCount()
      if (countInfo) {
        pagination.markedUsers.total = countInfo.totalCount
        pagination.markedUsers.pageCount = countInfo.totalPages
      }

      const response = await adminApi.getMarkedUsers(apiPage)
      if (response) {
        markedUsers.value = response
      }
    }
  } catch (error) {
    ElMessage.error('Failed to load marked users data')
    console.error('Error loading marked users:', error)
  } finally {
    loading.value = false
  }
}

// reset to normal mode and load data
const resetToNormalMode = async () => {
  isSearching.value = false
  if (activeTab.value === 'users') {
    await loadUsers()
  } else if (activeTab.value === 'bannedUsers') {
    await loadBannedUsers()
  } else if (activeTab.value === 'markedUsers') {
    await loadMarkedUsers()
  } else {
    await loadBannedIPs()
  }
}

// search input handler
const handleSearchInput = async () => {
  if (!searchKeyword.value.trim()) {
    // If search keyword is empty, reset to normal loading
    await resetToNormalMode()
  }
}

// search
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    // If search keyword is empty, reset to normal loading
    await resetToNormalMode()
    return
  }

  isSearching.value = true
  // Reset to first page when searching
  if (activeTab.value === 'users') {
    pagination.users.currentPage = 1
    await loadUsers()
  } else if (activeTab.value === 'bannedUsers') {
    pagination.bannedUsers.currentPage = 1
    await loadBannedUsers()
  } else if (activeTab.value === 'markedUsers') {
    pagination.markedUsers.currentPage = 1
    await loadMarkedUsers()
  } else {
    pagination.bannedIPs.currentPage = 1
    await loadBannedIPs()
  }
}

// page change
const handlePageChange = (page: number) => {
  if (activeTab.value === 'users') {
    pagination.users.currentPage = page
    loadUsers()
  } else if (activeTab.value === 'bannedUsers') {
    pagination.bannedUsers.currentPage = page
    loadBannedUsers()
  } else if (activeTab.value === 'markedUsers') {
    pagination.markedUsers.currentPage = page
    loadMarkedUsers()
  } else {
    pagination.bannedIPs.currentPage = page
    loadBannedIPs()
  }
}

// tab change
const handleTabChange = (tabName: TabPaneName) => {
  searchKeyword.value = ''
  isSearching.value = false
  if (tabName === 'users') {
    loadUsers()
  } else if (tabName === 'bannedUsers') {
    loadBannedUsers()
  } else if (tabName === 'markedUsers') {
    loadMarkedUsers()
  } else {
    loadBannedIPs()
  }
}

// format date for display
const formatDate = (dateString: string) => {
  return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
}

// get user status display
const getUserStatus = (
  user: UserWithAdminInfo,
): {
  text: string
  type: 'success' | 'danger' | 'warning'
} => {
  if (user.isBanned) {
    return { text: 'Banned', type: 'danger' }
  }
  if (user.isPendingIpBan) {
    return { text: 'Pending IP Ban', type: 'warning' }
  }
  return { text: 'Active', type: 'success' }
}

// on mounted
onMounted(() => {
  loadUsers()
})
</script>

<template>
  <el-dialog
    v-model="banDialogVisible"
    center
    destroy-on-close
    style="max-width: 500px"
    title="Restrict User Access"
  >
    <BanDialog :close-dialog="hideBanDialog" :user-id="banUserId" />
  </el-dialog>

  <el-dialog
    v-model="banIpDialogVisible"
    center
    destroy-on-close
    style="max-width: 500px"
    title="Restrict IP Access"
  >
    <BanIpDialog :close-dialog="hideBanIpDialog" />
  </el-dialog>

  <el-dialog v-model="userCommentsDialogVisible" center destroy-on-close>
    <UserCommentsDialog :user-id="userIdForComments" />
  </el-dialog>

  <div class="user-management">
    <div class="header">
      <h2>User Management</h2>
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          clearable
          placeholder="Search username, email or IP"
          style="width: 300px"
          @input="handleSearchInput"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon>
                <i-ep-search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <!-- User Management -->
      <el-tab-pane label="User Management" name="users">
        <el-table v-loading="loading" :data="users" stripe style="width: 100%">
          <el-table-column label="Avatar" prop="avatarUrl" width="80">
            <template #default="{ row }: { row: UserWithAdminInfo }">
              <el-avatar
                :size="40"
                :src="row.avatarUrl"
                :style="{ backgroundColor: row.avatarColor }"
              >
                <span>{{ row.initials }}</span>
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="ID" prop="id" width="80" />
          <el-table-column label="Username" prop="username" />
          <el-table-column label="Nickname" prop="nickname" />
          <el-table-column label="Status" width="120">
            <template #default="{ row }: { row: UserWithAdminInfo }">
              <el-tag :type="getUserStatus(row).type">
                {{ getUserStatus(row).text }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Register Time" prop="createdAt">
            <template #default="{ row }: { row: UserWithAdminInfo }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="Last Login" prop="lastLoginAt">
            <template #default="{ row }: { row: UserWithAdminInfo }">
              {{ row.lastLoginAt ? formatDate(row.lastLoginAt) : 'Never' }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Actions" width="300">
            <template #default="{ row }: { row: UserWithAdminInfo }">
              <el-button size="small" type="primary" @click="viewComments(row)">
                View Comments
              </el-button>
              <el-button :disabled="row.isAdmin" size="small" type="warning" @click="banUser(row)">
                Ban
              </el-button>
              <el-button
                :disabled="row.isAdmin"
                size="small"
                type="danger"
                @click="deleteUser(row)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="pagination.users.currentPage"
            :page-count="pagination.users.pageCount"
            :total="pagination.users.total"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </el-tab-pane>

      <!-- Marked IP Users Management -->
      <el-tab-pane label="Pending IP-Ban Users" name="markedUsers">
        <el-table v-loading="loading" :data="markedUsers" stripe style="width: 100%">
          <el-table-column label="Avatar" prop="avatarUrl" width="80">
            <template #default="{ row }">
              <el-avatar
                :size="40"
                :src="row.avatarUrl"
                :style="{ backgroundColor: row.avatarColor }"
              >
                <span>{{ row.initials }}</span>
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="ID" prop="id" width="80" />
          <el-table-column label="Username" prop="username" />
          <el-table-column label="Nickname" prop="nickname" />
          <el-table-column label="IP Ban Reason" prop="ipBanReason" />
          <el-table-column label="Expires" prop="ipBanExpiresAt">
            <template #default="{ row }">
              {{ row.banExpiresAt ? formatDate(row.banExpiresAt) : 'Permanent' }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Actions" width="150">
            <template #default="{ row }">
              <el-button size="small" type="success" @click="unmarkBanIpForUser(row)"
                >Unmark
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="pagination.markedUsers.currentPage"
            :page-count="pagination.markedUsers.pageCount"
            :total="pagination.markedUsers.total"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </el-tab-pane>

      <!-- Banned Users Management -->
      <el-tab-pane label="Banned Users" name="bannedUsers">
        <el-table v-loading="loading" :data="bannedUsers" stripe style="width: 100%">
          <el-table-column label="Avatar" prop="avatarUrl" width="80">
            <template #default="{ row }">
              <el-avatar
                :size="40"
                :src="row.avatarUrl"
                :style="{ backgroundColor: row.avatarColor }"
              >
                <span>{{ row.initials }}</span>
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="ID" prop="id" width="80" />
          <el-table-column label="Username" prop="username" />
          <el-table-column label="Nickname" prop="nickname" />
          <el-table-column label="Ban Reason" prop="banReason" />
          <el-table-column label="Ban Time" prop="bannedAt">
            <template #default="{ row }">
              {{ formatDate(row.bannedAt) }}
            </template>
          </el-table-column>
          <el-table-column label="Expires" prop="banExpiresAt">
            <template #default="{ row }">
              {{ row.banExpiresAt ? formatDate(row.banExpiresAt) : 'Permanent' }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Actions" width="150">
            <template #default="{ row }">
              <el-button size="small" type="success" @click="unbanUser(row)">Unban</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="pagination.bannedUsers.currentPage"
            :page-count="pagination.bannedUsers.pageCount"
            :total="pagination.bannedUsers.total"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </el-tab-pane>

      <!-- Banned IPs Management -->
      <el-tab-pane label="Banned IPs" name="bannedIPs">
        <el-button :icon="IEpPlus" style="margin-left: 10px" type="primary" @click="showBanIpDialog"
          >Add
        </el-button>
        <el-table v-loading="loading" :data="bannedIPs" stripe style="width: 100%">
          <el-table-column label="IP Address" prop="ipAddress" />
          <el-table-column label="Ban Reason" prop="reason" />
          <el-table-column label="Ban Time" prop="bannedAt">
            <template #default="{ row }">
              {{ formatDate(row.bannedAt) }}
            </template>
          </el-table-column>
          <el-table-column label="Expires" prop="expiresAt">
            <template #default="{ row }">
              {{ row.expiresAt ? formatDate(row.expiresAt) : 'Permanent' }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Actions" width="150">
            <template #default="{ row }">
              <el-button size="small" type="success" @click="unbanIP(row)">Unban</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="pagination.bannedIPs.currentPage"
            :page-count="pagination.bannedIPs.pageCount"
            :total="pagination.bannedIPs.total"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.user-management {
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #303133;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
