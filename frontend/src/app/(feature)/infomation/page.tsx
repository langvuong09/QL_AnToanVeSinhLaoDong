'use client'

import { Jwt } from "@/src/api/types/jwt";
import { ElementAddress, User, UserDetail } from "@/src/api/User";
import ChangeEmail from "@/src/components/ChangeEmail";
import CheckboxLengend from "@/src/components/CheckboxLengend";
import InputLegend from "@/src/components/InputLegend";
import Loading from "@/src/components/Loading";
import SelectLegend from "@/src/components/SelectLegend";
import TopHero from "@/src/components/TopHero";
import Button from "@/src/components/ui/Button";
import { NotificateContext } from "@/src/contexts/notificate/notificate";
import { OpenAdress, Province, Ward } from "@/src/services/open-address";
import { parseAccessToken } from "@/src/utils/jwt-parser";
import { useContext, useEffect, useRef, useState } from "react";

const InfomationPage = () => {
    const notificate = useContext(NotificateContext);

    const [loading, setLoading] = useState<boolean>(false);

    const [jwt, setJwt] = useState<Jwt | null>(null);
    const [currentUser, setCurrentUser] = useState<UserDetail | null>(null);

    const [message, setMessage] = useState<{
        type: "success" | "error",
        des: string
    } | undefined>(undefined);

    const [submitForm, setSubmitForm] = useState<{
        fullName: string;

        dateOfBirth: string;
        gender: string;

        position: string;

        province: ElementAddress;
        ward: ElementAddress;
        address: string;
    }>({
        fullName: "",
        dateOfBirth: "",
        gender: "",

        position: "",

        province: {
            key: 0,
            value: ""
        },
        ward: {
            key: 0,
            value: ""
        },
        address: "",
    });

    const [errorForm, setErrorForm] = useState<{
        fullName: string;
        dateOfBirth: string;
        gender: string;

        position: string,

        province: string;
        ward: string;
        address: string;
    }>({
        fullName: "",
        dateOfBirth: "",
        gender: "",

        position: "",

        province: "",
        ward: "",
        address: "",
    });

    const onSubmit = async () => {
        console.log("Run here")

        const newErrors = {
            fullName: "",
            dateOfBirth: "",
            gender: "",

            position: "",

            province: "",
            ward: "",
            address: "",
        };

        let hasError = false;

        if (!submitForm?.fullName?.trim()) {
            newErrors.fullName = "Họ và tên không được để trống";
            hasError = true;
            console.log("Run here")

        }

        if (!submitForm?.gender) {
            newErrors.gender = "Giới tính không được để trống";
            hasError = true;
            console.log("Run here")

        }

        if (!submitForm?.dateOfBirth) {
            newErrors.dateOfBirth = "Ngày sinh không được để trống";
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
            const cls = new User();
            await cls.UpdateSelfProfile(jwt?.id!, submitForm);
            setLoading(false);
            notificate?.showNotification({ type: "success", message: "Thay đổi thông tin thành công" });
            setMessage({
                type: "success",
                des: "Đã cập nhật thông tin của bạn"
            });

        } catch (error) {
            setLoading(false);
            notificate?.showNotification({ type: "error", message: "Thay đổi thông tin thất bại" });
            setMessage({
                type: "success",
                des: "Cập nhật thông tin thất bại"
            });
        }
    }

    const [isChangeEmail, setIsChangeEmail] = useState<string>("");

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

    // Close dropdowns on outside click
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

    // Get data from jwt
    useEffect(() => {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || "";
        if (token) {
            const jwt = parseAccessToken(token);
            setJwt(jwt);
        }
    }, []);

    const fetchUserDetail = async () => {
        if (jwt) {
            setLoading(true);
            const cls = new User();
            const result = await cls.GetUserDetailById(jwt.id);
            setCurrentUser(result);
            setSubmitForm({
                fullName: result.fullName,
                dateOfBirth: result.dateOfBirth,
                gender: result.gender,
                position: result.position,
                province: result.province,
                ward: result.ward,
                address: result.address
            });
            setLoading(false);
        }
    }

    useEffect(() => {
        if (jwt) {
            fetchUserDetail();
        }
    }, [jwt]);

    return (
        <main className="space-y-10 px-3">
            {loading && (
                <Loading />
            )}

            <ChangeEmail email={currentUser?.email || ""} />
            
            <TopHero
                lable="Chi tiết người dùng"
                component={
                    <div className="flex gap-5 rounded">
                        <Button variant="outline" className="flex gap-3 items-center text-sm font-semibold">
                            <span>Hủy bỏ</span>
                        </Button>
                        <Button variant="primary" className="flex gap-3 items-center text-sm font-semibold" onClick={onSubmit}>
                            <i className="fa-solid fa-floppy-disk"></i>
                            <span>Lưu</span>
                        </Button>
                    </div>
                }
            />

            {message && (
                <div>

                </div>
            )}

            <div className="grid grid-cols-12 gap-5">
                {/* Left card */}
                <div className="col-span-4 bg-white shadow-3drops rounded-lg px-10 py-10 space-y-10 h-fit">
                    <div className="space-y-5">
                        <div className="flex justify-center">
                            <div className="rounded-full p-3 border border-gray-500 border-dashed">
                                <button className="text-gray-500 w-40 h-40 bg-gray-200 rounded-full">
                                    <i className="fa-solid fa-camera-rotate text-2xl"></i>
                                    <p className="text-sm">Tải ảnh đại diện</p>
                                </button>
                            </div>
                        </div>
                        <div className="text-center text-sm text-gray-500">
                            <p>*.jpeg, *.jpg, *.png</p>
                            <p>Kích thước tối đa 5MB</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">Kích hoạt</span>

                        <CheckboxLengend isChecked={currentUser?.status || false} checkbox={{ disabled: true }} />
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
                                    input={{ type: "text", placeholder: "vnagroup", disabled: true }}
                                />
                                <InputLegend
                                    label="Ngày tháng năm sinh"
                                    require={true}
                                    input={{
                                        type: "date",
                                        value: submitForm.dateOfBirth,
                                        onChange: (event) => {
                                            console.log(event.target.value)
                                            setSubmitForm((prev) => ({ ...prev, dateOfBirth: event.target.value }));
                                            setErrorForm((prev) => ({ ...prev, dateOfBirth: "" }));
                                        },
                                    }}
                                    errorMess={errorForm?.dateOfBirth}
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
                                        value: currentUser?.roleId,
                                        onChange: (event) => {
                                            setSubmitForm((prev) => ({ ...prev, roleId: event.target.value }));
                                            setErrorForm((prev) => ({ ...prev, roleId: "" }));
                                        },
                                        disabled: true
                                    }}
                                >
                                    <option value="">Chọn vai trò</option>
                                    {currentUser?.role && (
                                        <option value={currentUser.role.id}>{currentUser.role.name}</option>
                                    )}
                                </SelectLegend>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <InputLegend
                                label="Email"
                                require={true}
                                input={{
                                    type: "email",
                                    placeholder: "Nhập địa chỉ email",
                                    value: currentUser?.email,
                                    disabled: true
                                }}
                            />
                            <div className="flex-1 flex items-center">
                                <button className="text-[15px] font-semibold text-blue-600 w-fit">Thay đổi</button>
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
                                                placeholder: "Tìm tỉnh/thành phố",
                                                value: submitForm.province.value || provinceSearch,
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
            </div>
        </main>
    );
};

export default InfomationPage;