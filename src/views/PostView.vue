<script setup lang="ts">
import PageFooter from '@/components/PageFooter.vue'
import TopNavigation from '@/components/TopNavigation.vue'
import CommentForm from '@/components/CommentForm.vue'
import type { Article, Comment, User, WebSocketMessage } from '@/types'
import { postApi } from '@/api/post.ts'
import { userApi } from '@/api/user.ts'
import { commentApi } from '@/api/comment.ts'
import router from '@/router'
import { DateTime } from 'luxon'
import { useAuthStore } from '@/stores/auth.ts'
import { WebSocketServiceInstance } from '@/service/webSocketService'
import CommentList from '@/components/CommentList.vue'
import IEpEdit from '~icons/ep/edit'
import IEpDelete from '~icons/ep/delete'
import IMdiThumbUp from '~icons/mdi/thumb-up'
import IMdiThumbUpOutline from '~icons/mdi/thumb-up-outline'
import { likeApi } from '@/api/like.ts'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { SortBy, tagTypes, WebSocketMessageType } from '@/constant'
import { useUserStore } from '@/stores/user.ts'
import ToggleSortTypeButton from '@/components/ToggleSortTypeButton.vue'
import BanDialog from '@/components/BanDialog.vue'

const { postId } = defineProps<{
  postId: string
}>()

const authStore = useAuthStore()
const userStore = useUserStore()

const article: Ref<Article | undefined> = ref()
const author: Ref<User | undefined> = ref()
const comments: Ref<Comment[] | undefined> = ref()
const loaded: Ref<boolean> = ref(false)
const newCommentsCount: Ref<number> = ref(0)
const commentRefreshing: Ref<boolean> = ref(false)
const commentPage: Ref<number> = ref(1)
const totalCommentPages: Ref<number> = ref(0)
const totalComments: Ref<number> = ref(0)
const isLiked: Ref<boolean> = ref(false)
const likeCount: Ref<number> = ref(0)
const likeLoading: Ref<boolean> = ref(false)
const articleContent = ref<HTMLDivElement | undefined>()
const commentListRef = ref<InstanceType<typeof CommentList>>()
const sortBy: Ref<SortBy> = ref(SortBy.TIME)
const banDialogVisible = ref(false)
const banUserId = ref<number | undefined>()

const goHome = () => {
  router.push('/')
}

const getLikes = async () => {
  likeLoading.value = true
  likeCount.value = await likeApi.getLikesByPostId(postId)
  if (authStore.hasToken) {
    isLiked.value = await likeApi.checkPostLikeState(postId)
  } else {
    isLiked.value = false
  }
  likeLoading.value = false
}

const toggleLike = async () => {
  likeLoading.value = true
  if (!authStore.hasToken) await authStore.getNewIdentity()
  await likeApi.likePost(postId)
  await getLikes()
  likeLoading.value = false
}

const deletePost = async () => {
  if (!authStore.isLoggedIn) return
  await postApi.deletePost(postId)
  await router.push('/')
}

const editPost = async () => {
  if (!authStore.isLoggedIn) return
  await router.push({ path: `/edit-post/${postId}` })
}

const getComments = async (page: number) => {
  const commentEntity = await commentApi.getCommentsByPostId(postId, page - 1, sortBy.value)
  if (commentEntity) {
    comments.value = commentEntity
  }
}

const refreshComment = async () => {
  commentRefreshing.value = true
  commentPage.value = 1
  totalCommentPages.value = await commentApi.getCommentPagesByPostId(postId)
  totalComments.value = await commentApi.getCommentCount(postId)
  const commentEntity = await commentApi.getCommentsByPostId(postId, 0, sortBy.value)
  if (commentEntity) {
    comments.value = commentEntity
    newCommentsCount.value = 0
  }
  commentRefreshing.value = false
}

const onWebSocketMessage = (message: WebSocketMessage) => {
  const { type } = message
  if (type === WebSocketMessageType.NEW_COMMENT) {
    newCommentsCount.value++
  } else if (type === WebSocketMessageType.LIKE_POST) {
    getLikes()
  } else if (type === WebSocketMessageType.LIKE_COMMENT) {
    const { commentId } = message.data as { commentId: string }
    if (commentListRef.value) {
      commentListRef.value.fetchLike(commentId)
    }
  }
}

