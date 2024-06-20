import { UntypedFormControl, ValidatorFn } from "@angular/forms";
import { convertStringToNumber } from "../utils/functions/string-to-number";

export function validatorNonZeroFormControl(): ValidatorFn {
  return (control: UntypedFormControl): { [key: string]: any } | null => {
    return 0 !== convertStringToNumber(control.value) ? null : { zero: { value: 0 } };
  }
};
