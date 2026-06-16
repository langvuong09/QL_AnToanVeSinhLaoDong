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

const DEBOUNCE_MS = 500;

const AccountPage = () => {
    const notificate = useContext(NotificateContext);

    const [users, setUsers] = useState<IUser[]>([]);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatingStatusIds, setUpdatingStatusIds] = useState<string[]>([]);
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
    const [stateValChangePassword, setStateValChangePassword] = useState<{ password: string, error: string }>({ password: "", error: "" });
    const handleChangePassword = async () => {
        let hasError = false;
        let error = "";
        if (!stateValChangePassword.password) {
            error = "Mật khẩu không được để trống";
            hasError = true;
        } else if (stateValChangePassword.password.length < 8) {
            error = "Mật khẩu phải có ít nhất 8 ký tự";
            hasError = true;
        } else if (!/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(stateValChangePassword.password)) {
            error = "Mật khẩu phải bao gồm: chữ hoa, chữ thường, số hoặc ký tự đặc biệt";
            hasError = true;
        }

        if (hasError) {
            notificate?.showNotification({ type: "error", message: "Vui lòng nhập mật khẩu đúng định dạng " });
            setStateValChangePassword(prev => ({ ...prev, error: error }));
            return;
        }

        try {
            setLoading(true);
            const cls = new User();
            const result = await cls.SetPassword(stateChangePassword.id, stateValChangePassword.password);
            if (result.success) {
                notificate?.showNotification({ type: "success", message: "Đổi mật khẩu thành công" });
                setStateChangePassword({ username: "", id: "" });
                setStateValChangePassword({ password: "", error: "" });
            } else {
                notificate?.showNotification({ type: "error", message: "Đổi mật khẩu thất bại " });
            }
        } catch (error: any) {
            notificate?.showNotification({ type: "error", message: error.message || "Có lỗi xảy ra vui lòng thử lại sau" });
        } finally {
            setLoading(false);
        }

    }

    return (
        <main className="flex flex-col min-h-screen">
            {loading && (
                <Loading />
            )}

            {selectedList && selectedList.length > 0 && (
                <BulkDeleteBar
                    selectedCount={selectedList.length}
                    onClearSelection={() => {
                        console.log("hhee")
                        setSelectedList([]);
                    }}
                    onDelete={async () => {
                        const cls = new User();
                        const result = await cls.DeleteUser(selectedList);
                        if (result.success) {
                            setUsers(prev => prev.filter(user => {
                                if (!selectedList.includes(user.id)) {
                                    return user;
                                }
                            }))
                            notificate?.showNotification({ type: "success", message: "Xóa danh sách người dùng thành công " });
                            setSelectedList([]);
                        } else {
                            notificate?.showNotification({ type: "error", message: "Xóa danh sách người dùng thất bại " });
                        }
                    }}

                />
            )}

            {stateChangePassword.username && stateChangePassword.id && (
                <div className="fixed top-0 left-0 w-full h-screen bg-gray-800/50 z-50 flex items-center justify-center">
                    <div className="bg-white w-md rounded overflow-hidden">
                        <div className="bg-blue-600 py-2 text-xl font-semibold text-white text-center">
                            <h1>Xác nhận</h1>
                        </div>
                        <div className="px-5 py-4 space-y-5">
                            <div className="text-[16px]">
                                <p>
                                    Khởi tạo mật khẩu cho tài khoản
                                    <strong>{" "}{stateChangePassword.username}</strong>
                                </p>
                            </div>

                            <div className="">
                                <InputLegend
                                    label="Mật khẩu"
                                    require={true}
                                    input={{
                                        type: "password",
                                        placeholder: "Nhập mật khẩu khởi tạo mong muốn",
                                        value: stateValChangePassword.password,
                                        onChange: (event) => {
                                            setStateValChangePassword({ password: event.target.value, error: "" });
                                        }
                                    }}
                                    errorMess={stateValChangePassword.error}
                                />
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button className="text-blue-600 font-semibold" onClick={() => {
                                    setStateChangePassword({ username: "", id: "" });
                                    setStateValChangePassword({ password: "", error: "" });
                                }}>Hủy bỏ</button>
                                <button className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2 text-white" onClick={handleChangePassword}>
                                    <i className="fa-solid fa-floppy-disk"></i>
                                    <span>Lưu</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
                                        placeholder: "Tìm theo họ tên",
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
                                        placeholder: "Tìm theo tài khoản",
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
                                        placeholder: "Tìm theo email",
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
                                        placeholder: "Tìm theo chức danh",
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

                <Pagination
                    totalCount={pagination.total}
                    pageSize={pagination.pageSize}
                    currentPage={pagination.page}
                    setPageSize={(newSize) => fetchUsers(1, newSize)}
                    setCurrentPage={(newPage) => fetchUsers(newPage, pagination.pageSize)}
                />
            </div>
        </main>
    );
};

export default AccountPage;