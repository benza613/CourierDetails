import { AbstractControl } from '@angular/forms';

export function ValidateSelect(control: AbstractControl) {
  
    if (control.value == "") {
        return { inValidOption: true };
    }
    return null;
}