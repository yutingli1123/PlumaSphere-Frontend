<script setup lang="ts">
import PageFooter from '@/components/PageFooter.vue'
import TopNavigation from '@/components/TopNavigation.vue'
import { Calendar } from '@element-plus/icons-vue'
import CommentForm from '@/components/CommentForm.vue'
import { onMounted, type Ref, ref } from 'vue'
import type { Article, Comment, User } from '@/types'
import { postApi } from '@/api/post.ts'
import { userApi } from '@/api/user.ts'
import { commentApi } from '@/api/comment.ts'
import router from '@/router'
import { DateTime } from 'luxon'

const { postId } = defineProps<{
  postId: number
}>()

const tagTypes = ['', 'success', 'warning', 'danger', 'info']

const article: Ref<Article | undefined> = ref()
const author: Ref<User | undefined> = ref()
const comments: Ref<Comment[] | undefined> = ref()
const loaded: Ref<boolean> = ref(false)

const goHome = () => {
  router.push('/')
}

onMounted(async () => {
  const articleEntity = await postApi.getPostById(postId)
  if (!articleEntity) {
    return
  }
  article.value = articleEntity

  const commentEntity = await commentApi.getCommentsByPostId(postId)
  if (commentEntity) {
    comments.value = commentEntity
  }

  const authorId = articleEntity.authorId
  const authorEntity = await userApi.getUserById(authorId)
  if (authorEntity) {
    author.value = authorEntity
  }
  loaded.value = true
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
            <div class="article-meta">
              <span
                ><el-icon><Calendar /></el-icon>Published:
                {{
                  DateTime.fromISO(article.createdAt)
                    .toLocal()
                    .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
                }}</span
              >
              <span v-if="article.updatedAt && article.updatedAt !== article.createdAt"
                ><el-icon><Calendar /></el-icon>Updated: {{ article.updatedAt }}</span
              >
              <!--            <span-->
              <!--              ><el-icon><View /></el-icon> 12,483-->
              <!--            </span>-->
              <!--            <span-->
              <!--              ><el-icon><ChatLineRound /></el-icon> 238-->
              <!--            </span>-->
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
              <h3 class="comments-section-title">
                Comments ({{ comments ? comments?.length : 0 }})
              </h3>

              <div v-for="(comment, index) in comments" :key="index" class="comment">
                <div class="comment-author">
                  <el-avatar :size="36"></el-avatar>
                  <div class="comment-info">
                    <div class="comment-name">{{ comment.authorNickname }}</div>
                    <div class="comment-time">{{ comment.createdAt }}</div>
                  </div>
                </div>
                <div class="comment-content">
                  {{ comment.content }}
                </div>
              </div>
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

.article-meta {
  display: flex;
  gap: 16px;
  color: #666666;
  font-size: 14px;
  margin-bottom: 18px;
}

.article-meta span {
  display: flex;
  line-height: 1;
  gap: 4px;
  align-items: center;
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
  margin-top: 30px;
}

.comments-section h3 {
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 500;
}

.comment {
  padding: 16px 0;
  border-bottom: 1px solid #eaeaea;
}

.comment-author {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.comment-info {
  margin-left: 12px;
}

.comment-name {
  font-weight: bold;
}

.comment-time {
  font-size: 12px;
  color: #999999;
}

.comment-content {
  font-size: 15px;
  line-height: 1.6;
}
</style>
