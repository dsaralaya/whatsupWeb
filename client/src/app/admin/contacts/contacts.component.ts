import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CrudeService } from 'src/app/shared/service/crud.service';
import { ConfirmDialogService } from 'src/app/shared/service/confirm-dialog.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { ButtonRendererComponent } from 'src/app/shared/component/button-renderer.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  submitted = false;
  edit = false;
  isNew = false;
  active = false;
  frameworkComponents: any;

  columnDefs = [
    {headerName: 'Contact Name', field: 'name', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 380  },
    {headerName: 'Contact Number', field: 'number', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 380 },
    {
      headerName: 'Action',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onEdit: this.gridEdit.bind(this),
        onDelete: this.gridRemove.bind(this)
      }
    }
  ];
  rowData = [];

  constructor(
    private crudeService: CrudeService,
    private confirmDialogService: ConfirmDialogService,
    private notificationSvc: NotificationService
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent
    };
  }

  ngOnInit() {
    this.generateForm();
    this.getContacts();
  }

  generateForm() {
    this.contactForm = new FormGroup({
      _id: new FormControl(''),
      name: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
      number: new FormControl('', { validators: [Validators.required], updateOn: 'blur' })
    });
  }

  getContacts() {
    const params = 'contact/list'; // `page=${currentPage}`;
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
    if (this.contactForm.valid) {
      if (!this.contactForm.value._id) {
          this.crudeService
          .create('contact/add', this.contactForm.value)
          .subscribe((res: any) => {
            if (res.statusCode === '200') {
              this.notificationSvc.success('Nice', 'Contact added successfully');
              this.getContacts();
              this.reset();
            } else {
              this.notificationSvc.error('Failure', 'Contact addition failed !');
              this.reset();
            }
          });
      } else {
          this.crudeService
          .update(
            'contact/update',
            this.contactForm.value._id,
            this.contactForm.value
          )
          .subscribe((res: any) => {
            if (res.statusCode === '200') {
              this.notificationSvc.success('Nice', 'Contact updated successfully');
              this.getContacts();
              this.reset();
            } else {
              this.notificationSvc.error('Failure', 'Contact updation failed !');
              this.reset();
            }
          });
        } 
      }
    }

  gridEdit(dataItem) {
    this.edit = true;
    this.contactForm.patchValue(dataItem);
    this.isNew = false;
  }

  gridRemove(dataItem) {
    const context = this;
    this.confirmDialogService.confirmThis(
      'Are you sure to delete?',
      () => {
        context.crudeService.delete('contact/remove', dataItem._id).subscribe(data => {
          context.notificationSvc.success(
            'Info',
            'Contact deleted successfully'
          );
          context.getContacts();
        });
      },
      () => {}
    );
  }

  reset() {
    this.submitted = false;
    this.contactForm.reset();
    this.edit = false;
  }

}
