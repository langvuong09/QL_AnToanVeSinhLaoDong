'use client'

import { Media } from "@/src/api/Media";
import { IRole, Role } from "@/src/api/Role";
import { ElementAddress, User } from "@/src/api/User";
import CheckboxLengend from "@/src/components/CheckboxLengend";
import DateLengend from "@/src/components/DateLengend";
import InputLegend from "@/src/components/InputLegend";
import Loading from "@/src/components/Loading";
import SelectLegend from "@/src/components/SelectLegend";
import TopHero from "@/src/components/TopHero";
import Button from "@/src/components/ui/Button";
import { NotificateContext } from "@/src/contexts/notificate/notificate";
import { OpenAdress, Province, Ward } from "@/src/services/open-address";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

const AccountAddPage = () => {
    const notificate = useContext(NotificateContext);
    const router = useRouter();
    const [roles, setRoles] = useState<IRole[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchRoles = async () => {
        setLoading(true);
        const rcls = new Role();
        const rresult = await rcls.getAll();
        if (rresult.success && rresult.data) {
            setRoles(rresult.data.items);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchRoles();
    }, []);

    const [submitForm, setSubmitForm] = useState<{
        username: string;
        fullName: string;
        gender: string;
        roleId: number;

        password: string;
        dateOfBirth: string;
        position: string;
        email: string;

        province: ElementAddress;
        ward: ElementAddress;
        address: string;

        avatarId?: string;
        status: boolean;
    }>({
        username: "",
        fullName: "",
        gender: "",
        roleId: 0,

        password: "User@123456",
        dateOfBirth: "",
        position: "",
        email: "",

        province: {
            key: 0,
            value: ""
        },
        ward: {
            key: 0,
            value: ""
        },
        address: "",

        status: true
    });

    const [errorForm, setErrorForm] = useState<{
        username: string;
        fullName: string;
        gender: string;
        roleId: string;

        password: string;
        dateOfBirth: string;
        position: string;
        email: string;

        province: string;
        ward: string;
        address: string;
    }>({
        username: "",
        fullName: "",
        gender: "",
        roleId: "",

        password: "",
        dateOfBirth: "",
        position: "",
        email: "",

        province: "",
        ward: "",
        address: "",
    });

    const onSubmit = async () => {
        if (loading) return;
        const newErrors = {
            username: "",
            fullName: "",
            gender: "",
            roleId: "",

            password: "",
            dateOfBirth: "",
            position: "",
            email: "",

            province: "",
            ward: "",
            address: ""
        };

        let hasError = false;

        if (!submitForm.username?.trim()) {
            newErrors.username = "Tên đăng nhập không được để trống";
            hasError = true;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(submitForm.username)) {
            newErrors.username =
                "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới (_)";
            hasError = true;
        }

        if (submitForm.username.length < 6) {
            newErrors.username = "Tên đăng nhập ít nhất 6 kí tự";
            hasError = true;
        }

        if (!submitForm.fullName?.trim()) {
            newErrors.fullName = "Họ và tên không được để trống";
            hasError = true;
        }

        if (!submitForm.email?.trim()) {
            newErrors.email = "Email không được để trống";
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitForm.email)) {
            newErrors.email = "Email không đúng định dạng";
            hasError = true;
        }

        if (!submitForm.password) {
            newErrors.password = "Mật khẩu không được để trống";
            hasError = true;
        } else if (submitForm.password.length < 8) {
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
            hasError = true;
        } else if (!/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(submitForm.password)) {
            newErrors.password = "Mật khẩu phải bao gồm: chữ hoa, chữ thường, số hoặc ký tự đặc biệt";
            hasError = true;
        }

        if (!submitForm.gender) {
            newErrors.gender = "Giới tính không được để trống";
            hasError = true;
        }

        if (!submitForm.roleId) {
            newErrors.roleId = "Vai trò không được để trống";
            hasError = true;
        }

        if (!submitForm.position?.trim()) {
            newErrors.position = "Chức danh không được để trống";
            hasError = true;
        }

        if (!submitForm.dateOfBirth) {
            newErrors.dateOfBirth = "Ngày sinh không được để trống";
            hasError = true;
        } else {
            const date = new Date(submitForm.dateOfBirth);
            const today = new Date();
            if (date > today) {
                newErrors.dateOfBirth = "Ngày sinh phải nhỏ hơn hiện tại";
                hasError = true;
            }
        }

        if (!submitForm.province?.key || !submitForm.province?.value.trim()) {
            newErrors.province = "Tỉnh/Thành phố không được để trống";
            hasError = true;
        }

        if (!submitForm.ward?.key || !submitForm.ward?.value.trim()) {
            newErrors.ward = "Phường/Xã không được để trống";
            hasError = true;
        }

        if (!submitForm.address.trim()) {
            newErrors.address = "Địa chỉ không được để trống";
            hasError = true;
        }

        if (hasError) {
            setErrorForm(newErrors);
            notificate?.showNotification({ type: "error", message: "Vui lòng điền đầy đủ thông tin" });
            return;
        }

        setErrorForm(newErrors);

        try {
            setLoading(true);
            if (fileAvatar) {
                const mcls = new Media();
                const formData = new FormData();
                formData.append('file', fileAvatar);
                formData.append('fileType', "AVATAR");

                const result = await mcls.UploadImage(formData);
                if (result && result.data) {
                    submitForm.avatarId = result.data.id;
                }
            }
            const ucls = new User();
            const result = await ucls.CreateUser(submitForm);
            if (result.success) {
                notificate?.showNotification({ type: "success", message: "Tạo người dùng mới thành công" });
                setTimeout(() => router.push("/accounts"), 200);
            } else {
                notificate?.showNotification({ type: "error", message: result.message || "Tạo người dùng mới thất bại" });
            }
            setLoading(false);


        } catch (error) {
            notificate?.showNotification({ type: "error", message: "Có lỗi xảy ra vui lòng thử lại sau" });
            setLoading(false);
        }
    }

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [provinceCodeSelected, setProvinceCodeSelected] = useState<number | undefined>();

    // --- Province search state ---
    const [provinceSearch, setProvinceSearch] = useState("");
    const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
    const provinceRef = useRef<HTMLDivElement>(null);

    // --- Ward search state ---
    const [wardSearch, setWardSearch] = useState("");
    const [showWardDropdown, setShowWardDropdown] = useState(false);
    const wardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const openAddress = new OpenAdress();
        setProvinces(openAddress.provinces);
    }, []);

    useEffect(() => {
        if (!provinceCodeSelected) return;
        const openAddress = new OpenAdress();
        setWards(openAddress.filterWards(provinceCodeSelected));
    }, [provinceCodeSelected]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) {
                setShowProvinceDropdown(false);
            }
            if (wardRef.current && !wardRef.current.contains(e.target as Node)) {
                setShowWardDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredProvinces = provinces.filter((p) =>
        p.name.toLowerCase().includes(provinceSearch.toLowerCase())
    );

    const filteredWards = wards.filter((w) =>
        w.name.toLowerCase().includes(wardSearch.toLowerCase())
    );

    const handleSelectProvince = (province: Province) => {
        setProvinceCodeSelected(province.code);
        setSubmitForm((prev) => ({ ...prev, province: { key: province.code, value: province.name }, ward: { key: 0, value: "" } }));
        setErrorForm((prev) => ({ ...prev, province: "" }));
        setProvinceSearch(province.name);
        setShowProvinceDropdown(false);
        // reset ward
        setWardSearch("");
    };

    const handleSelectWard = (ward: Ward) => {
        setSubmitForm((prev) => ({ ...prev, ward: { key: ward.code, value: ward.name } }));
        setErrorForm((prev) => ({ ...prev, ward: "" }));
        setWardSearch(ward.name);
        setShowWardDropdown(false);
    };

    // ---------- Handle upload avatar ----------
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileAvatar, setFileAvater] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const handleOpenFilePicker = () => {
        inputRef.current?.click();
    }

    const handleChanegFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            notificate?.showNotification({ type: "error", message: "Chi chấp nhập file là hình ảnh" });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            notificate?.showNotification({ type: "error", message: "Kích thước tối đa 5MB" });
            return;
        }

        setFileAvater(file);
        const object = URL.createObjectURL(file);
        setImagePreview(object);
    }

    return (
        <main className="h-screen flex flex-col py-2">
            {loading && (
                <Loading />
            )}

            <TopHero
                title="Thêm người dùng mới"
                actions={
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => router.push("/accounts")}
                            className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center gap-2"
                        >
                            <i className="fa-solid fa-floppy-disk text-xs"></i>
                            <span>Lưu</span>
                        </button>
                    </div>
                }
                className="shrink-0"
            />

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2">
                <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0">
                    <div className="grid grid-cols-12 gap-5">
                        {/* Left card */}
                        <div className="col-span-4 border border-gray-100 rounded-lg px-8 py-8 space-y-8 bg-gray-50/20 h-fit">
                    <div className="space-y-5">
                        <div className="flex justify-center">
                            <div className="rounded-full p-3 border border-gray-500 border-dashed">
                                <button className="text-gray-500 w-40 h-40 bg-gray-200 rounded-full overflow-hidden" onClick={handleOpenFilePicker}>
                                    {imagePreview ? (
                                        <img className="w-full h-full object-cover" src={imagePreview} alt="" />
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-camera-rotate text-2xl"></i>
                                            <p className="text-sm">Tải ảnh đại diện</p>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="text-center text-sm text-gray-500">
                            <p>*.jpeg, *.jpg, *.png</p>
                            <p>Kích thước tối đa 5MB</p>
                        </div>

                        {/* Hidden */}
                        <input type="file" className="hidden" ref={inputRef} onChange={handleChanegFile} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">Kích hoạt</span>

                        <CheckboxLengend
                            isChecked={submitForm.status}
                            checkbox={{}}
                            onChange={() => {
                                setSubmitForm(prev => ({ ...prev, status: !prev.status }))
                            }}
                        />
                    </div>
                </div>

                {/* Right card */}
                <div className="col-span-8 border border-gray-100 rounded-lg">
                    {/* Personal info */}
                    <div className="px-4 py-4 space-y-5">
                        <h1 className="text-[16px] font-semibold">Thông tin cá nhân</h1>
                        <div className="flex gap-5">
                            <div className="flex-1 flex flex-col gap-5">
                                <InputLegend
                                    label="Tên đăng nhập"
                                    require={true}
                                    input={{
                                        type: "text",
                                        value: submitForm.username,
                                        onChange: (event) => {
                                            setSubmitForm((prev) => ({ ...prev, username: event.target.value }));
                                            setErrorForm((prev) => ({ ...prev, username: "" }));
                                        }
                                    }}
                                    errorMess={errorForm.username}
                                />

                                <InputLegend
                                    label="Họ và tên"
                                    require={true}
                                    input={{
                                        type: "text",
                                        value: submitForm.fullName,
                                        onChange: (event) => {
                                            setSubmitForm((prev) => ({ ...prev, fullName: event.target.value }));
                                            setErrorForm((prev) => ({ ...prev, fullName: "" }));
                                        },
                                    }}
                                    errorMess={errorForm?.fullName}
                                />

                                <SelectLegend
                                    label="Giới tính"
                                    require={true}
                                    select={{
                                        value: submitForm.gender,
                                        onChange: (event) => {
                                            setSubmitForm((prev) => ({ ...prev, gender: event.target.value }));
                                            setErrorForm((prev) => ({ ...prev, gender: "" }));
                                        },
                                    }}
                                    errorMess={errorForm.gender}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                </SelectLegend>

                                <SelectLegend
                                    label="Vai trò"
                                    require={true}
                                    select={{
                                        value: submitForm?.roleId,
                                        onChange: (event) => {
                                            setSubmitForm((prev) => ({ ...prev, roleId: Number(event.target.value) }));
                                            setErrorForm((prev) => ({ ...prev, roleId: "" }));
                                        },
                                    }}
                                    errorMess={errorForm.roleId}
                                >
                                    <option value="">Chọn vai trò</option>
                                    {roles && roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </SelectLegend>
                            </div>
                            <div className="flex-1 flex flex-col gap-5">
                                <InputLegend
                                    label="Mật khẩu"
                                    require={true}
                                    input={{
                                        type: "password",
                                        value: submitForm.password,
                                        onChange: (event) => {
                                            setSubmitForm((prev) => ({ ...prev, password: event.target.value }));
                                            setErrorForm((prev) => ({ ...prev, password: "" }));
                                        },
                                    }}
                                    errorMess={errorForm?.password}
                                />

                                <DateLengend
                                    label="Ngày tháng năm sinh"
                                    require={true}
                                    value={submitForm.dateOfBirth}
                                    maxDate="today"
                                    onChange={(val) => {
                                        setSubmitForm((prev) => ({ ...prev, dateOfBirth: val }));
                                        setErrorForm((prev) => ({ ...prev, dateOfBirth: "" }));
                                    }}
                                    errorMess={errorForm?.dateOfBirth}
                                    errorInput="Dữ liệu truyền vào không hợp lệ"
                                />

                                <InputLegend
                                    label="Chức danh"
                                    require={true}
                                    input={{
                                        type: "text",
                                        value: submitForm.position,
                                        onChange: (event) => {
                                            setSubmitForm((prev) => ({ ...prev, position: event.target.value }));
                                            setErrorForm((prev) => ({ ...prev, position: "" }));
                                        },
                                    }}
                                    errorMess={errorForm.position}
                                />

                                <InputLegend
                                    label="Email"
                                    require={true}
                                    input={{
                                        type: "email",
                                        value: submitForm.email,
                                        onChange: (event) => {
                                            setSubmitForm((prev) => ({ ...prev, email: event.target.value }));
                                            setErrorForm((prev) => ({ ...prev, email: "" }));
                                        },
                                    }}
                                    errorMess={errorForm.email}
                                />

                            </div>
                        </div>

                    </div>

                    <div className="px-4">
                        <hr className="border-gray-300" />
                    </div>

                    {/* Contact info */}
                    <div className="px-4 py-4 space-y-5">
                        <h1 className="text-[16px] font-semibold">Thông tin liên hệ</h1>
                        <div className="space-y-5">
                            <div className="flex gap-5">
                                <div className="flex-1" ref={provinceRef}>
                                    <div className="relative">
                                        <InputLegend
                                            label="Tỉnh/Thành phố"
                                            require={true}
                                            input={{
                                                type: "text",
                                                value: provinceSearch,
                                                onChange: (event) => {
                                                    setProvinceSearch(event.target.value);
                                                    setShowProvinceDropdown(true);

                                                    if (!event.target.value) {
                                                        setSubmitForm((prev) => ({
                                                            ...prev,
                                                            province: { key: Number(event.target.value), value: event.target.textContent },
                                                            ward: { key: 0, value: "" }
                                                        }));
                                                        setProvinceCodeSelected(undefined);
                                                        setWards([]);
                                                        setWardSearch("");
                                                    }
                                                },
                                                onFocus: () => {
                                                    setShowProvinceDropdown(true)
                                                }
                                            }}
                                            errorMess={errorForm.province}
                                        />

                                        {/* Dropdown list */}
                                        {showProvinceDropdown && filteredProvinces.length > 0 && (
                                            <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto text-sm">
                                                {filteredProvinces.map((province) => (
                                                    <li
                                                        key={province.code}
                                                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                                                        onMouseDown={() => handleSelectProvince(province)}
                                                    >
                                                        {province.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {showProvinceDropdown && provinceSearch && filteredProvinces.length === 0 && (
                                            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-sm text-gray-400">
                                                Không tìm thấy kết quả
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1" ref={wardRef}>
                                    <div className="relative">
                                        <InputLegend
                                            label="Phường xã"
                                            require={true}
                                            input={{
                                                type: "text",
                                                value: submitForm.ward.value || wardSearch,
                                                onChange: (event) => {
                                                    setWardSearch(event.target.value);
                                                    setShowWardDropdown(true);

                                                    if (!event.target.value) {
                                                        setSubmitForm((prev) => ({ ...prev, ward: { key: Number(event.target.value), value: event.target.textContent } }));
                                                    }
                                                },
                                                onFocus: () => {
                                                    if (provinceCodeSelected) setShowWardDropdown(true);
                                                }
                                            }}
                                            errorMess={errorForm.ward}
                                        />

                                        {showWardDropdown && filteredWards.length > 0 && (
                                            <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto text-sm">
                                                {filteredWards.map((ward) => (
                                                    <li
                                                        key={ward.code}
                                                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                                                        onMouseDown={() => handleSelectWard(ward)}
                                                    >
                                                        {ward.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {showWardDropdown && wardSearch && filteredWards.length === 0 && (
                                            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-sm text-gray-400">
                                                Không tìm thấy kết quả
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <InputLegend
                                label="Địa chỉ"
                                require={true}
                                input={{
                                    type: "text",
                                    value: submitForm.address,
                                    onChange: (event) => {
                                        setSubmitForm((prev) => ({ ...prev, address: event.target.value }));
                                        setErrorForm((prev) => ({ ...prev, address: "" }));
                                    },
                                }}
                                errorMess={errorForm?.address}
                            />
                        </div>
                    </div>
                </div>
            </div >
        </div>
    </div>
</main>
    );
};

export default AccountAddPage;