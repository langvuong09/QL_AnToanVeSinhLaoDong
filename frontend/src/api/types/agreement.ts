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

    details: any[];
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
        femaleEmployees: number | null;
        totalEmployees: number | null;
    };

    company: {
        id: number;
        name: string;

        industry: Industry;
        businessType: BusinessType;
    }

    summaryM1: {
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
