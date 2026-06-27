import { useReactToPrint } from "react-to-print";
import { SubmitForm } from "../_types/type";
import { useRef } from "react";

type ViewReportProps = {
    submitForm: SubmitForm;
    report: Record<string, any[]>;

    onClose: () => void;
}

const ViewReport = ({ submitForm, report, onClose }: ViewReportProps) => {
    const reportRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: reportRef,
        documentTitle: "BaoCaoTNLD",
    });

    return (
        <main className="bg-white w-7xl px-3 py-5 space-y-5 overflow-y-auto rounded"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
            <div className="flex items-center justify-end gap-3 font-sans text-sm">
                <button className="flex items-center gap-1 text-red-600 font-semibold bg-red-50 ring-1 ring-red-600 px-3 py-1 rounded hover:ring-2 hover:bg-red-100 transition-all" onClick={() => {
                    onClose();
                }}>
                    <i className="fa-solid fa-rectangle-xmark"></i>
                    <span>Đóng</span>
                </button>
                <button className="flex items-center gap-1 text-green-600 font-semibold bg-green-50 ring-1 ring-green-600 px-3 py-1 rounded hover:ring-2 hover:bg-green-100 transition-all" onClick={handlePrint}>
                    <i className="fa-solid fa-print"></i>
                    <span>In báo cáo</span>
                </button>
            </div>

            <div className="space-y-5 px-8 py-10" ref={reportRef}>
                <div className="text-center">
                    <h1 className="font-semibold">PHỤ LỤC XII</h1>
                    <p className="">MẪU BÁO CÁO TỔNG HỢP TÌNH HÌNH TAI NẠN LAO ĐỘNG CẤP CƠ SỞ (6 THÁNG HOẶC CẢ NĂM)</p>
                    <p className="italic">(Kèm theo Nghị định số 39/2016/NĐ-CP ngày 15 tháng 5 năm 2016 của Chính phủ)</p>
                </div>

                <div>
                    <p>Đơn vị báo cáo:</p>
                    <div className="flex items-center gap-10">
                        <div className="flex flex-1">
                            <p className="flex-1">Địa chỉ:</p>
                            <p className="flex-1 ps-31">Mã huyện, quận:</p>
                        </div>

                        <div className="flex flex-1">
                            <div className="w-10 h-10 border"></div>
                            <div className="w-10 h-10 border border-l-0"></div>
                            <div className="w-10 h-10 border border-l-0"></div>
                            <div className="w-10 h-10 border border-l-0"></div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="font-semibold">BÁO CÁO TỔNG HỢP TÌNH HÌNH TAI NẠN LAO ĐỘNG</h1>
                    <p className="font-semibold">Kỳ báo cáo (6 tháng hoặc cả năm) ............. năm ............. </p>
                    <p className="">Ngày báo cáo: .........................</p>
                </div>

                <div className="flex items-center gap-10">
                    <span className="flex-1">Thuộc loại hình cơ sở (doanh nghiệp): .......................... Mã loại hình cơ sở:</span>
                    <div className="flex flex-1">
                        <div className="w-10 h-10 border"></div>
                        <div className="w-10 h-10 border border-l-0"></div>
                        <div className="w-10 h-10 border border-l-0"></div>
                        <div className="w-10 h-10 border border-l-0"></div>
                    </div>
                </div>

                <p>
                    Đơn vị nhận báo cáo: Sở Lao động - Thương binh và Xã hội.
                </p>

                <div className="flex items-center gap-10">
                    <span className="flex-1">Lĩnh vực sản xuất chính của cơ sở: ............................... Mã lĩnh vực:</span>
                    <div className="flex flex-1">
                        <div className="w-10 h-10 border"></div>
                        <div className="w-10 h-10 border border-l-0"></div>
                        <div className="w-10 h-10 border border-l-0"></div>
                        <div className="w-10 h-10 border border-l-0"></div>
                    </div>
                </div>

                <div>
                    <p>Tổng số lao động của cơ sở: ................. người, trong đó nữ: ................. người</p>
                    <p>Tổng quỹ lương: .................... triệu đồng</p>
                </div>

                <div className="space-y-5">
                    <h1 className="font-semibold">I. Tình hình chung tai nạn lao động</h1>
                    <table className="w-full text-sm border-collapse border border-black">
                        <thead>
                            <tr className="">
                                <th rowSpan={4} className="border border-black p-2 text-left align-middle w-150">Tiêu chí thống kê</th>
                                <th rowSpan={4} className="border border-black p-2 text-center align-middle">Mã số</th>
                                <th colSpan={11} className="border border-black p-2 text-center">Phân loại TNLĐ theo mức độ thương tật</th>
                            </tr>
                            <tr className="">
                                <th colSpan={3} className="border border-black p-2 text-center">Số vụ</th>
                                <th colSpan={8} className="border border-black p-2 text-center">Số người bị nạn (người)</th>
                            </tr>
                            <tr className="">
                                <th rowSpan={2} className="border border-black p-2 text-center align-middle">Tổng số</th>
                                <th rowSpan={2} className="border border-black p-2 text-center align-middle">Số vụ có người chết</th>
                                <th rowSpan={2} className="border border-black p-2 text-center align-middle">Số vụ có từ 2 người bị nạn trở lên</th>
                                <th colSpan={2} className="border border-black p-2 text-center">Tổng số</th>
                                <th colSpan={2} className="border border-black p-2 text-center">Số LĐ nữ</th>
                                <th colSpan={2} className="border border-black p-2 text-center">Số người bị chết</th>
                                <th colSpan={2} className="border border-black p-2 text-center">Số người bị thương nặng</th>
                            </tr>
                            <tr className="">
                                <th className="border border-black p-2 text-center">Tổng số</th>
                                <th className="border border-black p-2 text-center">NN không thuộc quyền quản lý</th>
                                <th className="border border-black p-2 text-center">Tổng số</th>
                                <th className="border border-black p-2 text-center">NN không thuộc quyền quản lý</th>
                                <th className="border border-black p-2 text-center">Tổng số</th>
                                <th className="border border-black p-2 text-center">NN không thuộc quyền quản lý</th>
                                <th className="border border-black p-2 text-center">Tổng số</th>
                                <th className="border border-black p-2 text-center">NN không thuộc quyền quản lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black p-2 text-center">1</td>
                                <td className="border border-black p-2 text-center">2</td>
                                <td className="border border-black p-2 text-center">3</td>
                                <td className="border border-black p-2 text-center">4</td>
                                <td className="border border-black p-2 text-center">5</td>
                                <td className="border border-black p-2 text-center">6</td>
                                <td className="border border-black p-2 text-center">7</td>
                                <td className="border border-black p-2 text-center">8</td>
                                <td className="border border-black p-2 text-center">9</td>
                                <td className="border border-black p-2 text-center">10</td>
                                <td className="border border-black p-2 text-center">11</td>
                                <td className="border border-black p-2 text-center">12</td>
                                <td className="border border-black p-2 text-center">13</td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-black py-1 ps-3" colSpan={13}>1. Tai nạn lao động</td>
                            </tr>
                            <tr className={"bg-white"}>
                                <td className="border border-black p-2 ps-5">Tai nạn lao động</td>
                                <td className="border border-black p-2 text-center"></td>
                                <td className="border border-black p-2 text-center">{submitForm.m1TotalCases}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m1FatalVictims}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m1MultiVictimCases}</td>

                                <td className="border border-black p-2 text-center">{submitForm.m1TotalVictims}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m1NonManagedVictims}</td>

                                <td className="border border-black p-2 text-center">{submitForm.m1FemaleVictims}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m1NonManagedFemaleVictims}</td>

                                <td className="border border-black p-2 text-center">{submitForm.m1FatalVictims}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m1NonManagedFatalVictims}</td>

                                <td className="border border-black p-2 text-center">{submitForm.m1SevereInjuries}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m1NonManagedSevereInjuries}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-black py-1 ps-3 bg-gray-5" colSpan={13}>
                                    1.1 Phân theo nguyên nhân xảy ra TNLĐ
                                </td>
                            </tr>
                            {(report?.["nguyennhan"] ?? []).map((row: any, i: number) => (
                                <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-5"}>
                                    <td className="border border-black p-2 ps-5">{row.label}</td>
                                    <td className="border border-black p-2 text-center">{i + 1}</td>
                                    <td className="border border-black p-2 text-center">{row.totalCases}</td>
                                    <td className="border border-black p-2 text-center">{row.fatalCases}</td>
                                    <td className="border border-black p-2 text-center">{row.multiVictimCases}</td>
                                    <td className="border border-black p-2 text-center">{row.totalVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.femaleVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedFemaleVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.fatalVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedFatalVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.severeInjuries}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedSevereInjuries}</td>
                                </tr>
                            ))}

                            <tr>
                                <td className="font-semibold text-black py-1 ps-3 bg-gray-5" colSpan={13}>
                                    1.2 Phân theo yếu tố gây chấn thương
                                </td>
                            </tr>
                            {(report?.["yeutochanthuong"] ?? []).map((row: any, i: number) => (
                                <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-5"}>
                                    <td className="border border-black p-2 ps-5">{row.label}</td>
                                    <td className="border border-black p-2 text-center">{i + 1}</td>
                                    <td className="border border-black p-2 text-center">{row.totalCases}</td>
                                    <td className="border border-black p-2 text-center">{row.fatalCases}</td>
                                    <td className="border border-black p-2 text-center">{row.multiVictimCases}</td>
                                    <td className="border border-black p-2 text-center">{row.totalVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.femaleVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedFemaleVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.fatalVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedFatalVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.severeInjuries}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedSevereInjuries}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="font-semibold text-black py-1 ps-3 bg-gray-5" colSpan={13}>
                                    1.3 Phân theo nghề nghiệp
                                </td>
                            </tr>
                            {(report?.["phantheonghenghiep"] ?? []).map((row: any, i: number) => (
                                <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-white"}>
                                    <td className="border border-black p-2 ps-5">{row.label}</td>
                                    <td className="border border-black p-2 text-center">{i + 1}</td>
                                    <td className="border border-black p-2 text-center">{row.totalCases}</td>
                                    <td className="border border-black p-2 text-center">{row.fatalCases}</td>
                                    <td className="border border-black p-2 text-center">{row.multiVictimCases}</td>
                                    <td className="border border-black p-2 text-center">{row.totalVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.femaleVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedFemaleVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.fatalVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedFatalVictims}</td>
                                    <td className="border border-black p-2 text-center">{row.severeInjuries}</td>
                                    <td className="border border-black p-2 text-center">{row.nonManagedSevereInjuries}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="font-semibold text-black py-1 ps-3 bg-white" colSpan={13}>
                                    2. Tai nạn được hưởng trợ cấp theo quy định Khoản 2 Điều 39 Luật ATVSLĐ
                                </td>
                            </tr>
                            <tr className={"bg-white"}>
                                <td className="border border-black p-2 ps-5">Tai nạn được hưởng trợ cấp theo quy định Khoản 2 Điều 39 Luật ATVSLĐ</td>
                                <td className="border border-black p-2 text-center"></td>
                                <td className="border border-black p-2 text-center">{submitForm.m2TotalCases}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m2FatalCases}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m2MultiVictimCases}</td>

                                <td className="border border-black p-2 text-center">{submitForm.m2TotalVictims}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m2NonManagedVictims}</td>

                                <td className="border border-black p-2 text-center">{submitForm.m2FemaleVictims}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m2NonManagedFemaleVictims}</td>

                                <td className="border border-black p-2 text-center">{submitForm.m2FatalVictims}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m2NonManagedFatalVictims}</td>

                                <td className="border border-black p-2 text-center">{submitForm.m2SevereInjuries}</td>
                                <td className="border border-black p-2 text-center">{submitForm.m2NonManagedSevereInjuries}</td>
                            </tr>

                            <tr>
                                <td className="font-semibold text-black py-1 ps-3 bg-white" colSpan={13}>
                                    3. Tổng số
                                </td>
                            </tr>

                            <tr className={"bg-white"}>
                                <td className="border border-black p-2 ps-5">Tổng số 3 = 1 + 2</td>
                                <td className="border border-black p-2 text-center"></td>

                                <td className="border border-black p-2 text-center">
                                    {submitForm.m1TotalCases + submitForm.m2TotalCases}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {submitForm.m1FatalCases + submitForm.m2FatalCases}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {submitForm.m1MultiVictimCases + submitForm.m2MultiVictimCases}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {submitForm.m1TotalVictims + submitForm.m2TotalVictims}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {submitForm.m1NonManagedVictims + submitForm.m2NonManagedVictims}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {submitForm.m1FemaleVictims + submitForm.m2FemaleVictims}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {submitForm.m1NonManagedFemaleVictims + submitForm.m2NonManagedFemaleVictims}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {submitForm.m1FatalVictims + submitForm.m2FatalVictims}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {submitForm.m1NonManagedFatalVictims + submitForm.m2NonManagedFatalVictims}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {submitForm.m1SevereInjuries + submitForm.m2SevereInjuries}
                                </td>

                                <td className="border border-black p-2 text-center">
                                    {submitForm.m1NonManagedSevereInjuries + submitForm.m2NonManagedSevereInjuries}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 className="font-semibold">II. Thiệt hại do tai nạn lao động</h1>
                    <table className="w-full text-sm border-collapse border border-black">
                        <tbody>
                            <tr className="bg-white font-semibold">
                                <td className="border border-black p-2 text-center" rowSpan={3}>Tổng số ngày nghỉ vì tai nạn lao động (kể cả chế độ)</td>
                                <td className="border border-black p-2 text-center" colSpan={11}>Tổng số ngày nghỉ vì TNLĐ (1.000đ)</td>
                                <td className="border border-black p-2 text-center" rowSpan={3}>
                                    Thiệt hại tài sản
                                    (1.000đ)
                                </td>
                            </tr>
                            <tr className="bg-white font-semibold">
                                <td className="border border-black p-2 text-center" rowSpan={2} colSpan={2}>Tổng số</td>
                                <td className="border border-black p-2 text-center" rowSpan={1} colSpan={9}>Khoản chi cụ thể của cơ sở</td>
                            </tr>
                            <tr className="bg-white font-semibold">
                                <td className="border border-black p-2 text-center" colSpan={3}>Y tế</td>
                                <td className="border border-black p-2 text-center" colSpan={3}>Trả lương trong thời gian điều trị</td>
                                <td className="border border-black p-2 text-center" colSpan={3}>Bồi thường trợ cấp</td>
                            </tr>

                            <tr>
                                <td className="border border-black p-2 text-center">1</td>
                                <td className="border border-black p-2 text-center" colSpan={2}>2</td>
                                <td className="border border-black p-2 text-center" colSpan={3}>3</td>
                                <td className="border border-black p-2 text-center" colSpan={3}>4</td>
                                <td className="border border-black p-2 text-center" colSpan={3}>5</td>
                                <td className="border border-black p-2 text-center">6</td>
                            </tr>

                            <tr>
                                <td className="border border-black p-2 text-center" >{submitForm.m1TotalLeaveDays + submitForm.m2TotalLeaveDays}</td>
                                <td className="border border-black p-2 text-center" colSpan={2}>{(submitForm.m1TotalDamage + submitForm.m2TotalDamage).toLocaleString("vi-VN")}</td>
                                <td className="border border-black p-2 text-center" colSpan={3}>{(submitForm.m1MedicalCost + submitForm.m2MedicalCost).toLocaleString("vi-VN")}</td>
                                <td className="border border-black p-2 text-center" colSpan={3}>{(submitForm.m1SalaryCompensation + submitForm.m2SalaryCompensation).toLocaleString("vi-VN")}</td>
                                <td className="border border-black p-2 text-center" colSpan={3}>{(submitForm.m1PropertyDamage + submitForm.m2PropertyDamage).toLocaleString("vi-VN")}</td>
                                <td className="border border-black p-2 text-center" >{(submitForm.m1PropertyDamage + submitForm.m2PropertyDamage).toLocaleString("vi-VN")}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="space-y-50">
                    <div className="text-center">
                        <h1 className="font-semibold">ĐẠI DIỆN NGƯỜI SỬ DỤNG LAO ĐỘNG</h1>
                        <p className="italic">(Ký, ghi rõ họ tên, chức vụ, đóng dấu)</p>
                    </div>

                    <div>
                        <div className="w-40 h-px bg-black"></div>

                        <p>1. Ghi mã số theo Danh Mục đơn vị hành chính do Thủ tướng Chính phủ ban hành theo quy định của <a href="https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Luat-thong-ke-2015-298370.aspx" className="text-blue-700 underline">Luật Thống Kê</a>.</p>
                        <p>2. Ghi tên, mã số theo danh Mục và mã số các đơn vị kinh tế, hành chính sự nghiệp theo quy định pháp luật hiện hành trong báo cáo thống kê.</p>
                        <p>3. Ghi tên ngành, mã ngành theo Hệ thống ngành kinh tế do Thủ tướng Chính phủ ban hành theo quy định của <a href="https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Luat-thong-ke-2015-298370.aspx" className="text-blue-700 underline">Luật Thống Kê</a>.</p>
                        <p>4. Ghi 01 nguyên nhân chính gây tai nạn lao động.</p>
                        <p>5. Ghi tên và mã số theo danh Mục yếu tố gây chấn thương.</p>
                        <p>6. Ghi tên và mã số nghề nghiệp theo danh Mục nghề nghiệp do Thủ tướng Chính phủ ban hành theo quy định của <a href="https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Luat-thong-ke-2015-298370.aspx" className="text-blue-700 underline">Luật Thống Kê</a>.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ViewReport;