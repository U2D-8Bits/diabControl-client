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





    private userInfoSubject = new BehaviorSubject<string>(localStorage.getItem('user_name') || '');
    private roleUserSubject = new BehaviorSubject<string>(localStorage.getItem('role') || '');
    private nameUserSubject = new BehaviorSubject<string>(localStorage.getItem('nameUser') || '');
  
    userInfo$ = this.userInfoSubject.asObservable();
    roleUser$ = this.roleUserSubject.asObservable();
    nameUser$ = this.nameUserSubject.asObservable();
  
    updateUserInfo(userInfo: string, roleUser: string, nameUser: string) {
      localStorage.setItem('user_name', userInfo);
      localStorage.setItem('role', roleUser);
      localStorage.setItem('nameUser', nameUser);
      
      this.userInfoSubject.next(userInfo);
      this.roleUserSubject.next(roleUser);
      this.nameUserSubject.next(nameUser);
    }
}