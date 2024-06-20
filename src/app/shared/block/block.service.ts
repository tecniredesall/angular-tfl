import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { BlockUiComponent } from './block.component';
import { BlockModalUiComponent } from './block-modal.component';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  componentRef: any[];
  blockUiComponentClass = BlockUiComponent;
  blockModalUiComponentClass = BlockModalUiComponent;

  constructor(
    private resolver: ComponentFactoryResolver
  ) {
    this.componentRef = [];
  }

  start(entry, name) {
    const factory = this.resolver.resolveComponentFactory(this.blockUiComponentClass);
    if (entry) {
      const entryIndex = entry.createComponent(factory);
      this.componentRef.push({ entryIndex, name });
    }
  }

  startModal(entry, name) {
    const factory = this.resolver.resolveComponentFactory(this.blockModalUiComponentClass);
    if (entry) {
      const entryIndex = entry.createComponent(factory);
      this.componentRef.push({ entryIndex, name });
    }
  }

  stop(name) {
    this.componentRef.map(c => {
      if (c.name === name) {
        c.entryIndex.destroy();
      }
    });
  }
}

// export function LoaderEnabled(entry) {
//   return function(target: any, key: string, descriptor: PropertyDescriptor) {
//     let blockService: BlockService;

//     const original = descriptor.value;

//     descriptor.value = function() {
//       blockService.start(entry);
//       return original.apply(this, arguments)
//       .pipe(
//         map((res) => {
//           blockService.stop();
//           return res;
//         }),
//         catchError((err) => {
//           blockService.stop();
//           throw err;
//         })
//       );
//     }

//     return descriptor;
//   }
// }
