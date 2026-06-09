import { Activity } from "./view.models";
export declare class View {
    constructor(view?: Partial<View>, keys?: string[]);
    id: number;
    name: string;
    activities: Activity[];
    url: string;
    icon: string;
    parentId: string;
    doet_id: number;
    order: number;
}
