'use client'

import { useEffect, useState } from 'react'
import { Jwt } from '../api/types/jwt'
import { parseAccessToken } from '../utils/jwt-parser'
import { Auth } from '../api/Auth';

export default function UserFooter() {
  const [user, setUser] = useState<Jwt | null>(null);
  const [loading, setLoading] = useState(true);

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleLogout =  async () => {
    const auth = new Auth();
    await auth.Logout();

  }

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
      if (accessToken) {
        const parsed = parseAccessToken(accessToken)
        setUser(parsed)
      }
    } catch (error) {
      console.error('Error parsing JWT:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-5 px-5">
        <div className="w-10 h-10 rounded-full bg-gray-400 animate-pulse"></div>
        <div className="flex-1 flex justify-between">
          <div className="h-4 bg-gray-400 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {isClicked && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[75%] bg-white py-2 rounded-xl mb-10">
          <ul className="space-y-2">
            <li className="text-[16px] text-black font-semibold">
              <button className="flex items-center gap-4 hover:bg-gray-200 w-full px-5 py-2">
                <i className="fa-solid fa-user text-gray-500 text-2xl"></i>
                <span>Thông tin tài khoản</span>
              </button>
            </li>
            <li className="text-[16px] text-black font-semibold">
              <button className="flex items-center gap-4 hover:bg-gray-200 w-full px-5 py-2">
                <i className="fa-solid fa-key text-gray-500 text-2xl"></i>
                <span>Đổi mật khẩu</span>
              </button>
            </li>
            <li className="text-[16px] text-black font-semibold">
              <button className="flex items-center gap-4 hover:bg-gray-200 w-full px-5 py-2">
                <i className="fa-solid fa-arrow-right-from-bracket text-red-500 text-2xl"></i>
                <span>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </div>
      )}

      <div className="flex items-center gap-5 py-2 px-5 cursor-pointer hover:bg-[#2447a5]" onClick={() => setIsClicked(prev => !prev)}>
        <div className="w-10 h-10 rounded-full bg-white overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 flex justify-between items-center">
          <div className="min-w-0">
            <h1 className="text-lg font-medium truncate">{user?.username || 'Tài khoản'}</h1>
          </div>

          <button className="shrink-0">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
