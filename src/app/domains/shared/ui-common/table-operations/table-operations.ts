import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { BsDateInputDirective } from '../../directives/bsdate/bs-date-input.directive';
import { TruncatePipe } from '../../util-common/truncate.pipe';
import { FilterField, IFilter } from './data/model/table-filter-model';
import { FilterStateService } from './data/service/filterstate.service';

@Component({
  selector: 'app-table-operations',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // third-party
    NzTableModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzSelectModule,
    NzInputModule,
    NzGridModule,
    NzSelectModule,
    BsDateInputDirective,
  ],
  templateUrl: './table-operations.html',
  styleUrl: './table-operations.scss',
})
export class TableOperations implements OnInit {
  // props

  data$!: Observable<any[]>;
  form!: FormGroup;

  showStatusFilter = input<boolean>();
  showFromDate = input<boolean>(false);
  showToDate = input<boolean>(false);
  key = input<string>(); // unique key for persistence
  fields = input<FilterField[]>(); // filter fields

  filter = signal<IFilter>({});
  filterChange = output<IFilter>();

  private fb = inject(FormBuilder);
  private filterState = inject(FilterStateService);

  constructor() {
    effect(() => {
      if (this.form) {
        const current = this.form.getRawValue();
        this.filter.set(current);
      }
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    const group: any = {};

    // build form only for visible fields
    this.fields().forEach((field) => {
      group[field.name] = field.required ? [null, Validators.required] : [null];
    });

    this.form = this.fb.group(group);

    // restore saved state
    const saved = this.filterState.getFilter(this.key());
    if (saved) {
      this.form.patchValue(saved);
      this.filter.set(saved);
    }
  }

  onSearch() {
    const value = this.form.getRawValue();
    this.filterState.setFilter(this.key(), value);
    this.filterChange.emit(value);
  }
}
