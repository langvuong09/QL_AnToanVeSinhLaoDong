export type BusinessType = {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    deletedAt: string | null;
};

export type Industry = {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    parentId: number | null;
    deletedAt: string | null;
};

export type AddressKey = {
    key: string;
    value: string;
};

export type Doet = {
    id: number;
    name: string;
    foreignName: string | null;
    taxCode: string;
    address: string;
    phone: string;
    repPhone: string;
    representative: string;
    issuedDate: string;
    status: boolean;
    quarter: string | null;
    businessTypeId: number;
    industryId: number;
    businessType: BusinessType;
    industry: Industry;
    province: AddressKey;
    district: AddressKey;
    ward: AddressKey;
    createdBy: string | null;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string;
    deletedAt: string | null;
    deletedBy: string | null;
};

export type ReportType = {
    id: number;
    name: string;
    year: number;
    period: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
};

export type AgreementBusiness = {
    id: number;
    title: string;
    year: number;
    status: string;
    reportTypeId: number;
    reportType: ReportType;
    doetId: number;
    doet: Doet;
    totalEmployees: number | null;
    femaleEmployees: number | null;

    m1TotalCases: number | null;
    m1FatalCases: number | null;
    m1MultiVictimCases: number | null;
    m1TotalVictims: number | null;
    m1FatalVictims: number | null;
    m1FemaleVictims: number | null;
    m1SevereInjuries: number | null;
    m1NonManagedVictims: number | null;
    m1NonManagedFatalVictims: number | null;
    m1NonManagedFemaleVictims: number | null;
    m1NonManagedSevereInjuries: number | null;
    m1MedicalCost: number | null;
    m1SalaryCompensation: number | null;
    m1PropertyDamage: number | null;
    m1TotalCost: number | null;

    m2TotalCases: number | null;
    m2FatalCases: number | null;
    m2MultiVictimCases: number | null;
    m2TotalVictims: number | null;
    m2FatalVictims: number | null;
    m2FemaleVictims: number | null;
    m2SevereInjuries: number | null;
    m2NonManagedVictims: number | null;
    m2NonManagedFatalVictims: number | null;
    m2NonManagedFemaleVictims: number | null;
    m2NonManagedSevereInjuries: number | null;
    m2MedicalCost: number | null;
    m2SalaryCompensation: number | null;
    m2PropertyDamage: number | null;
    m2TotalCost: number | null;
};

// Used
export type AgreementTable = {
    overview: Overview;

    details: DetailAgreement[];
    timeline: any[];
}

// Used
export type Overview = {
    id: number;
    title: string;
    year: number;
    status: string;
    attachedFiles: any[];

    reportConfig: ReportType;

    companyInfo: {
        femaleEmployees: number;
        totalEmployees: number;
        totalPayroll: number;
    };

    company: {
        id: number;
        name: string;

        industry: Industry;
        businessType: BusinessType;
    }

    summaryM1: {
        "totalCases": number;
        "fatalCases": number;
        "multiVictimCases": number;
        "totalVictims": number;
        "femaleVictims": number;
        "fatalVictims": number;
        "severeInjuries": number;
        "totalLeaveDays": number;
        "totalDamage": number;
        "medicalCost": number;
        "salaryCompensation": number;
        "propertyDamage": number;
        "totalCost": number;
    };

    summaryM2: {
        fatalCases: number | null;
        fatalVictims: number | null;
        femaleVictims: number | null;
        medicalCost: number | null;
        multiVictimCases: number | null;
        nonManagedFatalVictims: number | null;
        nonManagedFemaleVictims: number | null;
        nonManagedSevereInjuries: number | null;
        nonManagedVictims: number | null;
        propertyDamage: number | null;
        salaryCompensation: number | null;
        severeInjuries: number | null;
        totalCases: number | null;
        totalCost: number | null;
        totalVictims: number | null;
    };
}

export type UpdateAgreementData = {
    "title": string,
    "year": number,
    "reportTypeId": number,
    "totalEmployees": number,
    "femaleEmployees": number,
    "totalPayroll": number,
    "m1TotalCases": number,
    "m1FatalCases": number,
    "m1MultiVictimCases": number,
    "m1TotalVictims": number,
    "m1FemaleVictims": number,
    "m1FatalVictims": number,
    "m1SevereInjuries": number,
    "m1NonManagedVictims": number,
    "m1NonManagedFemaleVictims": number,
    "m1NonManagedFatalVictims": number,
    "m1NonManagedSevereInjuries": number,
    "m1MedicalCost": number,
    "m1SalaryCompensation": number,
    "m1PropertyDamage": number,
    "m1TotalCost": number,
    "m1TotalLeaveDays": number,
    "m1TotalDamage": number,
    "m2TotalCases": number,
    "m2FatalCases": number,
    "m2MultiVictimCases": number,
    "m2TotalVictims": number,
    "m2FemaleVictims": number,
    "m2FatalVictims": number,
    "m2SevereInjuries": number,
    "m2NonManagedVictims": number,
    "m2NonManagedFemaleVictims": number,
    "m2NonManagedFatalVictims": number,
    "m2NonManagedSevereInjuries": number,
    "m2MedicalCost": number,
    "m2SalaryCompensation": number,
    "m2PropertyDamage": number,
    "m2TotalCost": number,
    "m2TotalLeaveDays": number,
    "m2TotalDamage": number,
    "details": {
        "causeId": number,
        "traumaId": number,
        "jobId": number,
        "totalCases": number,
        "fatalCases": number,
        "multiVictimCases": number,
        "totalVictims": number,
        "femaleVictims": number,
        "fatalVictims": number,
        "severeInjuries": number,
        "nonManagedVictims": number,
        "nonManagedFemaleVictims": number,
        "nonManagedFatalVictims": number,
        "nonManagedSevereInjuries": number,
        "medicalCost": number,
        "salaryCompensation": number,
        "propertyDamage": number,
        "totalCost": number,
        "totalLeaveDays": number,
        "totalDamage": number
    }[],
    "fileIds": string[]
}

type DetailAgreement = {
    "id": number,
    "reportId": number,
    "causeId": number,
    "cause": {
        "id": number,
        "code": string,
        "name": string,
    },
    "traumaId": number,
    "trauma": {
        "id": number,
        "code": string,
        "name": string,
    },
    "jobId": number,
    "job": {
        "id": number,
        "code": string,
        "name": string,
    },
    "totalCases": number,
    "fatalCases": number,
    "multiVictimCases": number,
    "totalVictims": number,
    "femaleVictims": number,
    "fatalVictims": number,
    "severeInjuries": number,
    "nonManagedVictims": number,
    "nonManagedFemaleVictims": number,
    "nonManagedFatalVictims": number,
    "nonManagedSevereInjuries": number,
    "medicalCost": number,
    "salaryCompensation": number,
    "propertyDamage": number,
    "totalCost": number,
    "totalLeaveDays": number,
    "totalDamage": number,

    "traumaName": string,
    "jobName": string
}