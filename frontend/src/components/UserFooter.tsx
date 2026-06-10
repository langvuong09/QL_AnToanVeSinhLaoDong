'use client'

import { useContext, useEffect, useState } from 'react'
import { Jwt } from '../api/types/jwt'
import { parseAccessToken } from '../utils/jwt-parser'
import { Auth } from '../api/Auth';
import { useRouter } from 'next/navigation';
import { NotificateContext } from '../contexts/notificate/notificate';
import ChangePassword from './ChangePassword';

export default function UserFooter() {
  const router = useRouter();
  const notificate = useContext(NotificateContext);

  const [user, setUser] = useState<Jwt | null>(null);

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [isOpenChangePassword, setIsChangePassword] = useState<boolean>(false);

  const handleLogout = async () => {
    const auth = new Auth();
    await auth.Logout();

    // Xóa token từ localStorage/sessionStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("views");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("views");

    // Xóa cookie
    document.cookie = "accessToken=; path=/; max-age=0";

    notificate?.showNotification({ type: "success", message: "Đăng xuất thành công." });
    setTimeout(() => {
      router.push("/login");
    }, 100);
  }

  const decodeAccessToken = () => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (accessToken) {
      const parsed = parseAccessToken(accessToken);
      setUser(parsed);
    }
  }

  useEffect(() => {
    decodeAccessToken();
  }, []);

  return (
    <div className="relative">
      {isClicked && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[70%] bg-white py-2 rounded-xl mb-10">
          <ul className="space-y-2">
            <li className="text-[14px] text-black font-semibold">
              <button className="flex items-center gap-4 hover:bg-gray-200 w-full px-5 py-2" onClick={() => router.push("/infomation")}>
                <i className="fa-solid fa-user text-gray-500 text-2xl"></i>
                <span>Thông tin tài khoản</span>
              </button>
            </li>
            <li className="text-[14px] text-black font-semibold" onClick={() => {
              setIsChangePassword(true);
              setIsClicked(false);
            }}>
              <button className="flex items-center gap-4 hover:bg-gray-200 w-full px-5 py-2">
                <i className="fa-solid fa-key text-gray-500 text-2xl"></i>
                <span>Đổi mật khẩu</span>
              </button>
            </li>
            <li className="text-[14px] text-black font-semibold" onClick={() => {
              handleLogout();
              setIsClicked(false);
            }}>
              <button className="flex items-center gap-4 hover:bg-gray-200 w-full px-5 py-2">
                <i className="fa-solid fa-arrow-right-from-bracket text-red-500 text-2xl"></i>
                <span>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </div>
      )}

      <div className="flex items-center gap-5 py-4 px-5 cursor-pointer hover:bg-[#2447a5] border-t  border-b border-[#FFFFFF]" onClick={() => setIsClicked(prev => !prev)}>
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

      {isOpenChangePassword && (
        <ChangePassword onClose={() => setIsChangePassword(false)} />
      )}
    </div>
  )
}
