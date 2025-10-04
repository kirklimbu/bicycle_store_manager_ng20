import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-pop-confirm',
    imports: [CommonModule],
    templateUrl: './PopConfirm.component.html',
    styleUrl: './PopConfirm.component.scss'
})
export class PopConfirmComponent {


  clickOk = output<null>();
  private nzMessageService = inject(NzMessageService);


  constructor(
  ) { }

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    this.clickOk.emit(null);
    this.nzMessageService.info('click confirm');
  }

}
