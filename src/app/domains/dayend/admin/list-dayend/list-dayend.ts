import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { NepaliDateFormatterPipe } from '../../../shared/pipes/nepali-date-formatter.pipe';
import { IDayendDto } from '../../data/model/dayend';
import { DayendService } from '../../data/services/dayend.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MessageService } from '@logger/message.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-list-dayend',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NzTagModule,
    NepaliDateFormatterPipe,
  ],
  templateUrl: './list-dayend.html',
  styleUrl: './list-dayend.scss',
  providers: [NzModalService],
})
export class ListDayend {
  data$!: Observable<IDayendDto[]>;
  private router = inject(Router);
  private dayendService = inject(DayendService);
  private modal = inject(NzModalService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);

  ngOnInit(): void {
    this.fetchDayendList();
  }

  private fetchDayendList(): void {
    console.log('calling fetch list');
    this.data$ = this.dayendService.getDayendList();
  }

  onSave(id: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to save dayend?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, Save',
      nzOnOk: () => this.saveDayEnd(id),
    });
  }

  saveDayEnd(id: number): void {
    this.dayendService
      .saveDayend(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.messageService.createMessage('success', res.message);
        this.fetchDayendList();
      });
  }
}
