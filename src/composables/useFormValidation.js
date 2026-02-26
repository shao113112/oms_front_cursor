import { ref, reactive } from 'vue'

// 邮箱验证正则
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 密码强度验证
const validatePasswordStrength = (password) => {
  const minLength = password.length >= 6
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  
  return {
    isValid: minLength && hasLetter && hasNumber,
    minLength,
    hasLetter,
    hasNumber
  }
}

// 邮箱验证
const validateEmail = (email) => {
  return EMAIL_REGEX.test(email)
}

// 表单验证组合式函数
export function useFormValidation() {
  const errors = ref({})
  const isSubmitting = ref(false)

  // 清除错误
  const clearErrors = () => {
    errors.value = {}
  }

  // 设置错误
  const setError = (field, message) => {
    errors.value[field] = message
  }

  // 验证登录表单
  const validateLoginForm = (formData) => {
    clearErrors()
    let isValid = true

    // 邮箱验证
    if (!formData.email) {
      setError('email', '请输入邮箱地址')
      isValid = false
    } else if (!validateEmail(formData.email)) {
      setError('email', '请输入有效的邮箱地址')
      isValid = false
    }

    // 密码验证
    if (!formData.password) {
      setError('password', '请输入密码')
      isValid = false
    } else if (formData.password.length < 6) {
      setError('password', '密码长度至少6位')
      isValid = false
    }

    return isValid
  }

  // 验证注册表单
  const validateRegisterForm = (formData) => {
    clearErrors()
    let isValid = true

    // 姓名验证
    if (!formData.name) {
      setError('name', '请输入姓名')
      isValid = false
    } else if (formData.name.length < 2) {
      setError('name', '姓名至少2个字符')
      isValid = false
    }

    // 公司名称验证
    if (!formData.company) {
      setError('company', '请输入公司名称')
      isValid = false
    }

    // 邮箱验证
    if (!formData.email) {
      setError('email', '请输入邮箱地址')
      isValid = false
    } else if (!validateEmail(formData.email)) {
      setError('email', '请输入有效的邮箱地址')
      isValid = false
    }

    // 密码验证
    if (!formData.password) {
      setError('password', '请输入密码')
      isValid = false
    } else {
      const passwordCheck = validatePasswordStrength(formData.password)
      if (!passwordCheck.isValid) {
        if (!passwordCheck.minLength) {
          setError('password', '密码长度至少6位')
        } else if (!passwordCheck.hasLetter) {
          setError('password', '密码必须包含字母')
        } else if (!passwordCheck.hasNumber) {
          setError('password', '密码必须包含数字')
        }
        isValid = false
      }
    }

    return isValid
  }

  // 获取错误信息
  const getError = (field) => {
    return errors.value[field] || ''
  }

  // 检查字段是否有错误
  const hasError = (field) => {
    return !!errors.value[field]
  }

  return {
    errors,
    isSubmitting,
    clearErrors,
    setError,
    validateLoginForm,
    validateRegisterForm,
    getError,
    hasError,
    validateEmail,
    validatePasswordStrength
  }
}