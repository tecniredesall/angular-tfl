/* tslint:disable:no-unused-variable */

import { SafePipe } from './safe.pipe';

describe('Pipe: Safee', () => {
  it('create an instance', () => {
    const pipe = new SafePipe(null);
    expect(pipe).toBeTruthy();
  });
});
