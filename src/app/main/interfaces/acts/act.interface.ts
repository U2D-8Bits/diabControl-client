import { User } from "../../../auth/interfaces";

export interface ActInterface {
    id: number;
    created_at: Date;
    updated_at: Date;
    minor_age: boolean;
    disability: boolean;
    illiteracy: boolean;
    tutor_name: string;
    tutor_lastname: string;
    tutor_ced: string;
    tutor_phone: string;
    tutor_email: string;
    tutor_address: string;
    tutor_motive: string;
    user: User;
}