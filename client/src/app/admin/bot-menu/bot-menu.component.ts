import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CrudeService } from 'src/app/shared/service/crud.service';
import { ConfirmDialogService } from 'src/app/shared/service/confirm-dialog.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { pickList } from 'src/app/shared/model/picklist';

@Component({
  selector: 'app-register',
  templateUrl: './bot-menu.component.html',
  styleUrls: ['./bot-menu.component.scss']
})
export class BotMenuComponent implements OnInit {
  botMenuForm: FormGroup;
  submitted = false;
  edit = false;
  isNew = false;
  active = false;

  columnDefs = [
    {headerName: 'Menu Id', field: 'menuId', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 125  },
    {headerName: 'Menu Type', field: 'menuType', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 140 },
    // {headerName: 'Msg Text', field: 'text', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 100 },
    {headerName: 'Option 1', field: 'option1', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 120},
    {headerName: 'Option 2', field: 'option2', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 120},
    {headerName: 'Option 3', field: 'option3', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 120},
    {headerName: 'Option 4', field: 'option4', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 120},
    {headerName: 'Option 5', field: 'option5', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 120}
  ];
  rowData = [];

  menuType = pickList.menuList;

  constructor(
    private crudeService: CrudeService,
    private confirmDialogService: ConfirmDialogService,
    private notificationSvc: NotificationService
  ) {}

  ngOnInit() {
    this.generateForm();
    this.getBotMenus();
  }

  generateForm() {
    this.botMenuForm = new FormGroup({
      menuId: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
      menuType: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
      image: new FormControl('', { updateOn: 'blur' }),
      text: new FormControl('', { updateOn: 'blur' }),
      option1: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
      option2: new FormControl('', { updateOn: 'blur' }),
      option3: new FormControl('', { updateOn: 'blur' }),
      option4: new FormControl('', { updateOn: 'blur' }),
      option5: new FormControl('', { updateOn: 'blur' })
    });
  }

  getBotMenus() {
    const params = 'menu/list'; // `page=${currentPage}`;
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
    if (this.botMenuForm.valid) {
      if (!this.botMenuForm.value.id) {
        this.crudeService
          .create('menu/add', this.botMenuForm.value)
          .subscribe((res: any) => {
            if (res.statusCode === '200') {
              this.notificationSvc.success('Nice', 'Bot Menu added successfully');
              this.getBotMenus();
              this.reset();
            } else {
              this.notificationSvc.error('Failure', 'Bot Menu addition failed !');
              this.reset();
            }
          });
      } else {
        this.crudeService
          .update(
            'menu/update',
            this.botMenuForm.value.id,
            this.botMenuForm.value
          )
          .subscribe((res: any) => {
            if (res.statusCode === '200') {
              this.notificationSvc.success('Nice', 'Bot Menu updated successfully');
              this.getBotMenus();
              this.reset();
            } else {
              this.notificationSvc.error('Failure', 'Bot Menu updation failed !');
              this.reset();
            }
          });
      }
    }
  }

  gridEdit(dataItem) {
    this.edit = true;
    this.botMenuForm.patchValue(dataItem);
    this.isNew = false;
  }

  gridRemove(dataItem) {
    const context = this;
    this.confirmDialogService.confirmThis(
      'Are you sure to delete?',
      () => {
        context.crudeService.delete('menu/remove', dataItem.id).subscribe(data => {
          context.notificationSvc.success(
            'info',
            'Bot Menu deleted successfully'
          );
          context.getBotMenus();
        });
      },
      () => {}
    );
  }

  reset() {
    this.submitted = false;
    this.botMenuForm.reset();
    this.edit = false;
  }

}
