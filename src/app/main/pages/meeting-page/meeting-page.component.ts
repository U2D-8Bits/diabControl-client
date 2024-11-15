import { Component, inject, OnInit } from '@angular/core';
import { MeetingService } from '../../services/meeting/meeting.service';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const date = new Date(value);
    const currentDate = new Date();

    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    if (date <= currentDate) {
      return { dateInPast: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-meeting-page',
  templateUrl: './meeting-page.component.html',
  styleUrls: ['./meeting-page.component.css']
})
export class MeetingPageComponent implements OnInit {
  meetingUrl: string | null = null;
  private zoomService = inject(MeetingService);
  private fb = inject(FormBuilder);
  public currentUserRoleId: number = 0;
  patientJoinUrl: string = '';
  medicJoinUrl: string = '';

  createMeetingForm = this.fb.group({
    topic: ['', [Validators.required]],
    startTime: ['', [Validators.required, dateValidator()]],
    duration: [0, [Validators.required]],
  });

  joinMeetingForm = this.fb.group({
    meetingUrl: ['', [Validators.required]],
  });

  constructor(private sanitizer: DomSanitizer) {}

  createMeeting() {
    const meetingDetails = this.createMeetingForm.value;
    this.zoomService.createMeeting(meetingDetails).subscribe({
      next: (response) => {
        this.patientJoinUrl = response.join_url;
        this.medicJoinUrl = response.start_url;

        // Save URLs to sessionStorage
        sessionStorage.setItem('patientJoinUrl', this.patientJoinUrl);
        sessionStorage.setItem('medicJoinUrl', this.medicJoinUrl);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  joinMeeting() {
    const meetingUrl = this.joinMeetingForm.value.meetingUrl || '';
    this.meetingUrl = meetingUrl; // Set the meetingUrl to a non-undefined value
    if (meetingUrl) {
      window.open(meetingUrl, '_blank');
    }
  }

  clearUrls() {
    this.patientJoinUrl = '';
    this.medicJoinUrl = '';
    sessionStorage.removeItem('patientJoinUrl');
    sessionStorage.removeItem('medicJoinUrl');
  }

  ngOnInit(): void {
    this.currentUserRoleId = Number(localStorage.getItem('roleID'));

    // Retrieve URLs from sessionStorage
    this.patientJoinUrl = sessionStorage.getItem('patientJoinUrl') || '';
    this.medicJoinUrl = sessionStorage.getItem('medicJoinUrl') || '';

    this.createMeetingForm.statusChanges.subscribe(status => {
      console.log('Create Meeting Form Status:', status);
    });

    this.createMeetingForm.valueChanges.subscribe(value => {
      console.log('Create Meeting Form Value:', value);
    });

    this.joinMeetingForm.statusChanges.subscribe(status => {
      console.log('Join Meeting Form Status:', status);
    });

    this.joinMeetingForm.valueChanges.subscribe(value => {
      console.log('Join Meeting Form Value:', value);
    });
  }

  get safePatientJoinUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.patientJoinUrl);
  }

  get safeMedicJoinUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.medicJoinUrl);
  }
}
