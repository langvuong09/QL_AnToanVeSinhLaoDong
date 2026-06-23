export type SubmitForm = {
    totalEmployees: number;
    femaleEmployees: number;

    m1TotalCases: number;
    m1FatalCases: number;
    m1MultiVictimCases: number;
    // 
    m1TotalVictims: number;
    m1FemaleVictims: number;
    m1FatalVictims: number;
    m1SevereInjuries: number;
    //
    m1NonManagedVictims: number;
    m1NonManagedFemaleVictims: number;
    m1NonManagedFatalVictims: number;
    m1NonManagedSevereInjuries: number;

    m1MedicalCost: number;
    m1SalaryCompensation: number;

    m1PropertyDamage: number;
}

type A = {
    // Thong tin doanh nghiep
    tongSoLDCoSo: number;
    tongSoLDNu: number;
    tongQuyLuong: number;

    // 1. Khai bao tai nan lao dong
    m1tongSoVu: number;
    m1tongSoNguoiChet: number;
    m1tongSopVuCo2NguoiTroLen: number;

    m1tongSoNguoiBiNan: number;
    m1tongSoLDNuBiNan: number;
    m1tongSoNguoiChet: number;
    m1tongSoNguoiBiThuongNang: number;

    m1tongSoNguoiBiNanKhongQL: number;
    m1tongLDNuBiNanKhongQL: number;
    m1tongSoNguoiChetKhongQL: number;
    m1tongSoNguoiBiThuongNangKhongQL: number;

    m1chiPhiYTe: number;
    m1chiPhiTraLuongTrongTGDieuTri: number;
    m1chiPhiBoiThuongTroCap: number;
    m1tongChiPhi: number;

    m1tongSoNgayNghiViTNLD: number;
    m1tongThietHai: number;

    // Chi tiet tai nan lao dong
    detail: {
        tongSoVu: number // Disable vi chac chan no la 1
        tongSoVuCoNguoiChet: number // Disable vi chac chan no la 1 hoac 0
        tongSopVuCo2NguoiTroLen: number; // Disable vi chac chan no la 1 hoac 0

        tongSoNguoiBiNan: number;
        tongSoLDNuBiNan: number;
        tongSoNguoiChet: number;
        tongSoNguoiBiThuongNang: number;

        tongSoNguoiBiNanKhongQL: number;
        tongLDNuBiNanKhongQL: number;
        tongSoNguoiChetKhongQL: number;
        tongSoNguoiBiThuongNangKhongQL: number;

        chiPhiYTe: number;
        chiPhiTraLuongTrongTGDieuTri: number;
        chiPhiBoiThuongTroCap: number;
        tongChiPhi: number;

        tongSoNgayNghiViTNLD: number;
        tongThietHai: number;

    }[];

    // 2. Tai nan lao dong duoc huong tro cap
    m2tongSoVu: number;
    m2tongSoNguoiChet: number;
    m2tongSopVuCo2NguoiTroLen: number;

    m2tongSoNguoiBiNan: number;
    m2tongSoLDNuBiNan: number;
    m2tongSoNguoiChet: number;
    m2tongSoNguoiBiThuongNang: number;

    m2tongSoNguoiBiNanKhongQL: number;
    m2tongLDNuBiNanKhongQL: number;
    m2tongSoNguoiChetKhongQL: number;
    m2tongSoNguoiBiThuongNangKhongQL: number;

    m2chiPhiYTe: number;
    m2chiPhiTraLuongTrongTGDieuTri: number;
    m2chiPhiBoiThuongTroCap: number;
    m2tongChiPhi: number;

    m2chiPhiYTe: number;
    m2chiPhiTraLuongTrongTGDieuTri: number;
    m2chiPhiBoiThuongTroCap: number;
    m2tongChiPhi: number;

    m2tongSoNgayNghiViTNLD: number;
    m2tongThietHai: number;
}