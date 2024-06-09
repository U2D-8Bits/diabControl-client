import { User } from "../../../auth/interfaces";

export interface FileInterface{

    id: number;

    filename: string;

    path: string;

    user: User;
}