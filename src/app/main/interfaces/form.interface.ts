import { User } from "../../auth/interfaces";

export interface Form {
    form_title:                         string;
    form_diabetes_type:                 string;
    user:                               User;
    form_glucose_mesure_date:           string;
    form_glucose_level:                 number;
    form_glucose_mesure_frequency:      string;
    form_glucose_average_level:         number;
    form_eat_habits:                    boolean;
    form_eat_habits_description:        string;
    form_physical_activity:             boolean;
    form_physical_activity_description: string;
    form_physical_activity_frequency:   string;
    form_blurred_vision:                boolean;
    form_slow_healing:                  boolean;
    form_tingling_numbness:             boolean;
    form_extreme_faigue:                boolean;
    form_incresed_thirst:               boolean;
    form_diabetes_objective:            string;
    form_additional_questions:          string;
    id_form:                            number;
    created_at:                         Date;
    updated_at:                         Date;
}
