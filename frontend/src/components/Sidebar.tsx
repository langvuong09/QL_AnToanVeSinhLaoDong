'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import UserFooter from './UserFooter'

type SidebarChildItem = {
  id: number
  label: string
  path: string
}

type SidebarMenuItem = {
  id: number
  label: string
  isOpen: boolean
  items: SidebarChildItem[]
}

const menus: SidebarMenuItem[] = [
  {
    id: 1,
    label: 'Quản trị phần mềm',
    isOpen: true,
    items: [
      { id: 11, label: 'Quản lý người dùng', path: '/accounts' },
      { id: 12, label: 'Quản lý doanh nghiệp', path: '/business-managements' },
      { id: 13, label: 'Kỳ báo cáo', path: '/report-periods' },
      { id: 14, label: 'Loại hình kinh doanh', path: '/business-types' },
      { id: 15, label: 'Ngành nghề kinh doanh', path: '/business-industries' },
    ],
  },
  {
    id: 2,
    label: 'Tai nạn lao động',
    isOpen: true,
    items: [
      { id: 21, label: 'Danh mục chung', path: '/categories' },
      { id: 22, label: 'TNLĐ theo HĐLĐ', path: '/aggreements' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [sidebarMenus, setSidebarMenus] = useState<SidebarMenuItem[]>(menus)

  const activeMenu = useMemo(() => {
    const active = sidebarMenus
      .flatMap((menu) => menu.items)
      .find((item) => pathname?.startsWith(item.path))
    return active?.id.toString() || ''
  }, [pathname, sidebarMenus])

  const handleToggleMenu = (menuId: number) => {
    setSidebarMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === menuId
          ? { ...menu, isOpen: !menu.isOpen }
          : menu
      )
    )
  }

  return (
    <div className="py-3 bg-[#14317F] text-white h-screen flex flex-col">
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
        {sidebarMenus.map((menu) => (
          <div key={menu.id} className="mb-1">
            {/* Group Header */}
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-bold text-white hover:bg-white/10 transition-colors"
              onClick={() => handleToggleMenu(menu.id)}
            >
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-gear text-[11px] text-white/80" />
                <span>{menu.label}</span>
              </div>
              <i className={`fa-solid ${menu.isOpen ? 'fa-angle-down' : 'fa-angle-right'} text-xs`} />
            </button>

            {menu.isOpen && (
              <ul>
                {menu.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-2 px-5 py-2.5 text-xs transition-colors ${activeMenu === item.id.toString()
                          ? 'bg-white/20 text-white font-semibold'
                          : 'text-white/80 hover:bg-white/10'
                        }`}
                    >
                      <i className="fa-solid fa-circle text-[5px]" />
                      <span>{item.label}</span>
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
