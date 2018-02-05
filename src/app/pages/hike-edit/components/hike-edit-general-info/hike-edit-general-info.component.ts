
import { Component, Input, OnInit } from '@angular/core';

// TODO: load from config?
const LANGS = {
  en: 'English',
  hu: 'Hungarian',
  de: 'German',
  fr: 'French',
  it: 'Italian'
};

@Component({
  selector: 'gt-hike-edit-general-info',
  templateUrl: './hike-edit-general-info.component.html',
  styleUrls: ['./hike-edit-general-info.component.scss']
})
export class HikeEditGeneralInfoComponent implements OnInit {
  @Input() hikeData: any;
  public existingLangKeys: Set<string>;
  public langs = LANGS;
  public selLang = '';

  ngOnInit() {
    this.existingLangKeys = new Set([
      ...Object.keys((this.hikeData.description || {}))
    ]);
  }

  public addTranslation() {
    if (this.selLang) {
      this.hikeData.description[this.selLang] = {
        name: '',
        full: '',
        summary: ''
      }
      this.existingLangKeys.add(this.selLang);
      this.selLang = '';
    }
  }
}
