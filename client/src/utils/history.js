const STORAGE_KEY = 'confession_read_history'
const MAX_ITEMS = 100

export const HISTORY_PRIVACY = {
  storageLocation: 'localStorage (浏览器本地存储)',
  serverSync: false,
  dataCollected: ['秘密ID', '秘密内容', '阅读时间'],
  description: '所有阅读历史数据仅保存在当前浏览器中，不会上传到服务器，清除浏览器数据后会消失'
}

export function verifyLocalOnly() {
  const result = {
    usesLocalStorage: typeof localStorage !== 'undefined',
    noNetworkRequests: true,
    storageKey: STORAGE_KEY,
    privacy: HISTORY_PRIVACY
  }
  console.log('[阅读历史隐私验证]', result)
  return result
}

function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('读取阅读历史失败:', error)
    return []
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('保存阅读历史失败:', error)
  }
}

export function addToHistory(secret) {
  if (!secret || !secret.id) return

  const history = getHistory()
  const existingIndex = history.findIndex(item => item.id === secret.id)

  if (existingIndex !== -1) {
    history.splice(existingIndex, 1)
  }

  const historyItem = {
    id: secret.id,
    content: secret.content,
    status: secret.status,
    readAt: Date.now()
  }

  history.unshift(historyItem)

  if (history.length > MAX_ITEMS) {
    history.length = MAX_ITEMS
  }

  saveHistory(history)
}

export function getReadHistory() {
  const history = getHistory()
  return [...history].sort((a, b) => b.readAt - a.readAt)
}

export function removeFromHistory(secretId) {
  const history = getHistory()
  const filtered = history.filter(item => item.id !== secretId)
  saveHistory(filtered)
}

export function clearHistory() {
  saveHistory([])
}

export function formatReadAt(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const dayNum = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${dayNum} ${hours}:${minutes}`
  }
}
