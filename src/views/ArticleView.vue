<script setup lang="ts">
import PageFooter from '@/components/PageFooter.vue'
import TopNavigation from '@/components/TopNavigation.vue'
import { Calendar, ChatLineRound, View } from '@element-plus/icons-vue'
import CommentForm from '@/components/CommentForm.vue'

defineProps({
  articleId: String,
})
</script>

<template>
  <el-container>
    <el-header style="padding: 0">
      <TopNavigation />
    </el-header>
    <el-main class="article-content">
      <div class="article-main">
        <!-- Title -->
        <h1 class="article-title">Article Title</h1>

        <!-- Author Info -->
        <div class="author-info">
          <el-avatar :size="40" />
          <div class="author-details">
            <div class="author-name">Name</div>
            <div class="author-title">Description</div>
          </div>
        </div>

        <!-- Metadata -->
        <div class="article-meta">
          <span
            ><el-icon><Calendar /></el-icon> 2024/04/02</span
          >
          <span
            ><el-icon><View /></el-icon> 12,483
          </span>
          <span
            ><el-icon><ChatLineRound /></el-icon> 238
          </span>
        </div>

        <!-- Tags -->
        <div class="article-tags">
          <el-tag size="small" type="info">Vue.js</el-tag>
          <el-tag size="small" type="success">Frontend</el-tag>
          <el-tag size="small">JavaScript</el-tag>
        </div>

        <!-- Body -->
        <div class="article-body">
          <p>
            Content Content Content Content Content Content Content Content Content Content Content
            Content Content Content Content Content Content Content Content Content Content Content
            Content Content Content Content Content Content Content Content Content Content
          </p>

          <div class="article-image">
            <img src="/template-img.png" />
            <div class="image-caption">Image Description</div>
          </div>
          <p>
            Content Content Content Content Content Content Content Content Content Content Content
            Content Content Content Content Content Content Content Content Content Content Content
            Content Content Content Content Content Content Content Content Content Content
          </p>
        </div>
      </div>
    </el-main>
    <el-footer style="padding: 0">
      <div class="footer">
        <!-- Comments Section -->
        <div class="comments-section">
          <CommentForm class="comment-form" />
          <h3 class="comments-section-title">Comments (238)</h3>

          <div class="comment">
            <div class="comment-author">
              <el-avatar :size="36"></el-avatar>
              <div class="comment-info">
                <div class="comment-name">Name</div>
                <div class="comment-time">2 Hours Ago</div>
              </div>
            </div>
            <div class="comment-content">
              Comment content. Comment content. Comment content. Comment content. Comment content.
            </div>
          </div>

          <div class="comment">
            <div class="comment-author">
              <el-avatar :size="36" />
              <div class="comment-info">
                <div class="comment-name">Name</div>
                <div class="comment-time">3 Hours Ago</div>
              </div>
            </div>
            <div class="comment-content">Comment content. Comment content. Comment content.</div>
          </div>
        </div>
      </div>
      <!-- Page Footer -->
      <PageFooter />
    </el-footer>
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
}

.article-image {
  margin: 20px 0 0 0;
}

.article-image img {
  width: 100%;
  border-radius: 8px;
  display: block;
}

.image-caption {
  text-align: center;
  color: #666666;
  font-size: 14px;
  padding: 8px 0 0 0;
  background-color: #f9f9f9;
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
