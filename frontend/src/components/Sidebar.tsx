'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import UserFooter from './UserFooter'

type RequiredPermission = {
  id: string;
  name: string;
  code: string;
  groupPermissionId: number;
}

type SidebarChildItem = {
  id: number;
  name: string;
  url: string;
  requiredPermissions: RequiredPermission[];
}

type SidebarMenuItem = {
  id: number;
  name: string;
  url: string;
  requiredPermissions: any[];
  parentId: string | null;
  children: SidebarChildItem[];
  isOpen: boolean;
}

export default function Sidebar() {
  const pathname = usePathname()
  const [sidebarMenus, setSidebarMenus] = useState<SidebarMenuItem[] | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("views") || sessionStorage.getItem("views") || "";
    if (!stored) {
      setSidebarMenus(null);
      return;
    }
    try {
      const parsed: SidebarMenuItem[] = JSON.parse(stored);
      setSidebarMenus(parsed?.length ? parsed.map(p => ({ ...p, isOpen: false })) : null);
    } catch {
      setSidebarMenus(null);
    }
  }, []);

  const activeMenu = useMemo(() => {
    if (!sidebarMenus) return '';
    const active = sidebarMenus
      .flatMap((menu) => menu.children || [])
      .find((item) => pathname?.startsWith(item.url))
    return active?.id.toString() || ''
  }, [pathname, sidebarMenus])

  const handleToggleMenu = (menuId: number) => {
    setSidebarMenus((prevMenus) =>
      prevMenus!.map((menu) =>
        menu.id === menuId
          ? { ...menu, isOpen: !menu.isOpen }
          : menu
      )
    );
  }

  return (
    <div className="py-3 bg-[#14317F] text-white h-screen flex flex-col min-w-80">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 pb-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white overflow-hidden shrink-0">
          <img src="/quochuy.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-xs font-semibold leading-tight">Ủy ban nhân dân thành phố</p>
          <p className="text-xs leading-tight">Hồ Chí Minh</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 border-t border-white/25 pt-2 overflow-y-auto">
        {sidebarMenus && sidebarMenus.map((menu) => (
          <div key={menu.id} className="mb-1">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-bold text-white hover:bg-white/10 transition-colors"
              onClick={() => handleToggleMenu(menu.id)}
            >
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-gear text-[11px] text-white/80" />
                <span>{menu.name}</span>
              </div>
              <i className={`fa-solid ${menu.isOpen ? 'fa-angle-down' : 'fa-angle-right'} text-xs`} />
            </button>

            {menu.isOpen && (
              <ul>
                {menu.children?.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-2 px-5 py-2.5 text-xs transition-colors ${activeMenu === item.id.toString()
                        ? 'bg-white/20 text-white font-semibold'
                        : 'text-white/80 hover:bg-white/10'
                        }`}
                    >
                      <i className="fa-solid fa-circle text-[5px]" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <UserFooter />
    </div>
  )
}