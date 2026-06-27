export type SubmitForm = {
    title: string;
    year: number;
    reportTypeId: number;

    totalEmployees: number;
    femaleEmployees: number;
    totalPayroll: number;

    // Muc 1
    // Muc 1.1
    m1TotalCases: number;
    m1FatalCases: number;
    m1MultiVictimCases: number;

    m1TotalVictims: number;
    m1FemaleVictims: number;
    m1FatalVictims: number;
    m1SevereInjuries: number;

    m1NonManagedVictims: number;
    m1NonManagedFemaleVictims: number;
    m1NonManagedFatalVictims: number;
    m1NonManagedSevereInjuries: number;

    // Muc 1.2
    m1MedicalCost: number;
    m1SalaryCompensation: number;
    m1PropertyDamage: number;
    m1TotalCost: number;

    m1TotalLeaveDays: number;
    m1TotalDamage: number;

    details: {
        idx: number;
        "causeId": number;
        "traumaId": number;
        "jobId": number;

        "totalCases": number;
        "fatalCases": number;
        "multiVictimCases": number;

        "totalVictims": number;
        "femaleVictims": number;
        "fatalVictims": number;
        "severeInjuries": number;
        "nonManagedVictims": number;
        "nonManagedFemaleVictims": number;
        "nonManagedFatalVictims": number;
        "nonManagedSevereInjuries": number;
        "medicalCost": number;
        "salaryCompensation": number;
        "propertyDamage": number;
        "totalCost": number;
        "totalLeaveDays": number;
        "totalDamage": number;
    }[],

    // Muc 2
    // Muc 2.1
    m2TotalCases: number;
    m2FatalCases: number;
    m2MultiVictimCases: number;

    m2TotalVictims: number;
    m2FemaleVictims: number;
    m2FatalVictims: number;
    m2SevereInjuries: number;

    m2NonManagedVictims: number;
    m2NonManagedFemaleVictims: number;
    m2NonManagedFatalVictims: number;
    m2NonManagedSevereInjuries: number;

    // Muc 2.2
    m2MedicalCost: number;
    m2SalaryCompensation: number;
    m2PropertyDamage: number;
    m2TotalCost: number;

    m2TotalLeaveDays: number;
    m2TotalDamage: number;

    fileIds: {
        name: string;
        url: string;
    }[];

    doet?: Doet;
    reportType?: ReportConfig;
}

export type Detail = {
    idx: number;
    "causeId": number;
    "traumaId": number;
    "jobId": number;

    "totalCases": number;
    "fatalCases": number;
    "multiVictimCases": number;
    "totalVictims": number;
    "femaleVictims": number;
    "fatalVictims": number;
    "severeInjuries": number;
    "nonManagedVictims": number;
    "nonManagedFemaleVictims": number;
    "nonManagedFatalVictims": number;
    "nonManagedSevereInjuries": number;
    "medicalCost": number;
    "salaryCompensation": number;
    "propertyDamage": number;
    "totalCost": number;
    "totalLeaveDays": number;
    "totalDamage": number;
}

type Doet = {
    "phone": string;
    "address": string;
    "ward": {
        "key": string;
        "value": string;
    },
    "district": {
        "key": string;
        "value": string;
    },
    "province": {
        "key": string;
        "value": string;
    },
    "id": number,
    "name": string;
    "taxCode": string;
    "issuedDate": string;
    "status": true,
    "businessTypeId": number,
    "businessType": {
        "id": number,
        "code": string;
        "name": string;
        "isActive": true,
    },
    "industryId": number,
    "industry": {
        "id": number,
        "code": string;
        "name": string;
        "isActive": true,
        "parentId": number,
    },
    "foreignName": string;
    "representative": string;
    "repPhone": string;
}

type ReportConfig = {
    "id": number,
    "name": string;
    "year": number,
    "period": string;
    "startDate": string;
    "endDate": string;
    "isActive": true
}