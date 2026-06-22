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