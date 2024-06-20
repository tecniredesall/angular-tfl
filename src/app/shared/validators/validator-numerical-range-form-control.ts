import { UntypedFormControl, ValidatorFn, Validators } from "@angular/forms";
import { convertStringToNumber } from "../utils/functions/string-to-number";

export function validatorNumericalRangeFormControl(min: number, max: number): ValidatorFn {
  return (control: UntypedFormControl): { [key: string]: any } | null => {
    return new UntypedFormControl(convertStringToNumber(control.value), [Validators.min(min), Validators.max(max)]).errors;
  }
};
