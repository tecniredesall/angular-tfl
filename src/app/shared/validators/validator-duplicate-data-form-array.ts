import { UntypedFormArray, ValidatorFn } from "@angular/forms";
import { trimSpaces } from '../utils/functions/trim-spaces';

export function validatorDuplicateDataFormArray(...args: string[]): ValidatorFn {
  return (formArray: UntypedFormArray): { [key: string]: any } | null => {

    let formArrayValid: boolean = true;

    let formControlValid: boolean = true;

    let currentValue: string = '';

    let propertyValue: string = '';

    let duplicateProperties: any = {};

    args.forEach((property: string) => {

      for (let g = 0; g < formArray.value.length; g++) {

        formControlValid = true;

        currentValue = null == formArray.value[g][property] ? formArray.value[g][property] : trimSpaces(formArray.value[g][property]);

        if (currentValue?.length > 0) {

          currentValue = currentValue.toString().toLowerCase();

          formControlValid = formArray.value.filter((f: any) => {

            propertyValue = null != f[property] ? trimSpaces(f[property].toString().toLowerCase()) : f[property];

            return currentValue == propertyValue;

          }).length < 2;

        }

        if (formControlValid) {
          if (formArray.controls[g].get(property).hasError('duplicate')) {
            formArray.controls[g].get(property).updateValueAndValidity()
          }
        }
        else{
          formArray.controls[g].get(property).setErrors({ duplicate: { value: formArray.controls[g].get(property).value } });
          duplicateProperties[property] = formArray.value[g][property];
        }

        formArrayValid = formArrayValid && formControlValid;

      }

    });

    return formArrayValid ? null : { duplicate: { value: duplicateProperties } };

  }
};
