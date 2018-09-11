
import { Component, OnInit, Input } from '@angular/core';
import { IComparedProperty } from '../../../../../shared/interfaces';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-hike-edit-merge-gtrack-poi-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
})
export class HikeEditMergeGTrackPoiComponent implements OnInit {
  @Input() conflicts: IComparedProperty;
  @Input() saveCallback: any;
  public mergeForm: FormGroup;

  ngOnInit() {
    // Create form
    let _controls = {};
    _.forEach(this.conflicts, (values: any, key: string) => {
      _controls[key] = new FormControl(values[0]);
    });

    this.mergeForm = new FormGroup(_controls);
  }

  public saveMerge() {
    this.saveCallback(this.mergeForm.value);
  }
}
