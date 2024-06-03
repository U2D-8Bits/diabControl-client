import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

  export class FormDataService{
    
    constructor() { }

    //? Declaramos el BehaviorSubject para el ID del formulario sin inicializarlo en 0
    private formIdSource = new BehaviorSubject<number>(0);

    //? Declaramos el observable
    currentFormId = this.formIdSource.asObservable();

    //? Funcion para cambiar el valor del observable
    changeFormId(formId: number) {
        this.formIdSource.next(formId);
    }

  }
