import { User } from "../../../auth/interfaces";
import { History } from "../history.interface";

export interface Control {
    id_medic_control: number;
    id_control:       string;
    created_at:       Date;
    date_control:     Date;
    observation:      string;
    recommendations:  string;
    medico:           User;
    paciente:         User;
    history:          History;
}
