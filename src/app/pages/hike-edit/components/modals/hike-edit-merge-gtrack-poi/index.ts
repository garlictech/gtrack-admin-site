
import { Component, OnInit, Input } from '@angular/core';
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
  @Input() conflicts: IComparedProperty;
  @Input() saveCallback: any;
  @Input() closeCallback: any;
  public mergeForm: FormGroup;
  public initialized = false;

  ngOnInit() {
    // Create form
    let _controls = {};
    _.forEach(this.conflicts, (values: any, key: string) => {
      _controls[key] = new FormControl(values[0]);
    });

    this.mergeForm = new FormGroup(_controls);
    this.initialized = true;
  }

  public saveMerge() {
    this.saveCallback(this.mergeForm.value);
  }
}
