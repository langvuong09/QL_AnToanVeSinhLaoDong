'use client'

import { Media } from "@/src/api/Media";
import { IRole, Role } from "@/src/api/Role";
import { Jwt } from "@/src/api/types/jwt";
import { UserDetail } from "@/src/api/types/user";
import { ElementAddress, User } from "@/src/api/User";
import ChangeEmail from "@/src/components/ChangeEmail";
import CheckboxLengend from "@/src/components/CheckboxLengend";
import DateLengend from "@/src/components/DateLengend";
import InputLegend from "@/src/components/InputLegend";
import Loading from "@/src/components/Loading";
import SelectLegend from "@/src/components/SelectLegend";
import TopHero from "@/src/components/TopHero";
import Button from "@/src/components/ui/Button";
import { NotificateContext } from "@/src/contexts/notificate/notificate";
import { OpenAdress, Province, Ward } from "@/src/services/open-address";
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from "react";

const AccountIdPage = () => {
    const { id } = useParams();
    const router = useRouter();

    if (!id) {
        router.replace("/accounts");
    }

    const notificate = useContext(NotificateContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UserDetail | null>(null);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // ---------- Handle fetch current state ----------
    const fetchUserDetail = async (id: string) => {
        try {
            setLoading(true);
            const ucls = new User();
            const rcls = new Role();

            const uresult = await ucls.GetUserDetailById(id);
            const rresult = await rcls.getAll();

            if (rresult.success && rresult.data) {
                setRoles(rresult.data.items);
            }

            var province, ward = null;

            setCurrentUser(uresult);
            setSubmitForm({
                fullName: uresult.fullName || "",
                gender: uresult.gender || "",
                roleId: uresult.roleId,

                dateOfBirth: uresult.dateOfBirth || "",
                position: uresult.position || "",
                email: uresult.email || "",

                province: uresult.province || { key: 0, value: "" },
                ward: uresult.ward || { key: 0, value: "" },
                address: uresult.address || "",

                status: uresult.status
            });

            province = uresult.province;
            ward = uresult.ward;

            if (province) {
                setProvinceSearch(province.value)
            } else {
                setProvinceSearch("");
            }

            if (ward) {
                setWardSearch(ward.value);
            } else {
                setWardSearch("");
            }

            if (uresult.avatar) {
                setImagePreview(uresult.avatar.url);
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setCurrentUser(null);
            setErrorMessage(error.message || "Lỗi không xác định. Vui lòng thử lại sau ít phút." as string);
        }
    }

    useEffect(() => {
        if (id) {
            fetchUserDetail(id as string);
        }
    }, [id]);

    // Start decalare state
    const [submitForm, setSubmitForm] = useState<{
        fullName: string;
        gender: string;
        roleId: number;

        dateOfBirth: string;
        position: string;
        email: string;

        province: ElementAddress;
        ward: ElementAddress;
        address: string;

        status: boolean;

        avatarId?: string;

    }>({
        fullName: "",
        gender: "",
        roleId: 0,

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

        status: false
    });

    const [errorForm, setErrorForm] = useState<{
        fullName: string;
        gender: string;
        roleId: string;

        dateOfBirth: string;
        position: string,
        email: string,

        province: string;
        ward: string;
        address: string;
    }>({
        fullName: "",
        gender: "",
        roleId: "",

        dateOfBirth: "",
        position: "",
        email: "",

        province: "",
        ward: "",
        address: "",
    });

    const onSubmit = async () => {
        const newErrors = {
            fullName: "",
            gender: "",
            roleId: "",

            dateOfBirth: "",
            position: "",
            email: "",

            province: "",
            ward: "",
            address: "",
        }

        let hasError = false;

        if (!submitForm?.fullName?.trim()) {
            newErrors.fullName = "Họ và tên không được để trống";
            hasError = true;
        }

        if (!submitForm?.gender) {
            newErrors.gender = "Giới tính không được để trống";
            hasError = true;
        }

        if (!submitForm?.roleId) {
            newErrors.roleId = "Quyền không được để trống";
            hasError = true;
        }

        if (!submitForm?.dateOfBirth) {
            newErrors.dateOfBirth = "Ngày sinh không được để trống";
            hasError = true;
        }

        if (submitForm.dateOfBirth) {
            const date = new Date(submitForm.dateOfBirth);
            const today = new Date();

            if (date > today) {
                newErrors.dateOfBirth = "Ngày sinh phải nhỏ hơn hiện tại";
                hasError = true;
            }
        }

        if (!submitForm.email?.trim()) {
            newErrors.email = "Email không được để trống";
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitForm.email)) {
            newErrors.email = "Email không đúng định dạng";
            hasError = true;
        }

        if (!submitForm?.province?.key || !submitForm?.province?.value.trim()) {
            newErrors.province = "Tỉnh/Thành phố không được để trống";
            hasError = true;
        }

        if (!submitForm?.ward?.key || !submitForm?.ward?.value.trim()) {
            newErrors.ward = "Phường/Xã không được để trống";
            hasError = true;
        }

        if (!submitForm?.address?.trim()) {
            newErrors.address = "Địa chỉ không được để trống";
            hasError = true;
        }

        if (hasError) {
            setErrorForm(newErrors);
            notificate?.showNotification({ type: "error", message: "Vui lòng điền đầy đủ thông tin" });
            return;
        }

        setErrorForm(newErrors);
        console.log("Form submitted successfully:", submitForm);

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
                    setFileAvater(null);
                }
            }

            const ucls = new User();
            const result = await ucls.UpdateSelfProfile(id as string, submitForm);
            if (result.success) {
                notificate?.showNotification({ type: "success", message: "Thay đổi thông tin thành công" });
            } else {
                notificate?.showNotification({ type: "error", message: "Dữ liệu đã có trên hệ thống" });
                setErrorMessage(result.message || "");
                setTimeout(() => {
                    setErrorMessage("");
                }, 2000);
            }
            setLoading(false);

        } catch (error) {
            setLoading(false);
            notificate?.showNotification({ type: "error", message: "Thay đổi thông tin thất bại" });
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
        <main className="space-y-10 px-3">
            {/* {loading && (
                <Loading />
            )} */}

            <TopHero
                lable="Chi tiết người dùng"
                component={
                    <div className="flex gap-5 rounded">
                        <Button variant="outline" className="flex gap-3 items-center text-sm font-semibold" onClick={() => router.push("/accounts")}>
                            <span>Hủy bỏ</span>
                        </Button>
                        <Button variant="primary" className="flex gap-3 items-center text-sm font-semibold" onClick={onSubmit}>
                            <i className="fa-solid fa-floppy-disk"></i>
                            <span>Lưu</span>
                        </Button>
                    </div>
                }
            />

            {errorMessage && (
                <div className="bg-red-100 px-3 py-2 rounded text-red-500 flex items-center gap-5 font-semibold text-sm">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-12 gap-5">
                {/* Left card */}
                <div className="col-span-4 bg-white shadow-3drops rounded-lg px-10 py-10 space-y-10 h-fit">
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
                <div className="col-span-8 bg-white shadow-3drops rounded-lg">
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
                                        placeholder: "vnagroup",
                                        value: currentUser?.username,
                                        disabled: true,
                                    }}
                                />

                                <DateLengend
                                    label="Ngày tháng năm sinh"
                                    require={true}
                                    value={submitForm.dateOfBirth}
                                    onChange={(val) => {
                                        setSubmitForm((prev) => ({ ...prev, dateOfBirth: val }));
                                        setErrorForm((prev) => ({ ...prev, dateOfBirth: "" }));
                                    }}
                                    errorMess={errorForm.dateOfBirth}
                                    errorInput="Dữ liệu truyền vào không hợp lệ"
                                />

                                <InputLegend
                                    label="Chức danh"
                                    input={{
                                        type: "text",
                                        placeholder: "Nhập chức danh",
                                        value: submitForm.position,
                                        onChange: (event) => {
                                            setSubmitForm((prev) => ({ ...prev, position: event.target.value }));
                                        },
                                    }}
                                />

                            </div>

                            <div className="flex-1 flex flex-col gap-5">
                                <InputLegend
                                    label="Họ và tên (*)"
                                    require={true}
                                    input={{
                                        type: "text",
                                        placeholder: "Nhập họ và tên",
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
                        </div>
                        <div className="flex gap-5">
                            <div className="flex-1">
                                <InputLegend
                                    label="Email"
                                    require={true}
                                    input={{
                                        type: "email",
                                        placeholder: "Nhập địa chỉ email",
                                        value: submitForm.email,
                                        onChange: (event) => {
                                            setSubmitForm((prev) => ({ ...prev, email: event.target.value }));
                                            setErrorForm((prev) => ({ ...prev, email: "" }));
                                        }
                                    }}
                                    errorMess={errorForm.email}
                                />
                            </div>
                            <div className="flex-1"></div>
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
                                                placeholder: "Tìm tỉnh/thành phố",
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
                                                placeholder: "Tìm phường xã",
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
                                    placeholder: "Địa chỉ nơi ở",
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
        </main >
    );
};

export default AccountIdPage;