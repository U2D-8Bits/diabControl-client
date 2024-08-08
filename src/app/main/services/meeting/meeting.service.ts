import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MeetingService {
  private httpClient = inject(HttpClient);
  private readonly baseUrl: string = environment.baseUrl;

  createMeeting(meetingDetails: any): Observable<any> {

    const url = `${this.baseUrl}/zoom/create-meeting`;

    return this.httpClient.post(url, meetingDetails)
    .pipe(
        map((response: any) => {
            return response;
        }),
        catchError((error: any) => {
            return throwError(error);
        })
    )

  }
}
