import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

    //? Declaramos el BehaviorSubject para el ID del paciente
    private _userIdSource = new BehaviorSubject<number>(0);

    //? Declaramos el observable
    currentUserId = this._userIdSource.asObservable();

    constructor() { }

    //? Funcion para cambiar el valor del observable
    changeUserId(userId: number) {
        this._userIdSource.next(userId);
        console.log("Id del paciente en el Servicio: ", userId)
    }
}