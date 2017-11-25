import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, ApplicationRef, ViewEncapsulation } from '@angular/core';
import { removeNgStyles, createNewHosts, createInputTransfer, bootloader } from '@angularclass/hmr';

import { AppComponent } from './app/app.component';
import { AppStore } from './app/app-store';
import { AppModule } from './app/app.module';

// Vendors
import 'hammerjs';
/*
import * as Popper from '../node_modules/popper.js/dist/umd/popper.min.js';
(<any>window).Popper = Popper;
*/
import 'bootstrap';
import 'bootstrap-material-design';
import * as Spinner from '../node_modules/spin.js/spin.js';
(<any>window).Spinner = Spinner;

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppModule
    ],
    providers: [
        AppStore
    ]
})
class MainModule {
    constructor(public appRef: ApplicationRef, public appStore: AppStore) {}

    hmrOnInit(store: any) {
        if (!store || !store.state) { return; }
        console.log('HMR store', JSON.stringify(store, null, 2));
        // restore state
        this.appStore.setState(store.state);
        // restore input values
        if ('restoreInputValues' in store) { store.restoreInputValues(); }
        this.appRef.tick();
        Object.keys(store).forEach(prop => delete store[prop]);
    }

    hmrOnDestroy(store: any) {
        const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        const currentState = this.appStore.getState();
        store.state = currentState;
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues  = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    hmrAfterDestroy(store: any) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}

export function main() {
    return platformBrowserDynamic().bootstrapModule(MainModule, [
        {
            defaultEncapsulation: ViewEncapsulation.None
        }
    ]);
}

// boot on document ready
bootloader(main);
