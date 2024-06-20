export interface ISealImage{
  src: string;
  file: File;
}

export class SealImage implements ISealImage {
  public src: string = null;
  public file: File = null;
  constructor(control: Partial<SealImage> = {}) {
    Object.assign(this, control);
  }
}
