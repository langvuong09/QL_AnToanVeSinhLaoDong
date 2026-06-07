# Mocks - Mock Data & Functions

Folder này chứa tất cả các mock data và functions để mô phỏng API calls trong quá trình phát triển.

## Cấu trúc

```
mocks/
├── constants.ts       # Các hằng số và dữ liệu test
├── auth.mock.ts       # Mock functions cho authentication
└── index.ts           # Xuất tất cả mocks
```

## Sử dụng

### Import mocks

```typescript
import { 
  mockLoginAPI,
  mockSendForgotPasswordEmailAPI,
  MOCK_CREDENTIALS,
  TIMERS,
  EMAIL_REGEX
} from "@/src/mocks"
```

### Các mock functions có sẵn

#### Auth
- `mockLoginAPI(account, password)` - Kiểm tra tài khoản/mật khẩu
- `mockSendForgotPasswordEmailAPI(email)` - Gửi email quên mật khẩu
- `mockVerifyOTPAPI(otp)` - Xác minh mã OTP
- `mockResendOTPAPI(email)` - Gửi lại mã OTP
- `mockResetPasswordAPI(email, newPassword)` - Đặt lại mật khẩu

#### Constants
- `MOCK_CREDENTIALS` - Thông tin tài khoản test
- `TIMERS` - Các giá trị timeout/delay
- `EMAIL_REGEX` - Regex kiểm tra email
- `PASSWORD_CONSTRAINTS` - Yêu cầu mật khẩu
- `OTP_CONSTRAINTS` - Yêu cầu OTP

## Test Credentials

```
Email: test@example.com
Password: password123
OTP: 123456
```

## Chuyển sang API thực tế

Khi sẵn sàng sử dụng API thực tế:

1. **Tạo folder `/lib/api`** để chứa các functions thực tế
2. **Thay thế imports**: Đổi từ `@/src/mocks` sang `@/src/lib/api`
3. **Giữ nguyên interface**: Các functions mock và API thực tế nên có signature giống nhau

### Ví dụ:

```typescript
// Trước (mock)
import { mockLoginAPI } from "@/src/mocks"
const result = await mockLoginAPI(account, password)

// Sau (API thực)
import { loginAPI } from "@/src/lib/api"
const result = await loginAPI(account, password)
```

## Thêm mocks mới

1. Thêm mock data vào `constants.ts` nếu cần
2. Thêm mock function vào `auth.mock.ts` (hoặc file mới nếu khác domain)
3. Export trong `index.ts`

## Ghi chú

- Các mock functions có delay mô phỏng network latency
- Test credentials hardcoded để dễ debug - đổi khi có API thực tế
- Tất cả dữ liệu mock là tạm thời và chỉ cho phát triển
