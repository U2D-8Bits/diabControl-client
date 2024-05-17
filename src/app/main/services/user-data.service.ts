import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

    //? Declaramos el BehaviorSubject para el ID del paciente sin inicializarlo en 0
    private userIdSource = new BehaviorSubject<number>(0);

    //? Declaramos el observable
    currentUserId = this.userIdSource.asObservable();

    constructor() { }

    //? Funcion para cambiar el valor del observable
    changeUserId(userId: number) {
        this.userIdSource.next(userId);
    }

}