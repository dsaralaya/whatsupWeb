import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CrudeService } from 'src/app/shared/service/crud.service';
import { ConfirmDialogService } from 'src/app/shared/service/confirm-dialog.service';
import { NotificationService } from 'src/app/shared/service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  submitted = false;
  edit = false;

  constructor(
    private crudeService: CrudeService,
    private confirmDialogService: ConfirmDialogService,
    private notificationSvc: NotificationService
  ) {
  }

  ngOnInit() {
    this.generateForm();
    this.getSettings();
  }

  generateForm() {
    this.settingsForm = new FormGroup({
      client_id: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      secret: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      device_id: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur'
      })
    });
  }

  getSettings() {
    const params = 'settings/get';
    this.crudeService.get(params).subscribe(res => {
        this.settingsForm.patchValue(res.data);
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.settingsForm.valid) {
        this.crudeService
          .create(
            'settings/update',
            this.settingsForm.value
          )
          .subscribe((res: any) => {
              this.notificationSvc.success('Nice', 'Settings updated successfully');
              this.edit = false;
              this.getSettings();
          });
      }
  }
  }
