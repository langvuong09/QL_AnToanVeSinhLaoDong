// Used in all cases
export type AgreementTable = {
    "id": number,
    "title": string;
    "year": number,
    "note": string,
    "status": string;
    "reportTypeId": number,
    "reportType": {
        "id": number,
        "name": string;
        "year": number,
        "period": string;
        "startDate": string;
        "endDate": string;
        "isActive": true
    },
    "doetId": number,
    "doet": {
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
    },
    "totalEmployees": number,
    "femaleEmployees": number,
    "totalPayroll": number,

    "m1TotalCases": number,
    "m1FatalCases": number,
    "m1MultiVictimCases": number;

    "m1TotalVictims": number;
    "m1FemaleVictims": number;
    "m1FatalVictims": number;
    "m1SevereInjuries": number;

    "m1NonManagedVictims": number;
    "m1NonManagedFemaleVictims": number;
    "m1NonManagedFatalVictims": number;
    "m1NonManagedSevereInjuries": number;

    "m1MedicalCost": number;
    "m1SalaryCompensation": number;
    "m1PropertyDamage": number;
    "m1TotalCost": number;

    "m1TotalLeaveDays": number;
    "m1TotalDamage": number,
    
    "m2TotalCases": number;
    "m2FatalCases": number;
    "m2MultiVictimCases": number;
    "m2TotalVictims": number;
    "m2FemaleVictims": number;
    "m2FatalVictims": number;
    "m2SevereInjuries": number;
    "m2NonManagedVictims": number;
    "m2NonManagedFemaleVictims": number;
    "m2NonManagedFatalVictims": number;
    "m2NonManagedSevereInjuries": number;
    "m2MedicalCost": number;
    "m2SalaryCompensation": number;
    "m2PropertyDamage": number;
    "m2TotalCost": number;
    "m2TotalLeaveDays": number;
    "m2TotalDamage": number;
    "details": {
        "id": number;
        "reportId": number;
        "causeId": number;
        "cause": {
            "id": number;
            "code": string;
            "name": string;
            "type": string;
            "isActive": true,
        },
        "traumaId": 2,
        "trauma": {
            "id": number;
            "code": string;
            "name": string;
            "isActive": true,
        },
        "jobId": number;
        "job": {
            "id": number;
            "code": string;
            "name": string;
            "isActive": true,
        },
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
    "statusHistories": [],
    "files": {
        "id": string;
        "originalFilename": string;
        "url": string;
        "secureUrl": string;
        "publicId": string;
    }[]
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
    "fileIds": string[],
    status: string
}