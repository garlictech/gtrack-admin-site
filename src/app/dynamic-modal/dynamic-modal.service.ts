import {
  Injectable, ComponentRef, ApplicationRef, ElementRef, Injector, ComponentFactoryResolver
} from '@angular/core';
import { ComponentModalComponent } from './component-modal/component-modal.component';
import { IDynamicComponentModalConfig } from './dynamic-modal.interface';

import * as _ from 'lodash';

@Injectable()
export class DynamicModalService {
  private _modalRefList: ComponentRef<ComponentModalComponent>[] = [];
  private _modalContainer: ElementRef;

  constructor(
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private _resolver: ComponentFactoryResolver
  ) { }

  public registerModalContainer(container: ElementRef) {
    this._modalContainer = container;
  }

  public showComponentModal(config: any) {
    const compFactory = this._resolver.resolveComponentFactory(ComponentModalComponent);
    const modalRef: ComponentRef<ComponentModalComponent> = compFactory.create(this._injector);

    this._modalRefList.push(modalRef);
    this._appRef.attachView(modalRef.hostView);

    // Initialize data in modal
    // Config object can overwrite the initial settings
    const modalConfig: IDynamicComponentModalConfig = _.merge({
      // Default values
      modal: {
        destroy: () => {
          modalRef.destroy();
        }
      }
    }, config);

    modalRef.instance.init(modalConfig);
    modalRef.onDestroy(() => this._removeModalRef(modalRef));

    // Move the modal to the root container
    this._modalContainer.nativeElement.appendChild(modalRef.location.nativeElement);

    // Show modal
    modalRef.instance.show();
  }

  private _removeModalRef(modalRef) {
    const index: number = this._modalRefList.indexOf(modalRef);
    if (index !== -1) {
      this._modalRefList.splice(index, 1);
    }
    this._appRef.detachView(modalRef.hostView);
  }
}
