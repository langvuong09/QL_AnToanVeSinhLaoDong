/**
 * Mock Constants
 * Tài khoản test và dữ liệu mock cho quá trình phát triển
 */

export const MOCK_CREDENTIALS = {
  LOGIN: {
    account: "test@example.com",
    password: "password123"
  },
  FORGOT_PASSWORD: {
    email: "test@example.com",
    otp: "123456"
  }
}

// API Response delays (ms)
export const API_DELAYS = {
  FAST: 500,
  NORMAL: 1000,
  SLOW: 1500
}

// Timer constants
export const TIMERS = {
  RESEND_OTP: 120, // 2 phút trước khi có thể gửi lại OTP
  LOGIN_SUCCESS_DELAY: 2000,
  OTP_VERIFY_DELAY: 1500,
  PASSWORD_RESET_DELAY: 2000
}

// Email regex pattern
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password constraints
export const PASSWORD_CONSTRAINTS = {
  MIN_LENGTH: 6
}

// OTP constraints
export const OTP_CONSTRAINTS = {
  LENGTH: 6
}
