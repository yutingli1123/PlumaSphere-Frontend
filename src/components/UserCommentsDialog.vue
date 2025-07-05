<script lang="ts" setup>
import type { Comment } from '@/types'
import { commentApi } from '@/api/comment.ts'
import { DateTime } from 'luxon'

// props
const { userId } = defineProps<{
  userId: number | undefined
}>()

// refs
const page = ref(1)
const pageCount = ref(0)
const totalCount = ref(0)
const comments = ref<Comment[]>([])

// fetch comments function
const fetchComments = async () => {
  if (!userId) return

  const apiPage = page.value - 1
  const counts = await commentApi.getCommentCountByUserId(userId)

  if (counts) {
    pageCount.value = counts.totalPages
    totalCount.value = counts.totalCount
  }

  const result = await commentApi.getCommentsByUserId(userId, apiPage)
  if (result) {
    comments.value = result
  }
}

// on mounted
onMounted(fetchComments)
</script>

<template>
  <el-table :data="comments" style="width: 100%">
    <el-table-column label="ID" prop="id" width="80" />
    <el-table-column label="Content" prop="content" />
    <el-table-column label="Created At" prop="createdAt" width="200">
      <template #default="{ row }: { row: Comment }">
        {{ DateTime.fromISO(row.createdAt).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS) }}
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination">
    <el-pagination
      v-model:current-page="page"
      :page-count="pageCount"
      :total="totalCount"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchComments"
    />
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
