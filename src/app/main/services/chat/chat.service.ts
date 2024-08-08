import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../../../auth/interfaces";
import { environment } from "../../../environments/environments";

@Injectable({
    providedIn: 'root'
  })
  export class ChatService {
    private apiUrl = 'http://localhost:3000/chat';
  
    constructor(private http: HttpClient) {}
  
    findOrCreateChatRoom(user1: User, user2: User): Observable<any> {
      return this.http.post(`${this.apiUrl}/room/find-or-create`, { user1, user2 });
    }
  }