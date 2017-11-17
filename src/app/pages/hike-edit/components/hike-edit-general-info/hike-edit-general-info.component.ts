
import { Component, Input, OnInit } from '@angular/core';

// TODO: load from config?
const LANGS = {
  en_US: 'English (US)',
  hu_HU: 'Hungarian',
  de_DE: 'German',
  fr_FR: 'French',
  it_IT: 'Italian'
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
  public selLang: string = null;

  ngOnInit() {
    this.existingLangKeys = new Set([
      ...Object.keys((this.hikeData.title || {})),
      ...Object.keys((this.hikeData.description || {}))
    ]);
  }

  public addTranslation() {
    if (this.selLang) {
      this.hikeData.title[this.selLang] = '';
      this.hikeData.description[this.selLang] = '';
      this.hikeData.summary[this.selLang] = '';

      this.existingLangKeys.add(this.selLang);

      this.selLang = null;
    }
  }
}
