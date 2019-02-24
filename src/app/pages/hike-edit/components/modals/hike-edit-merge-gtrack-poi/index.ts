import _forEach from 'lodash-es/forEach';

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ComparedProperty } from '../../../../../shared/interfaces';

@Component({
  selector: 'app-hike-edit-merge-gtrack-poi-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditMergeGTrackPoiComponent implements OnInit {
  @Input() conflicts: ComparedProperty;
  @Input() saveCallback: any;
  mergeForm: FormGroup;

  ngOnInit(): void {
    // Create form
    const _controls = {};
    _forEach(this.conflicts, (values: any, key: string) => {
      _controls[key] = new FormControl(values[0]);
    });

    this.mergeForm = new FormGroup(_controls);
  }

  saveMerge(): void {
    this.saveCallback(this.mergeForm.value);
  }

  trackByFn(index: number): number {
    return index;
  }
}
