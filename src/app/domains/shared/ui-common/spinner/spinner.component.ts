import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
// import { NgxSpinnerModule } from 'ngx-spinner';
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  imports: [NzSpinModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SpinnerComponent {}
