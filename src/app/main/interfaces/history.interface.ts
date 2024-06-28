import { User } from "../../auth/interfaces";

export interface History{
    id_medic_history: number;
    weight_patient: number
    tall_patient: number
    pulse_patient: number
    presure_patient: number
    frequency_patient: number
    temperature_patient: number
    consult_reason: string
    fisic_exam: string
    recipe: string[]
    fenotype: string
    current_illness: string
    diagnostic: string
    medic_indications: string
    created_at: Date
    updated_at: Date
    medico: User
    paciente: User
}