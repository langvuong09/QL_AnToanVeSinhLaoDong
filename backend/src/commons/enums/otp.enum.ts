export enum OtpType {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
  RESET_EMAIL = 'RESET_EMAIL',
}

export const getOtpKey = (type: OtpType, userId: string | number) => {
  return `otp:${type}:${userId}`;
};