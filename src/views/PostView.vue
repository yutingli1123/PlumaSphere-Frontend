<script setup lang="ts">
import PageFooter from '@/components/PageFooter.vue'
import TopNavigation from '@/components/TopNavigation.vue'
import { Calendar, Delete, Edit, RefreshRight } from '@element-plus/icons-vue'
import CommentForm from '@/components/CommentForm.vue'
import { onBeforeUnmount, onMounted, type Ref, ref } from 'vue'
import type { Article, Comment, User } from '@/types'
import { postApi } from '@/api/post.ts'
import { userApi } from '@/api/user.ts'
import { commentApi } from '@/api/comment.ts'
import router from '@/router'
import { DateTime } from 'luxon'
import { useAuthStore } from '@/stores/auth.ts'
import { WebSocketMessageType, WebSocketServiceInstance } from '@/service/webSocketService'
import CommentList from '@/components/CommentList.vue'

const { postId } = defineProps<{
  postId: string
}>()

const tagTypes = ['', 'success', 'warning', 'danger', 'info']
const authStore = useAuthStore()

const article: Ref<Article | undefined> = ref()
const author: Ref<User | undefined> = ref()
const comments: Ref<Comment[] | undefined> = ref()
const loaded: Ref<boolean> = ref(false)
const newCommentsCount: Ref<number> = ref(0)
const commentRefreshing: Ref<boolean> = ref(false)
const commentPage: Ref<number> = ref(1)
const totalComments: Ref<number> = ref(0)

const goHome = () => {
  router.push('/')
}

const deletePost = async () => {
  if (!authStore.isLoggedIn) return
  await postApi.deletePost(postId)
  await router.push('/')
}

const getComments = async (page: number) => {
  const commentEntity = await commentApi.getCommentsByPostId(postId, page - 1)
  if (commentEntity) {
    comments.value = commentEntity
  }
}

const refreshComment = async () => {
  commentRefreshing.value = true
  commentPage.value = 1
  totalComments.value = await commentApi.getCommentsCountByPostId(postId)
  const commentEntity = await commentApi.getCommentsByPostId(postId, 0)
  if (commentEntity) {
    comments.value = commentEntity
    newCommentsCount.value = 0
  }
  commentRefreshing.value = false
}

const onWebSocketMessage = (type: WebSocketMessageType) => {
  if (type === WebSocketMessageType.NEW_COMMENT) {
    newCommentsCount.value++
  }
}

onMounted(async () => {
  const articleEntity = await postApi.getPostById(postId)
  if (!articleEntity) {
    return
  }
  article.value = articleEntity

  await refreshComment()

  const authorId = articleEntity.authorId
  const authorEntity = await userApi.getUserById(authorId)
  if (authorEntity) {
    author.value = authorEntity
  }

  WebSocketServiceInstance.connectWebSocket(postId, onWebSocketMessage)
  loaded.value = true
})

onBeforeUnmount(() => {
  WebSocketServiceInstance.disconnectWebSocket(postId)
})
</script>

