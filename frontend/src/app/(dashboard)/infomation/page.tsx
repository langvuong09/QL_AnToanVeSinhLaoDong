import InputLegend from "@/src/components/InputLegend";
import SelectLegend from "@/src/components/SelectLegend";
import TopHero from "@/src/components/TopHero";
import Button from "@/src/components/ui/Button";

const InfomationPage = () => {
    return (
        <main className="space-y-10 px-3">
            <TopHero
                lable="Chi tiết người dùng"
                component={
                    <div className="flex gap-5 rounded">
                        <Button variant="outline" className="flex gap-3 items-center text-sm font-semibold">
                            <span>Hủy bỏ</span>
                        </Button>
                        <Button variant="primary" className="flex gap-3 items-center text-sm font-semibold">
                            <i className="fa-solid fa-floppy-disk"></i>
                            <span>Lưu</span>
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-12 gap-5">
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
                    <div className="flex items-center">
                        <span className="font-semibold">Kích hoạt</span>
                    </div>
                </div>
                <div className="col-span-8 space-y-5 bg-white shadow-3drops rounded-lg">
                    <div className="px-4 py-4 space-y-5">
                        <h1 className="text-[16px] font-semibold">Thông tin cá nhân</h1>
                        <div className="flex gap-5">
                            <div className="flex-1 flex flex-col gap-5">
                                <InputLegend
                                    label="Tên đăng nhập (*)"
                                    input={{
                                        type: "text"
                                    }} />

                                <InputLegend
                                    label="Ngày tháng năm sinh"
                                    input={{
                                        type: "date"
                                    }} />

                                <InputLegend
                                    input={{
                                        type: "text",
                                        placeholder: "Chức danh"
                                    }} />

                                <InputLegend
                                    input={{
                                        type: "text",
                                        placeholder: "email@example.com"
                                    }} />
                            </div>
                            <div className="flex-1 flex flex-col gap-5">
                                <InputLegend
                                    label="Họ và tên (*)"
                                    input={{
                                        type: "text",
                                        placeholder: "Nguyễn Văn Nam"
                                    }} />

                                <SelectLegend
                                    select={{}}
                                    children={(
                                        <>
                                            <option value="">Giới tính</option>
                                            <option value="male">Nam</option>
                                            <option value="famle">Nữ</option>
                                        </>
                                    )}
                                />

                                <SelectLegend
                                    label="Vai trò"
                                    select={{}}
                                    children={(
                                        <>
                                            <option value="">Vai trò</option>
                                        </>
                                    )}
                                />

                                <div className="w-full h-full flex items-center">
                                    <button className="text-[15px] font-semibold text-blue-600 w-fit">Thay đổi</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="px-4">
                        <hr className="border-gray-300" />
                    </div>

                    <div className="px-4 py-4 space-y-5">
                        <h1 className="text-[16px] font-semibold">Thông tin liên hệ</h1>
                        <div className="space-y-5">
                            <div className="flex gap-5">
                                <div className="flex-1 flex flex-col gap-5">
                                    <InputLegend
                                        label="Tỉnh/Thành phố"
                                        input={{
                                            type: "text",
                                            placeholder: "Điền tỉnh thành nơi ở"
                                        }} />
                                </div>
                                <div className="flex-1 flex flex-col gap-5">
                                    <InputLegend
                                        label="Phường ngõ"
                                        input={{
                                            type: "text",
                                            placeholder: "Phường ngõ nơi ở"
                                        }} />
                                </div>
                            </div>

                            <InputLegend
                                label="Địa chỉ"
                                input={{
                                    type: "text",
                                    placeholder: "Địa chỉ nơi ở"
                                }} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default InfomationPage;