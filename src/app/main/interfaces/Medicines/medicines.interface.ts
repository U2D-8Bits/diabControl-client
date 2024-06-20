import { Category } from "../categories/category.interface";

export interface Medicine {
    id: number;
    name_medicine: string;
    generic_name: string;
    category: Category
}