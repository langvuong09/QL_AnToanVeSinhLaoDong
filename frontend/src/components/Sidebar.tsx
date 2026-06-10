'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ViewItem } from '../api/types/view'
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

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams();

  const [views, setViews] = useState<ViewItem[]>([]);
  const [sidebarMenus, setSidebarMenus] = useState<SidebarMenuItem[]>([]);
  const [activeMenu, setActiveMenu] = useState<string>('');

  // Transform views data into sidebar menu structure
  const transformViewsToMenus = (viewsData: ViewItem[]): SidebarMenuItem[] => {
    // Get parent items (parentId is null)
    const parentItems = viewsData.filter(item => item.parentId === null).sort((a, b) => (a.order || 0) - (b.order || 0));

    return parentItems.map((parent) => {
      // Get child items for this parent
      const childItems = viewsData
        .filter(item => item.parentId === parent.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      return {
        id: parent.id,
        label: parent.name,
        isOpen: true,
        items: childItems.map(child => ({
          id: child.id,
          label: child.name,
          path: child.url,
        })),
      };
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem("views") || sessionStorage.getItem("views") || "[]";
    try {
      const parsed: ViewItem[] = JSON.parse(stored);
      setViews(parsed);
      const menus = transformViewsToMenus(parsed);
      setSidebarMenus(menus);
    } catch (error) {
      console.error("Error parsing views data:", error);
      setViews([]);
      setSidebarMenus([]);
    }
  }, []);

  useEffect(() => {
    setSidebarMenus((prevMenus) => {
      if (prevMenus.length === 0) return prevMenus;

      const allItems = prevMenus.flatMap((menu) => menu.items);
      const validPaths = allItems.map((item) => item.path);

      if (pathname === '/' || !validPaths.includes(pathname)) {
        if (allItems.length > 0) {
          router.replace(allItems[0].path);
        }
        return prevMenus;
      }

      const activeItem = allItems.find((item) => item.path === pathname);
      if (activeItem) {
        setActiveMenu(activeItem.id.toString());
      }

      return prevMenus.map((menu) => {
        const menuStateFromUrl = searchParams.get(String(menu.id));

        return {
          ...menu,
          isOpen:
            menuStateFromUrl === null
              ? menu.isOpen
              : menuStateFromUrl === 'true',
        }
      });
    });
  }, [pathname, searchParams, router]);

  const handleToggleMenu = (menuId: number) => {
    const params = new URLSearchParams(searchParams.toString());

    const currentMenu = sidebarMenus.find((menu) => menu.id === menuId);

    if (!currentMenu) return;

    const nextIsOpen = !currentMenu.isOpen;

    params.set(String(menuId), String(nextIsOpen));

    setSidebarMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.id === menuId
          ? {
            ...menu,
            isOpen: nextIsOpen,
          }
          : menu
      )
    );

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }

  const getMenuPath = (path: string) => {
    const queryString = searchParams.toString();

    return queryString ? `${path}?${queryString}` : path;
  }

  return (
    <div className="py-3 space-y-5 bg-[#14317F] text-white h-screen flex flex-col w-xs">
      {/* Header */}
      <div className="flex items-center gap-5 px-5">
        <div className="w-15 h-15">
          <img src="quochuy.png" alt="" />
        </div>

        <h1 className="text-center font-semibold">
          Ủy ban nhân dân thành phố
          <br />
          Hồ Chí Minh
        </h1>

        <button className="text-2xl font-semibold">
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 border-t border-[#FFFFFF] py-3 space-y-6">
        {sidebarMenus.map((menu) => (
          <nav key={menu.id} className="space-y-4">
            <div className="flex items-center justify-between px-5">
              <div className="flex items-center">
                <div className="w-5 flex justify-center">
                  <i className="fa-solid fa-gear w-10 overflow-hidden"></i>
                </div>

                <span className="flex-1 ps-6">{menu.label}</span>
              </div>

              <button onClick={() => handleToggleMenu(menu.id)}>
                <i
                  className={`fa-solid ${menu.isOpen ? 'fa-angle-down' : 'fa-angle-right'
                    }`}
                ></i>
              </button>
            </div>

            {menu.isOpen && (
              <ul>
                {menu.items.map((item) => (
                  <li
                    key={item.id}
                    className={`button menu-hover px-5 ${activeMenu === item.id.toString() ? 'menu-active' : ''
                      }`}
                  >
                    <Link href={getMenuPath(item.path)} className="flex items-center py-3">
                      <div className="w-5 flex justify-center">
                        <i className="fa-solid fa-circle text-[5px] w-10 overflow-hidden"></i>
                      </div>

                      <span className="flex-1 ps-6">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        ))}
      </div>

      {/* Footer */}
      <UserFooter />
    </div>
  )
}