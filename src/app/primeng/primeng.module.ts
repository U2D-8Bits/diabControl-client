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
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

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
    TableModule,
    TagModule,
    PasswordModule,
    AccordionModule,
    InputTextModule,
    TabViewModule,
    InputSwitchModule,
    FileUploadModule,
    BadgeModule,
    ProgressBarModule,
    ScrollPanelModule,
    DropdownModule,
    MultiSelectModule
  ],
})
export class PrimengModule { }