const deleteComment = async (commentId: number) => {
  if (await commentApi.deleteComment(commentId)) {
    comments.value = comments.value?.filter((c) => c.id !== commentId)
    await refreshComment()
  }
}

const toggleSortBy = async () => {
  sortBy.value = sortBy.value === SortBy.TIME ? SortBy.LIKE : SortBy.TIME
  await refreshComment()
}

const showBanDialog = (userId: number) => {
  banUserId.value = userId
  banDialogVisible.value = true
}

watch(articleContent, () => {
  if (article.value?.content) {
    if (articleContent.value) {
      Vditor.preview(articleContent.value, article.value?.content || '', {
        mode: 'light',
        lang: 'en_US',
      })
    }
  }
})

watch(userStore.getUserInfo, () => {
  getLikes()
})

onMounted(async () => {
  const articleEntity = await postApi.getPostById(postId)
  if (!articleEntity) {
    return
  }
  article.value = articleEntity

  await getLikes()
  await refreshComment()
  const authorId = articleEntity.authorId
  const authorEntity = await userApi.getUserById(authorId)
  if (authorEntity) {
    author.value = authorEntity
  }
  WebSocketServiceInstance.connectPostWebSocket(postId, onWebSocketMessage)
  loaded.value = true
})

onBeforeUnmount(() => {
  WebSocketServiceInstance.disconnectPostWebSocket(postId)
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
    <BanDialog :user-id="banUserId" />
  </el-dialog>

  <TopNavigation />

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
      <PageFooter />
    </div>

    <div v-else>
      <el-main class="article-content">
        <div class="article-main">
          <!-- Title -->
          <h1 class="article-title">{{ article.title }}</h1>

          <!-- Author Info -->
          <div class="author-info">
            <el-avatar
              :size="40"
              :src="author?.avatarUrl"
              :style="{ backgroundColor: !author?.avatarUrl ? author?.avatarColor : undefined }"
            >
              <div class="comment-name">
                {{ !author?.avatarUrl ? author?.initials : undefined }}
              </div>
            </el-avatar>
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
                ><el-icon><IEpCalendar /></el-icon>Published:
                {{
                  DateTime.fromISO(article.createdAt)
                    .toLocal()
                    .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
                }}</span
              >
              <span v-if="article.updatedAt && article.updatedAt !== article.createdAt"
                ><el-icon><IEpCalendar /></el-icon>Updated:
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
              <el-button :icon="IEpEdit" size="small" type="primary" @click="editPost"
                >Edit
              </el-button>
              <el-popconfirm title="Are you sure to delete this post?" @confirm="deletePost">
                <template #reference>
                  <el-button :icon="IEpDelete" size="small" type="danger">Delete</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>

          <!-- Tags -->
          <div class="article-tags">
            <el-tag
              v-for="(tag, index) in article.tags"
              :key="index"
              :type="tagTypes[index % tagTypes.length]"
              size="small"
              >{{ tag }}
            </el-tag>
          </div>

          <!-- Body -->
          <div class="article-body">
            <div ref="articleContent" />
          </div>
          <div class="like-section">
            <el-button
              :icon="isLiked ? IMdiThumbUp : IMdiThumbUpOutline"
              :loading="likeLoading"
              :type="isLiked ? 'primary' : 'default'"
              class="like-button"
              size="large"
              @click="toggleLike"
            >
              {{ likeCount }}
            </el-button>
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
                  <IEpRefreshRight class="refresh-icon-content" />
                </el-icon>
                {{ newCommentsCount }} New
              </el-button>
              <ToggleSortTypeButton :sort-by="sortBy" :toggle-sort-by="toggleSortBy" />
            </div>
            <CommentList
              ref="commentListRef"
              :comments="comments"
              :delete-comment="deleteComment"
              :show-ban-dialog="showBanDialog"
            />
            <el-pagination
              v-if="totalCommentPages !== 0"
              v-model:current-page="commentPage"
              :page-count="totalCommentPages"
              :total="totalComments"
              layout="prev, pager, next, total, jumper"
              style="justify-content: center; margin-top: 10px"
              @update:current-page="getComments"
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
    <el-skeleton :rows="18" animated />
  </div>
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
  margin-bottom: 12px;
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
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.article-body {
  min-height: 30dvh;
  font-size: 16px;
  color: #333333;
  margin-bottom: 30px;
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

.like-section {
  display: flex;
  justify-content: center;
}

.like-button {
  min-width: 80px;
  font-size: 16px;
}
</style>
