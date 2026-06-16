<template>
  <div class="history-container">
    <div class="card history-card">
      <div class="card-header">
        <span class="icon">📖</span>
        <h2>阅读历史</h2>
        <p class="subtitle">仅保存在你的浏览器中，不会上传到服务器</p>
      </div>

      <div v-if="historyList.length === 0" class="empty-state">
        <span class="empty-icon">🌙</span>
        <p>还没有阅读记录</p>
        <button class="btn btn-primary" @click="goHome">
          去看看秘密
        </button>
      </div>

      <div v-else>
        <div class="history-actions">
          <span class="history-count">共 {{ historyList.length }} 条记录</span>
          <button class="btn btn-danger" @click="handleClearAll">
            🗑️ 一键清空
          </button>
        </div>

        <transition-group name="list" tag="div" class="history-list">
          <div
            v-for="item in historyList"
            :key="item.id"
            class="history-item"
          >
            <div class="item-content">
              <p class="secret-text">"{{ item.content }}"</p>
              <div class="item-meta">
                <span class="status-badge">{{ item.status }}</span>
                <span class="read-time">{{ formatReadAt(item.readAt) }}</span>
              </div>
            </div>
            <button
              class="remove-btn"
              @click="handleRemove(item.id)"
              title="删除此条记录"
            >
              ✕
            </button>
          </div>
        </transition-group>
      </div>
    </div>

    <div v-if="showConfirmDialog" class="confirm-overlay" @click.self="showConfirmDialog = false">
      <div class="confirm-dialog">
        <p class="confirm-title">确认清空所有历史记录？</p>
        <p class="confirm-desc">此操作不可撤销</p>
        <div class="confirm-actions">
          <button class="btn btn-secondary" @click="showConfirmDialog = false">
            取消
          </button>
          <button class="btn btn-danger" @click="confirmClearAll">
            确认清空
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getReadHistory,
  removeFromHistory,
  clearHistory,
  formatReadAt
} from '../utils/history.js'

const router = useRouter()
const historyList = ref([])
const showConfirmDialog = ref(false)

function loadHistory() {
  historyList.value = getReadHistory()
}

function handleRemove(secretId) {
  historyList.value = removeFromHistory(secretId)
}

function handleClearAll() {
  showConfirmDialog.value = true
}

function confirmClearAll() {
  historyList.value = clearHistory()
  showConfirmDialog.value = false
}

function goHome() {
  router.push('/')
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.history-container {
  width: 100%;
  max-width: 600px;
}

.history-card {
  animation: slideUp 0.6s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
}

.icon {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}

.card-header h2 {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle {
  color: #999;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 20px;
}

.empty-state p {
  color: #666;
  font-size: 16px;
  margin-bottom: 30px;
}

.history-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.history-count {
  color: #666;
  font-size: 14px;
}

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: white;
  padding: 8px 20px;
  font-size: 14px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(238, 90, 90, 0.4);
}

.history-list {
  max-height: 500px;
  overflow-y: auto;
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.history-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

.history-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: #fafafa;
  border-radius: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: #f5f5f5;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.secret-text {
  font-size: 15px;
  line-height: 1.7;
  color: #333;
  font-style: italic;
  margin-bottom: 12px;
  word-break: break-word;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.status-badge {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: #2d5a4a;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.read-time {
  color: #999;
  font-size: 12px;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #ccc;
  font-size: 18px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #ffebee;
  color: #ff6b6b;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.4s ease;
}

.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.confirm-dialog {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  max-width: 350px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: dialogIn 0.3s ease;
}

@keyframes dialogIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.confirm-title {
  font-size: 18px;
  color: #333;
  font-weight: 600;
  margin-bottom: 10px;
}

.confirm-desc {
  color: #999;
  font-size: 14px;
  margin-bottom: 25px;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
