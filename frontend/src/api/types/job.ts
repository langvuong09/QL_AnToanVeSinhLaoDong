export type JobDto = {
    id: number;
    name: string;
    isActive: boolean;
    code: string;
    children?: JobDto[];
    deleteAt: string;
}