'use client'

import { useContext, useEffect, useRef, useState } from "react";
import TopHero from "@/src/components/TopHero";
import Button from "@/src/components/ui/Button";
import { User, IUser } from "@/src/api/User";
import { IRole, Role } from "@/src/api/Role";
import InputLegend from "@/src/components/InputLegend";
import SelectLegend from "@/src/components/SelectLegend";
import CheckboxLengend from "@/src/components/CheckboxLengend";
import Pagination from "@/src/components/Pagination";
import Loading from "@/src/components/Loading";
import Link from "next/link";
import { NotificateContext } from "@/src/contexts/notificate/notificate";
import BulkDeleteBar from "@/src/components/common/BulkDeleteBar";
import DeleteConfirmModal from "@/src/components/common/DeleteConfirmModal";
import { exportToExcel } from "@/src/utils/excel";
import PasswordResetModal from "@/src/components/modals/PasswordResetModal";

const DEBOUNCE_MS = 500;

const AccountPage = () => {
    const notificate = useContext(NotificateContext);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [users, setUsers] = useState<IUser[]>([]);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });

    const [selectedList, setSelectedList] = useState<string[]>([]);

    const [filters, setFilters] = useState({
        fullName: '',
        username: '',
        email: '',
        roleId: undefined as number | undefined,
        position: '',
        status: undefined as boolean | undefined,
    });

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const userApi = new User();
    const roleApi = new Role();

    const fetchRoles = async () => {
        try {
            const result = await roleApi.getAll();
            if (result.success && result.data) {
                setRoles(result.data.items);
            }
        } catch (error) {
            console.error('Loi khi lay danh sach vai tro:', error);
        }
    };

    const fetchUsers = async (
        page = 1,
        pageSize = pagination.pageSize,
        filterParams = filters,
    ) => {
        setLoading(true);
        try {
            const result = await userApi.getAll({
                page,
                pageSize,
                fullName: filterParams.fullName || undefined,
                username: filterParams.username || undefined,
                email: filterParams.email || undefined,
                roleId: filterParams.roleId,
                position: filterParams.position || undefined,
                status: filterParams.status,
            });

            if (result.success && result.data) {
                const items = result.data.items.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                setUsers(items);
                setPagination(prev => ({
                    ...prev,
                    page,
                    pageSize,
                    total: result.data!.count,
                }));
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchUsers(1);
    }, []);

    const handleFilterChange = (field: string, value: any) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            fetchUsers(1, pagination.pageSize, newFilters);
        }, DEBOUNCE_MS);
    };

    const handleFilterImmediate = (field: string, value: any) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        fetchUsers(1, pagination.pageSize, newFilters);
    };

    const handleStatusChange = (value: string) => {
        const statusValue = value === '' ? undefined : value === 'true';
        handleFilterImmediate('status', statusValue);
    };

    // Update functions
    const handleToggleStatus = async (id: string, status: boolean) => {
        setLoading(true);
        await userApi.ChangeStatus(id, status);
        setLoading(false);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: status } : u));
        notificate?.showNotification({ type: "success", message: "Thay đổi trạng thái thành công" });
    }

    const [stateChangePassword, setStateChangePassword] = useState<{ username: string, id: string }>({ username: "", id: "" });

    const handleDelete = async () => {
        setIsDeleting(true);
        const cls = new User();
        const result = await cls.DeleteUser(selectedList);
        setIsDeleting(false);
        setShowDeleteConfirm(false);

        if (result.success) {
            setUsers(prev => prev.filter(user => !selectedList.includes(user.id)));
            notificate?.showNotification({ type: "success", message: "Xóa danh sách người dùng thành công " });
            setSelectedList([]);
        } else {
            notificate?.showNotification({ type: "error", message: "Xóa danh sách người dùng thất bại " });
        }
    };

    return (
        <main className="h-screen flex flex-col py-2">
            {selectedList && selectedList.length > 0 && (
                <BulkDeleteBar
                    selectedCount={selectedList.length}
                    onClearSelection={() => {
                        setSelectedList([]);
                    }}
                    onDelete={() => {
                        setShowDeleteConfirm(true);
                    }}
                    loading={isDeleting}
                />
            )}

            <DeleteConfirmModal
                open={showDeleteConfirm}
                count={selectedList.length}
                title="Xác nhận xóa người dùng"
                description={
                    selectedList.length === 1
                        ? 'Bạn có chắc chắn muốn xóa người dùng đã chọn?\nDữ liệu sau khi xóa sẽ không thể khôi phục.'
                        : `Bạn có chắc chắn muốn xóa ${selectedList.length} người dùng đã chọn?\nDữ liệu sau khi xóa sẽ không thể khôi phục.`
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    if (!isDeleting) {
                        setShowDeleteConfirm(false);
                    }
                }}
                loading={isDeleting}
            />

            {stateChangePassword.username && stateChangePassword.id && (
                <PasswordResetModal
                    isOpen={!!stateChangePassword.id}
                    onClose={() => {
                        setStateChangePassword({ username: "", id: "" });
                    }}
                    username={stateChangePassword.username}
                    targetName={users.find(u => u.id === stateChangePassword.id)?.fullName || stateChangePassword.username}
                    onConfirm={async (password) => {
                        try {
                            setLoading(true);
                            const result = await userApi.SetPassword(stateChangePassword.id, password);
                            if (result.success) {
                                notificate?.showNotification({ type: "success", message: "Đặt lại mật khẩu thành công" });
                            } else {
                                notificate?.showNotification({ type: "error", message: "Đặt lại mật khẩu thất bại" });
                            }
                        } catch (error: any) {
                            notificate?.showNotification({ type: "error", message: error.message || "Có lỗi xảy ra vui lòng thử lại sau" });
                        } finally {
                            setLoading(false);
                        }
                    }}
                />
            )}

            <TopHero
                title="Danh sách người dùng"
                actions={
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                        >
                            <i className="fa-solid fa-upload text-xs text-primary"></i>
                            <span>Import</span>
                        </button>

                        <Link
                            href={"/accounts/add"}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:opacity-90 transition-opacity"
                        >
                            <i className="fa-solid fa-plus text-xs"></i>
                            <span>Thêm mới</span>
                        </Link>
                    </div>
                }
                className="shrink-0"
            />

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2">
                {/* Header/Filter wrapper */}
                <div className="shrink-0 border-b border-gray-200 px-5 py-3 bg-gray-50/20">
                    <div className="flex font-semibold gap-5 pb-3 text-xs text-gray-500">
                        <div className="flex-1 text-center">Thao tác</div>
                        <div className="flex-3">Họ và tên</div>
                        <div className="flex-2">Tài khoản</div>
                        <div className="flex-2">Email</div>
                        <div className="flex-1">Vai trò</div>
                        <div className="flex-1">Chức danh</div>
                        <div className="flex-1 text-center">Trạng thái</div>
                    </div>

                    {/* Filter */}
                    <div className="flex gap-5">
                        <div className="flex-1"></div>
                        <div className="flex-3">
                            <InputLegend
                                input={{
                                    type: "text",
                                    value: filters.fullName,
                                    onChange: (e) => handleFilterChange('fullName', e.target.value)
                                }}
                                fillWhite={true}
                                isSmall={true}
                            />
                        </div>
                        <div className="flex-2">
                            <InputLegend
                                input={{
                                    type: "text",
                                    value: filters.username,
                                    onChange: (e) => handleFilterChange('username', e.target.value)
                                }}
                                fillWhite={true}
                                isSmall={true}
                            />
                        </div>
                        <div className="flex-2">
                            <InputLegend
                                input={{
                                    type: "text",
                                    value: filters.email,
                                    onChange: (e) => handleFilterChange('email', e.target.value)
                                }}
                                fillWhite={true}
                                isSmall={true}
                            />
                        </div>
                        <div className="flex-1">
                            <SelectLegend
                                select={{
                                    value: filters.roleId || '',
                                    onChange: (e) => handleFilterImmediate('roleId', e.target.value ? Number(e.target.value) : undefined)
                                }}
                                fillWhite={true}
                                isSmall={true}
                            >
                                <option value="">Vai trò</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </SelectLegend>
                        </div>
                        <div className="flex-1">
                            <InputLegend
                                input={{
                                    type: "text",
                                    value: filters.position,
                                    onChange: (e) => handleFilterChange('position', e.target.value)
                                }}
                                fillWhite={true}
                                isSmall={true}
                            />
                        </div>
                        <div className="flex-1">
                            <SelectLegend
                                select={{
                                    value: filters.status === undefined ? '' : filters.status ? 'true' : 'false',
                                    onChange: (e) => handleStatusChange(e.target.value)
                                }}
                                fillWhite={true}
                                isSmall={true}
                            >
                                <option value="">Trạng thái</option>
                                <option value="true">Bật</option>
                                <option value="false">Tắt</option>
                            </SelectLegend>
                        </div>
                    </div>
                </div>

                {/* Danh sách - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0 px-5">
                    {users.length === 0 && !loading && (
                        <div className="py-12 text-center text-gray-400 text-sm">Không có dữ liệu</div>
                    )}
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center gap-5 py-2.5 border-b border-gray-100 hover:bg-blue-50/40 transition-colors text-sm text-gray-700">
                            <div className="flex-1 flex items-center justify-between text-gray-400">
                                <input
                                    type="checkbox"
                                    className="w-3.5 h-3.5 accent-primary cursor-pointer"
                                    checked={selectedList.includes(user.id)}
                                    onChange={(e) => {
                                        setSelectedList(prev =>
                                            e.target.checked
                                                ? [...prev, user.id]
                                                : prev.filter(id => id !== user.id)
                                        )
                                    }}
                                />
                                <Link className="hover:text-primary transition-colors" href={`/accounts/${user.id}`}>
                                    <i className="fa-solid fa-pen text-xs"></i>
                                </Link>
                                <button className="hover:text-primary transition-colors pe-5" onClick={() => setStateChangePassword({ username: user.username, id: user.id })}>
                                    <i className="fa-solid fa-key text-xs"></i>
                                </button>
                            </div>
                            <div className="flex-3 truncate">{user.fullName}</div>
                            <div className="flex-2 truncate">{user.username}</div>
                            <div className="flex-2 truncate">{user.email}</div>
                            <div className="flex-1 truncate">{user.role?.name || '-'}</div>
                            <div className="flex-1 truncate">{user.position || '-'}</div>
                            <div className="flex-1 flex justify-center">
                                <CheckboxLengend isChecked={user.status} checkbox={{}} onChange={() => {
                                    handleToggleStatus(user.id, !user.status)
                                }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer with actions and Pagination */}
                <div className="shrink-0 flex items-center justify-between gap-4 px-5 py-3 border-t border-gray-200 bg-white">
                    <button
                        className="text-sm font-semibold flex gap-2 items-center text-gray-600 hover:text-gray-900 transition-colors"
                        onClick={() => {
                            exportToExcel<any>(users, [
                                { key: "id", label: "Mã" },
                                { key: "fullName", label: "Họ và tên" },
                                { key: "username", label: "Tên đăng nhập" },
                                { key: "email", label: "Email" },
                                { key: "position", label: "Chức vụ" },
                                { key: "role", label: "Vai trò" },
                                { key: "status", label: "Trạng thái" },
                                { key: "createdAt", label: "Ngày tạo" },
                            ], "Account-" + Date.now());
                        }}
                    >
                        <i className="fa-solid fa-download text-xs text-primary"></i>
                        <span>Export Data</span>
                    </button>
                    <Pagination
                        totalCount={pagination.total}
                        pageSize={pagination.pageSize}
                        currentPage={pagination.page}
                        setPageSize={(newSize) => fetchUsers(1, newSize)}
                        setCurrentPage={(newPage) => fetchUsers(newPage, pagination.pageSize)}
                    />
                </div>
            </div>
        </main>
    );
};

export default AccountPage;