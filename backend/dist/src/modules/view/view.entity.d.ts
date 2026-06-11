import { Permission } from '../permission/permission.entity';
export declare class View {
    id: number;
    name: string;
    url: string;
    requiredPermissions: Permission[];
    parentId: number;
    parent?: View;
    children: View[];
    icon: string;
    order: number;
}
