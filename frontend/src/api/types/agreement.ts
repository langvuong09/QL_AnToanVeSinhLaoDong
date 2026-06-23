export type AgreementBusiness = {
    id: number;
    title: string;
    period: string;
    startDate: string;
    endDate: string;
    status: string;
    attachedFiles: any[];
    business: Business;
}

export type Business = {
    id: number;
    name: string;
    taxCode: string;
    province: {
        key: string;
        value: string;
    };
    ward: {
        key: string;
        value: string;
    };
    period: string;
    year: number;
    startDate: string;
    endDate: string;
    status: string;
}

export type AgreementTable = {
    overview: Overview;
    tableRows: TableRow[];
    timeline: Timeline[];
}

export type Overview = {
    id: number;
    title: string;
    year: number;
    status: string;
    reportConfig: {
        id: number;
        name: string;
        period: string;
        startDate: string;
        endDate: string;
    };
    company: {
        createdBy: string;
        createdAt: string;
        updatedBy: string;
        updatedAt: string;
        deletedBy: string;
        deletedAt: string;

        phone: string;
        address: string;
        quater: null;

        province: {
            key: string;
            value: string;
        };
        ward: {
            key: string;
            value: string;
        };
        district: {
            key: string;
            value: string;
        };

        id: string;
        name: string;
        taxCode: string;
        issueDate: string;
        status: boolean;
        foreignName: string;
        representative: string;
        repPhone: string;

        businessTypeId: number;
        businessType: {
            id: number;
            code: string;
            name: string;
            isActive: boolean;
            deletedAt: null;
        };

        industryId: number;
        industry: {
            id: number;
            code: string;
            name: string;
            isActive: boolean;
            parentId: number;
            deletedAt: null;
        };
    };

    attachedFiles: [];
}

export type TableRow = {

}

export type Timeline = {

}