<template>
  <el-container>
    <el-header style="padding: 0">
      <TopNavigation />
    </el-header>

    <div v-if="loaded">
      <div v-if="article === undefined">
        <el-main style="min-height: 90dvh">
          <el-empty style="margin-top: 100px">
            <template #description>
              <p>Not Found</p>
              <el-button style="margin-top: 10px" @click="goHome">Go Home</el-button>
            </template>
          </el-empty>
        </el-main>
        <el-footer style="padding: 0">
          <PageFooter />
        </el-footer>
      </div>

      <div v-else>
        <el-main class="article-content">
          <div class="article-main">
            <!-- Title -->
            <h1 class="article-title">{{ article.title }}</h1>

            <!-- Author Info -->
            <div class="author-info">
              <el-avatar :size="40" />
              <div class="author-details">
                <div class="author-name">
                  {{ author ? (author.nickname ?? author.username) : 'Unknown' }}
                </div>
                <div v-if="author !== undefined && author.bio?.length !== 0" class="author-title">
                  {{ author.bio }}
                </div>
              </div>
            </div>

            <!-- Metadata -->
            <div class="article-info">
              <div class="meta-info">
                <span
                  ><el-icon><Calendar /></el-icon>Published:
                  {{
                    DateTime.fromISO(article.createdAt)
                      .toLocal()
                      .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
                  }}</span
                >
                <span v-if="article.updatedAt && article.updatedAt !== article.createdAt"
                  ><el-icon><Calendar /></el-icon>Updated:
                  {{
                    DateTime.fromISO(article.updatedAt)
                      .toLocal()
                      .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
                  }}</span
                >
                <!--            <span-->
                <!--              ><el-icon><View /></el-icon> 12,483-->
                <!--            </span>-->
                <!--            <span-->
                <!--              ><el-icon><ChatLineRound /></el-icon> 238-->
                <!--            </span>-->
              </div>
              <div v-if="authStore.isLoggedIn" class="article-action">
                <el-button :icon="Edit" size="small" type="primary">Edit</el-button>
                <el-popconfirm title="Are you sure to delete this post?" @confirm="deletePost">
                  <template #reference>
                    <el-button :icon="Delete" size="small" type="danger">Delete</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>

            <!-- Tags -->
            <div v-for="(tag, index) in article.tags" :key="index" class="article-tags">
              <el-tag :type="tagTypes[index % article.tags.length!]" size="small"
                >{{ tag.name }}
              </el-tag>
            </div>

            <!-- Body -->
            <div class="article-body">
              <p>{{ article.content }}</p>
            </div>
          </div>
        </el-main>
        <el-footer style="padding: 0">
          <div class="footer">
            <!-- Comments Section -->
            <div class="comments-section">
              <div class="comments-section-title">
                <h3>Comments ({{ totalComments }})</h3>
                <el-button
                  v-if="newCommentsCount > 0"
                  :disabled="commentRefreshing"
                  class="refresh-button"
                  type="success"
                  @click="refreshComment"
                >
                  <el-icon :class="{ 'is-refreshing': commentRefreshing }" class="refresh-icon">
                    <RefreshRight class="refresh-icon-content" />
                  </el-icon>
                  {{ newCommentsCount }} New
                </el-button>
              </div>
              <CommentList :comments="comments" />
              <el-pagination
                v-if="totalComments !== 0"
                v-model:current-page="commentPage"
                :page-size="5"
                :total="totalComments"
                layout="prev, pager, next, total, jumper"
                style="justify-content: center; margin-top: 10px"
                @current-change="getComments"
              />
              <CommentForm :post-id="postId" class="comment-form" />
            </div>
          </div>
          <!-- Page Footer -->
          <PageFooter />
        </el-footer>
      </div>
    </div>
    <div v-else class="article-content" style="margin-top: 80px">
      <el-skeleton :rows="10" animated />
    </div>
  </el-container>
</template>

<style scoped>
.article-content {
  display: flex;
  width: 75%;
  margin: 0 auto;
}

.article-main {
  width: 100%;
}

.article-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  line-height: 1.3;
}

.author-info {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.author-details {
  margin-left: 12px;
}

.author-name {
  font-weight: 500;
  font-size: 16px;
}

.author-title {
  font-size: 14px;
  color: #666666;
}

.article-info {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.meta-info {
  display: flex;
  gap: 16px;
  color: #666666;
  font-size: 14px;
}

.meta-info span {
  display: flex;
  line-height: 1;
  gap: 4px;
}

.article-action {
  display: flex;
  margin-left: auto;
}

.article-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.article-body {
  font-size: 16px;
  line-height: 1.8;
  color: #333333;
}

.article-body p {
  margin-bottom: 16px;
  min-height: 40dvh;
}

.article-image img {
  width: 100%;
  border-radius: 8px;
  display: block;
}

.footer {
  width: 75%;
  margin: 0 auto;
}

.comments-section {
  padding: 0 20px 0 20px;
  border-top: 1px solid #eaeaea;
}

.comment-form {
  margin-top: 16px;
}

.comments-section-title {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.refresh-button {
  padding-left: 4px;
  padding-right: 12px;
  margin-left: 14px;
  border-radius: 20px;
}

.refresh-button:hover {
  .refresh-icon {
    transform: rotate(360deg);
  }

  .refresh-icon-content {
    opacity: 0.6;
  }
}

.refresh-button:active {
  .refresh-icon {
    background-color: #eaeaea;
  }
}

.refresh-icon {
  background-color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  transition: transform 0.5s ease;
}

.refresh-icon-content {
  color: black;
}

.refresh-icon.is-refreshing {
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.comments-section h3 {
  font-size: 20px;
  margin-bottom: 20px;
}
</style>
