import { UntypedFormControl, ValidatorFn } from "@angular/forms";
import * as moment from "moment";

export function validatorMinDateFormControl(minDate: moment.Moment): ValidatorFn {
  return (control: UntypedFormControl): { [key: string]: any } | null => {
    return moment(control.value).isBefore(minDate) ? {dateMin: {value: minDate.toString()}} : null;
  }
};
