import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../auth/interfaces';
import { ActService } from '../../services/act.service';
import { ActInterface } from '../../interfaces/acts/act.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import Swal from 'sweetalert2';
import { CreateActComponent } from '../../components/Act/create-act/create-act.component';
import { ViewActComponent } from '../../components/Act/view-act/view-act.component';
import { FileService } from '../../services/file.service';
import { FileInterface } from '../../interfaces/files/file.interface';
import { DomSanitizer, SafeResourceUrl, SafeUrl, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-act-page',
  templateUrl: './act-page.component.html',
  styleUrl: './act-page.component.css',
  providers: [ConfirmationService, MessageService, DialogService]
})
export class ActPageComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer
  ){}




  //? Variables e Inyecciones
  private userService = inject(UserService);
  private actService = inject(ActService);
  private fileService = inject( FileService );
  private route = inject( ActivatedRoute )
  private dialogService = inject( DialogService );

  private idPatient!: number;
  public patientData!: User;
  existAct: boolean = false;
  existFile: boolean = false;
  public actData!: ActInterface;
  fileUrl: SafeResourceUrl = '';
  selectedFile!: File;
  idFile!: number;
  
  ngOnInit() {
    console.log(`Componente ActPage creado`)
    this.idPatient = Number(this.route.snapshot.params['id']);
    this.getPatientData();
    this.getActaByPatientId();
    this.getFileByUser();
  }


  //? Metodo para obtener los datos del paciente
  getPatientData(){
    this.userService.getUserById( this.idPatient)
    .subscribe({
      next: (user: User) => {
        this.patientData = user;
        console.log(`data recivida:`, this.patientData)
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }


  //? Metodo para obtener el acta del paciente
  getActaByPatientId(){
    this.actService.getActByPatientId(this.idPatient)
    .subscribe({
      next: (act: ActInterface) => {
        this.actData = act;
        this.existAct = true;
      },
      error: (err: any) => {
        console.error(err);
        this.existAct = false;
      }
    })
  }


  //? Metodo para abir el dialogo
  showDialog(componentName: string, headerText: string){
    if( componentName === 'create'){
      this.dialogService.open( CreateActComponent,{
        header: headerText,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
        data: {
          idPatient: this.idPatient,
        }
      })
    }

    if( componentName === 'view'){
      this.dialogService.open( ViewActComponent,{
        header: headerText,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
        data: {
          idPatient: this.idPatient,
          idAct: this.actData.id
        }
      })
    }
  }


  //? Metodo para eliminar el acta
  deleteAct(){

    if(this.existFile){
      Swal.fire(
        'Error!',
        'No puedes eliminar el acta si existe un archivo adjunto.',
        'error'
      )
    }else{
      Swal.fire({
        title: '¿Estas seguro?',
        text: "No podras revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar acta!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.actService.deleteAct(this.actData.id)
          .subscribe({
            next: (resp: any) => {
              Swal.fire(
                'Eliminado!',
                'El acta ha sido eliminada.',
                'success'
              )
              //Recargamos el componente
              this.ngOnDestroy();
              this.ngOnInit();
            },
            error: (err: any) => {
              Swal.fire(
                'Error!',
                'Ha ocurrido un error al eliminar el acta.',
                'error'
              )
            }
          })
        }
        if(result.isDismissed){
          Swal.fire(
            'Cancelado',
            'La acción ha sido cancelada',
            'info'
          )
        }
      })
    }
  }


  //? Metodo para descargar el acta en pdf
  downloadPDF(){
    this.actService.downloadAct(this.actData.id)
    .subscribe({
      next: (resp: any) => {
        const blob = new Blob([resp], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }



  uploadFile(): void {
    if( this.selectedFile){
      this.fileService.uploadFile(this.idPatient, this.selectedFile)
      .subscribe({
        next: (resp: any) => {
          Swal.fire(
            'Archivo subido!',
            'El archivo ha sido subido correctamente.',
            'success'
          )
          //Recargamos el componente
          this.existFile = true;
          this.ngOnDestroy();
          this.ngOnInit();
        },
        error: (err: any) => {
          Swal.fire(
            'Error!',
            err.error.message,
            'error'
          )
        }
      })
    }
  }



  //? Metodo para obtener el archivo
  getFileByUser(){
    this.fileService.getFile(this.idPatient)
    .subscribe({
      next: (file) => {
        const url = `${file.url}`
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.idFile = file.id;
        this.existFile = true;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }


  //? Metodo para eliminar el Archivo
  deleteFile(): void {

    Swal.fire({
      title: '¿Estas seguro?',
      text: "No podras revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar archivo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.fileService.deleteFile(this.idFile)
        .subscribe({
          next: (resp: any) => {
            Swal.fire(
              'Eliminado!',
              'El archivo ha sido eliminado.',
              'success'
            ),

            //Recargamos el componente
            this.existFile = false;
            this.ngOnDestroy();
            this.ngOnInit();
          },
          error: (err: any) => {
            Swal.fire(
              'Error!',
              err.error.message,
              'error'
            )
          }
        })
      }
      if(result.isDismissed){
        Swal.fire(
          'Cancelado',
          'La acción ha sido cancelada',
          'info'
        )
      }
    
    })

  }

  ngOnDestroy(): void {
    console.log(`Componente ActPage destruido`)
  }

}
