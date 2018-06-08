
import { Component, OnInit } from '@angular/core';
import { IDynamicComponentModalConfig, PoiSelectors } from 'subrepos/gtrack-common-ngx';
import { IComparedProperty } from 'app/shared/interfaces';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-merge-gtrack-poi-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
})
export class HikeEditMergeGTrackPoiComponent implements OnInit {
  public static componentName = 'HikeEditMergeGTrackPoiComponent';
  public modalConfig: IDynamicComponentModalConfig;
  public conflicts: IComparedProperty;
  public mergeForm: FormGroup;
  private _saveCallback: any;

  ngOnInit() {
    if (this.modalConfig && this.modalConfig.component.data) {
      this.conflicts = this.modalConfig.component.data.conflicts;
      this._saveCallback = this.modalConfig.component.data.saveCallback;

      // Create form
      let _controls = {};
      _.forEach(this.conflicts, (values: any, key: string) => {
        _controls[key] = new FormControl(values[0]);
      });
      this.mergeForm = new FormGroup (_controls);
    }
  }

  public saveMerge() {
    this._saveCallback(this.mergeForm.value);
    this.modalConfig.modal.close();
  }
}
