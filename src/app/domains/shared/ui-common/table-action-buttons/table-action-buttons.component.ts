import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
// third
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'lib-table-action-buttons',
  imports: [
    CommonModule,

    // third-party
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzToolTipModule,
    NzPopconfirmModule,
  ],
  templateUrl: './table-action-buttons.component.html',
  styleUrl: './table-action-buttons.component.scss',
})
export class TableActionButtonsComponent {
  button1Label = input<string>('Edit');
  button2Label = input<string>('Delete');
  button3Label = input<string>('View');
  button4Label = input<string>('');
  button5Label = input<string>('');

  button1Icon = input<string>('edit');
  button2Icon = input<string>('delete');
  button3Icon = input<string>('eye');
  button4Icon = input<string>('dollar');
  button5Icon = input<string>('dollar');

  showEditButton = input<boolean>(true);
  showDeleteButton = input<boolean>(false);
  showViewMoreButton = input<boolean>(false);
  showButton4 = input<boolean>(false);
  showButton5 = input<boolean>(false);

  edit = output<Event>();
  delete = output<Event>();
  viewMore = output<Event>();
  buttonAction4 = output<Event>();
  buttonAction5 = output<Event>();

  onEdit() {}

  onViewMore(id: Event) {
    this.viewMore.emit(id);
  }

  onButton4Click(id: Event) {
    this.buttonAction4.emit(id);
  }
  onButton5Click(id: Event) {
    this.buttonAction5.emit(id);
  }

  cancel(): void {
    // this.nzMessageService.info('click cancel');
  }

  confirm(id: any): void {
    // this.nzMessageService.info('click confirm');
    this.delete.emit(id);
  }
}
