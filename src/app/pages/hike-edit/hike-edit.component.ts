import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, GtActions } from '../../store';
import { ActivatedRoute } from '@angular/router';
import { HikeDataService, HikeDataSource } from '../../shared/services';
import { IHikeElement } from '../../shared/interfaces';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'gt-hike-edit',
    templateUrl: './hike-edit.component.html',
    styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy {
    private _routeSubscription: Subscription;
    hikeData: IHikeElement;
    existingLangKeys: Set<string>;
    langs = {
        'en_US': 'English (US)',
        'hu_HU': 'Hungarian',
        'de_DE': 'German',
        'fr_FR': 'French',
        'it_IT': 'Italian',
    };
    selLang: string;

    constructor(
        private _store: Store<State>,
        private _route: ActivatedRoute,
        private _hikeDataService: HikeDataService
    ) {}

    ngOnInit() {
        this._routeSubscription = this._route.params.subscribe(params => {
            this.hikeData = this._hikeDataService.getHike(params.id);
            this.hikeData = this._hikeDataService.getHike(params.id);

            // Get filled lang keys
            this.existingLangKeys = new Set([
                ...Object.keys(this.hikeData.title),
                ...Object.keys(this.hikeData.description)
            ]);
        });
    }

    ngOnDestroy() {
        this._routeSubscription.unsubscribe();
    }

    addTranslation() {
        this.hikeData.title[this.selLang] = '';
        this.hikeData.description[this.selLang] = '';
        this.existingLangKeys.add(this.selLang);
    }

    save() {
        this._store.dispatch(new GtActions.SaveHikeAction(this.hikeData));
    }
}
