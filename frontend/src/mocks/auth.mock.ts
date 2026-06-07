/**
 * Auth Mock Functions
 * Mô phỏng các API authentication cho quá trình phát triển
 */

import { MOCK_CREDENTIALS, API_DELAYS } from './constants'

/**
 * Mock login API
 * Kiểm tra tài khoản và mật khẩu
 */
export async function mockLoginAPI(account: string, password: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, API_DELAYS.NORMAL))

  // Check credentials
  return (
    account === MOCK_CREDENTIALS.LOGIN.account &&
    password === MOCK_CREDENTIALS.LOGIN.password
  )
}

/**
 * Mock send email for forgot password
 * Kiểm tra email có tồn tại trong hệ thống
 */
export async function mockSendForgotPasswordEmailAPI(email: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, API_DELAYS.NORMAL))

  // Check if email exists in system
  return email === MOCK_CREDENTIALS.FORGOT_PASSWORD.email
}

/**
 * Mock verify OTP
 * Kiểm tra mã OTP có hợp lệ
 */
export async function mockVerifyOTPAPI(otp: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, API_DELAYS.NORMAL))

  // Check OTP
  return otp === MOCK_CREDENTIALS.FORGOT_PASSWORD.otp
}

/**
 * Mock resend OTP
 * Gửi lại mã OTP
 */
export async function mockResendOTPAPI(email: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, API_DELAYS.NORMAL))

  // Check if email exists
  return email === MOCK_CREDENTIALS.FORGOT_PASSWORD.email
}

/**
 * Mock reset password
 * Đặt lại mật khẩu
 */
export async function mockResetPasswordAPI(email: string, newPassword: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, API_DELAYS.NORMAL))

  // Validate password
  return newPassword.length >= 6
}
