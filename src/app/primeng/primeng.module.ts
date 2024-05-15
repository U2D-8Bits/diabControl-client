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
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';

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
    SidebarModule,
    ButtonModule,
    CardModule,
    MenubarModule,
    MenuModule,
  ],
})
export class PrimengModule { }
