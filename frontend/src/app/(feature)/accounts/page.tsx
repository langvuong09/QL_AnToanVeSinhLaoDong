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
        <main className="flex flex-col min-h-screen">
            {/* {loading && (
                <Loading />
            )} */}

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
                lable="Danh sách người dùng"
                component={
                    <div className="flex gap-5 rounded">
                        <Button variant="outline" className="flex gap-3 items-center text-sm font-semibold">
                            <i className="fa-solid fa-upload"></i>
                            <span>Import</span>
                        </Button>

                        <Link href={"/accounts/add"} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 transition-all rounded text-sm font-semibold text-white">
                            <i className="fa-solid fa-plus"></i>
                            <span>Thêm mới</span>
                        </Link>
                    </div>
                }
            />

            <div className="flex flex-col flex-1 pt-3">
                <div className="flex-1">
                    <div className="bg-[#F4F6F8] px-3 py-2">
                        <div className="flex font-semibold gap-5 pb-3 text-sm">
                            <div className="flex-1"></div>
                            <div className="flex-3">Họ và tên</div>
                            <div className="flex-2">Tài khoản</div>
                            <div className="flex-2">Email</div>
                            <div className="flex-1">Vai trò</div>
                            <div className="flex-1">Chức danh</div>
                            <div className="flex-1">Trạng thái</div>
                        </div>

                        {/* Filter */}
                        <div className="flex gap-5 pb-5">
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

                    {/* Danh sách */}
                    <div className="space-y-2 px-3">
                        {users.length === 0 && (
                            <div className="py-10 text-center text-gray-400 text-sm">Không có dữ liệu</div>
                        )}
                        {users.map((user) => (
                            <div key={user.id} className="flex items-center gap-5 py-2 border-b border-gray-300 text-sm">
                                <div className="flex-1 flex items-center justify-between">
                                    <input type="checkbox" className="w-5 h-5"
                                        checked={selectedList.includes(user.id)}
                                        onChange={(e) => {
                                            setSelectedList(prev =>
                                                e.target.checked
                                                    ? [...prev, user.id]
                                                    : prev.filter(id => id !== user.id)
                                            )
                                        }} />
                                    <Link className="text-gray-500" href={`/accounts/${user.id}`}>
                                        <i className="fa-solid fa-pen"></i>
                                    </Link>
                                    <button className="text-gray-500 pe-5" onClick={() => setStateChangePassword({ username: user.username, id: user.id })}>
                                        <i className="fa-solid fa-key"></i>
                                    </button>
                                </div>
                                <div className="flex-3">{user.fullName}</div>
                                <div className="flex-2">{user.username}</div>
                                <div className="flex-2">{user.email}</div>
                                <div className="flex-1">{user.role?.name || '-'}</div>
                                <div className="flex-1">{user.position || '-'}</div>
                                <div className="flex-1">
                                    <CheckboxLengend isChecked={user.status} checkbox={{}} onChange={() => {
                                        handleToggleStatus(user.id, !user.status)
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex px-2">
                    <button className="text-sm font-semibold flex gap-2 items-center text-gray-800" onClick={() => {
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
                    }}>
                        <i className="fa-solid fa-download"></i>
                        <span>Export Data</span>
                    </button>
                    <div className="flex-1">
                        <Pagination
                            totalCount={pagination.total}
                            pageSize={pagination.pageSize}
                            currentPage={pagination.page}
                            setPageSize={(newSize) => fetchUsers(1, newSize)}
                            setCurrentPage={(newPage) => fetchUsers(newPage, pagination.pageSize)}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AccountPage;