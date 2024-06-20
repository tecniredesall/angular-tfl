import { UntypedFormControl, ValidatorFn } from "@angular/forms";
import * as moment from "moment";

export function validatorMaxDateFormControl(maxDate: moment.Moment): ValidatorFn {
  return (control: UntypedFormControl): { [key: string]: any } | null => {
    return moment(control.value).isAfter(maxDate) ? {dateMax: {value: maxDate.toString()}} : null;
  }
};
