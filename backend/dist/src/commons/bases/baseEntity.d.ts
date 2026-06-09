export declare abstract class BaseEntity {
    constructor(baseEntity: Partial<BaseEntity>);
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    deletedBy: string;
    deletedAt: Date;
}
