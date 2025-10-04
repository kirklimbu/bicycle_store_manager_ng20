import { FormGroup } from "@angular/forms";


let form: FormGroup;
export function getFormValue(controlKey: string): any {
    return form.controls[controlKey]?.value;
}




