import { request } from './request'

/**
 * 上传文件（如商品图片）
 * @param {File} file
 * @returns {Promise<{ url?: string, id?: string }>}
 */
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request
    .post('/file/upload', formData, {
      timeout: 30000,
    })
    .then((res) => {
      let data = res.data?.data ?? res.data
      if (data == null) return {}
      if (Array.isArray(data)) data = data[0] ?? {}
      if (typeof data === 'string') return { url: data }
      if (typeof data !== 'object') return {}
      const url = data.url ?? data.fileUrl ?? data.imageUrl ?? data.path ?? data.filePath
      const id = data.id ?? data.fileId
      return { ...data, url: url ?? data.url, id: id ?? data.id }
    })
}

/** 格式化为 yyyy-MM-dd HH:mm:ss，用于创建时间查询 */
function toCreateTimeStr(dateInput, endOfDay = false) {
  if (!dateInput) return undefined
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return endOfDay ? `${y}-${m}-${day} 23:59:59` : `${y}-${m}-${day} 00:00:00`
}

/**
 * 图片库分页查询
 * @param {Object} params - { keyword?, createTime?: [string, string], page?, size? }
 * @returns {Promise<{ items: Array<{ id, url, title?, productName?, code?, material?, createTime? }>, total: number }>}
 */
export function searchImages(params = {}) {
  const createTime = params.createTime
  return request
    .post('/file/searchImages', {
      page: params.page ?? 1,
      size: params.size ?? 12,
      keyword: params.keyword || undefined,
      createTimeBegin: createTime?.[0] ? toCreateTimeStr(createTime[0], false) : undefined,
      createTimeEnd: createTime?.[1] ? toCreateTimeStr(createTime[1], true) : undefined,
    })
    .then((res) => {
      const raw = res.data?.data ?? res.data ?? {}
      const list = Array.isArray(raw) ? raw : (raw.items ?? raw.list ?? [])
      const total = typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? (raw.total ?? list.length) : list.length
      return { items: list, total }
    })
}

/** 按 id 删除文件（图片库中的删除） */
export function deleteFileById(id) {
  return request.post('/file/deleteById', { id: id != null ? String(id) : undefined }).then(() => {})
}
