import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CrudeService } from 'src/app/shared/service/crud.service';
import { ConfirmDialogService } from 'src/app/shared/service/confirm-dialog.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { pickList } from 'src/app/shared/model/picklist';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  edit = false;
  isNew = false;
  active = false;

  columnDefs = [
    { headerName: 'Name', field: 'name', filter: 'agTextColumnFilter', filterParams: { clearButton: true } },
    { headerName: 'Email', field: 'email', filter: 'agTextColumnFilter', filterParams: { clearButton: true } },
    { headerName: 'Role', field: 'userRole', filter: 'agTextColumnFilter', filterParams: { clearButton: true } },
    { headerName: 'Assigned Chat Count', field: 'assignedChatCount', filter: 'agTextColumnFilter', filterParams: { clearButton: true } },
    { headerName: 'Status', field: 'status', filter: 'agTextColumnFilter', filterParams: { clearButton: true } }
  ];
  rowData = [];

  roleType = pickList.roleList;
  statusType = pickList.status;

  constructor(
    private crudeService: CrudeService,
    private confirmDialogService: ConfirmDialogService,
    private notificationSvc: NotificationService
  ) {}

  ngOnInit() {
    this.generateForm();
    this.getUsers();
  }

  generateForm() {
    this.registerForm = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur'
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      userRole: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      status: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      assignedChatCount: new FormControl(0)
    });
  }

  getUsers(currentPage = 1) {
    const params = 'register/list'; // `page=${currentPage}`;
    this.crudeService.get(params).subscribe(res => {
      if (res.statusCode === '200') {
        this.rowData = res.data;
      } else {
        this.rowData = [];
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      if (!this.registerForm.value.id) {
        this.crudeService
          .create('register/add', this.registerForm.value)
          .subscribe((res: any) => {
            if (res.statusCode === '200') {
              this.notificationSvc.success('Nice', 'User added successfully');
              this.getUsers();
              this.reset();
            } else {
              this.notificationSvc.error('Failure', 'User addition failed !');
              this.reset();
            }
          });
      } else {
        this.crudeService
          .update(
            'register/update',
            this.registerForm.value.id,
            this.registerForm.value
          )
          .subscribe((res: any) => {
            if (res.statusCode === '200') {
              this.notificationSvc.success('Nice', 'User updated successfully');
              this.getUsers();
              this.reset();
            } else {
              this.notificationSvc.error('Failure', 'User updation failed !');
              this.reset();
            }
          });
      }
    }
  }

  gridEdit(dataItem) {
    this.edit = true;
    this.registerForm.patchValue(dataItem);
    this.isNew = false;
  }

  gridRemove(dataItem) {
    const context = this;
    this.confirmDialogService.confirmThis(
      'Are you sure to delete?',
      () => {
        context.crudeService.delete('register/remove', dataItem.id).subscribe(data => {
          context.notificationSvc.success(
            'info',
            'User deleted successfully'
          );
          context.getUsers();
        });
      },
      () => {}
    );
  }

  reset() {
    this.submitted = false;
    this.registerForm.reset();
    this.edit = false;
  }
}
