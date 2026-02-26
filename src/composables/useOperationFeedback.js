import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 操作状态管理
export function useOperationFeedback() {
  const loadingStates = ref({})

  // 设置加载状态
  const setLoading = (key, isLoading) => {
    loadingStates.value[key] = isLoading
  }

  // 检查是否正在加载
  const isLoading = (key) => {
    return !!loadingStates.value[key]
  }

  // 显示成功消息
  const showSuccess = (message) => {
    ElMessage.success(message)
  }

  // 显示错误消息
  const showError = (message) => {
    ElMessage.error(message)
  }

  // 显示警告消息
  const showWarning = (message) => {
    ElMessage.warning(message)
  }

  // 显示信息消息
  const showInfo = (message) => {
    ElMessage.info(message)
  }

  // 删除/确认对话框：挂载到 body 并居中，样式与页面统一
  const messageBoxOptions = {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    center: true,
    appendTo: document.body,
    customClass: 'oms-message-box',
  }

  const confirmAction = async (message, title = '确认操作') => {
    try {
      await ElMessageBox.confirm(message, title, messageBoxOptions)
      return true
    } catch {
      return false
    }
  }

  // 带加载状态的操作包装器
  const withLoading = async (key, action, successMessage = '操作成功') => {
    try {
      setLoading(key, true)
      const result = await action()
      if (successMessage) {
        showSuccess(successMessage)
      }
      return result
    } catch (error) {
      showError(error.message || '操作失败')
      throw error
    } finally {
      setLoading(key, false)
    }
  }

  // 删除确认操作
  const withDeleteConfirm = async (itemName, deleteAction) => {
    const confirmed = await confirmAction(`确定要删除"${itemName}"吗？此操作不可撤销。`, '删除确认')
    if (confirmed) {
      return withLoading(`delete_${Date.now()}`, deleteAction, '删除成功')
    }
  }

  // 保存操作
  const withSaveOperation = async (saveAction, itemName = '数据') => {
    return withLoading(`save_${Date.now()}`, saveAction, `${itemName}保存成功`)
  }

  return {
    loadingStates,
    setLoading,
    isLoading,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    confirmAction,
    withLoading,
    withDeleteConfirm,
    withSaveOperation,
    messageBoxOptions,
  }
}