import {
  Component, ViewChild, Type, ElementRef, ComponentRef, ComponentFactoryResolver,
  Injector, ApplicationRef
} from '@angular/core';
import { IDynamicComponentModalConfig } from '../dynamic-modal.interface';
import * as _ from 'lodash';
import { ComponentFactory } from '@angular/core/src/linker/component_factory';

@Component({
  selector: 'gt-component-modal',
  templateUrl: './component-modal.component.html',
  styleUrls: ['./component-modal.component.scss']
})

export class ComponentModalComponent {
  @ViewChild('modalBody') modalBody: ElementRef;
  public visible = false;
  public visibleAnimate = false;
  public modalConfig: IDynamicComponentModalConfig;
  private _compRef: ComponentRef<any>;

  constructor(
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private _resolver: ComponentFactoryResolver
  ) {}

  init(config) {
    this.modalConfig = config;

    if (this._compRef) {
      this._compRef.destroy();
    }

    if (this.modalConfig.component.name) {
      const factories = Array.from((<any>this._resolver)._factories.keys());
      const factoryClass = <Type<any>>factories.find((x: any) => {
        return x.name === this.modalConfig.component.name;
      });

      if (factoryClass === null) {
        console.log(`ERROR: factoryClass for component name ${this.modalConfig.component.name} not found.`);
      }
      const compFactory = this._resolver.resolveComponentFactory(factoryClass);
      this._compRef = compFactory.create(this._injector);

      // Pass params to the loaded component
      this._compRef.instance.modalConfig = _.merge({
        modal: {
          close: () => {
            this.close();
          }
        }
      }, this.modalConfig);

      this._appRef.attachView(this._compRef.hostView);
      this._compRef.onDestroy(() => {
        this._appRef.detachView(this._compRef.hostView);
      });
      this.modalBody.nativeElement.appendChild(this._compRef.location.nativeElement);

    }
  }

  public show(): void {
    this.visible = true;

    setTimeout(() => {
      this.visibleAnimate = true;
    }, 100);
  }

  public close(): void {
    this.visibleAnimate = false;

    setTimeout(() => {
      this.visible = false;
      this.modalConfig.modal.destroy();
    }, 300);
  }
}
