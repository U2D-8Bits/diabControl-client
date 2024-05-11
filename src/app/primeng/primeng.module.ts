import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TooltipModule } from 'primeng/tooltip';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
  declarations: [],
  exports: [
    TooltipModule,
    MessagesModule,
    ToastModule,
    AvatarModule,
    AvatarGroupModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    SidebarModule
  ],
})
export class PrimengModule { }
