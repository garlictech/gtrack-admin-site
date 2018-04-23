import {
  Component,
  Input,
  Provider,
  forwardRef,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractValueAccessor } from '../abstract-value-accessor';
import { DebugLog, log } from 'app/log';
import { AwsFormdataService } from '../aws-formdata-service';
import { XhrFileUpload } from '../xhr-file-upload';
import { environment } from 'environments/environment';
import { AuthenticationSelectors, AuthenticationActions } from 'subrepos/gtrack-common-ngx';
import { State } from 'app/store';
import { Store } from '@ngrx/store';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable no-forward-ref
  useExisting: forwardRef(() => FileUploadComponent),
  // tslint:enable no-forward-ref
  multi: true
};

@Component({
  selector: 'app-form-file-upload',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent extends AbstractValueAccessor implements OnDestroy, OnInit {
  @Input() fileId: string;
  @Input() type: string;
  private thumbnailUrl: string;
  private file: File;
  private uploading: boolean;
  private uploadSubscription: any;
  private uploadedFileName;
  private userId$: Observable<string>;
  private progress: number;

  constructor(
    private _xhrFileUpload: XhrFileUpload,
    private _authSelectors: AuthenticationSelectors.Selectors,
    private _store: Store<State>,
    private _cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.userId$ = this._store
      .select(this._authSelectors.user)
      .filter(function(user) {
        return !!user;
      })
      .pluck('id');
  }

  onChangeInternal(event) {
    this.uploading = true;
    const files = event.target.files;
    this.file = files[0];
    // if (this.file) {
    //   this.uploadSubscription = this.upload().subscribe(
    //     res => {
    //       this.onChange(this.uploadedFileName);
    //       this.value = this.thumbnailUrl = this.uploadedFileName;
    //       this.uploading = false;
    //       this._cdr.detectChanges();
    //     },
    //     err => {
    //       this.value = 'error';
    //       this.onChange('error');
    //       this.uploading = false;
    //       this._cdr.detectChanges();
    //     }
    //   );
    // }
  }

  upload() {
    // this.progress = 0;
    // this.uploadedFileName = '';
    // return this.userId$.first().switchMap(userId => {
    //   return this._awsFormdataService.buildPayload(this.file, userId).switchMap(formData => {
    //     this.uploadedFileName = environment.awsConfig.timeline + formData.get('key');
    //     return this._xhrFileUpload.upload(environment.awsConfig.timeline, formData, progress => {
    //       this.progress = progress;
    //       this._cdr.detectChanges();
    //     });
    //   });
    // });
  }

  generateBackground() {
    return `linear-gradient(90deg, red 0%, red ${this.progress}%, #fff ${this.progress + 1}%, #fff ${100 -
      this.progress}%`;
  }

  ngOnDestroy() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }
}
