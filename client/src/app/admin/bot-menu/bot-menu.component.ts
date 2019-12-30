import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CrudeService } from 'src/app/shared/service/crud.service';
import { ConfirmDialogService } from 'src/app/shared/service/confirm-dialog.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { pickList } from 'src/app/shared/model/picklist';
import { ButtonRendererComponent } from 'src/app/shared/component/button-renderer.component';
import { configuation } from '../../shared/config';

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
  frameworkComponents: any;
  imageFile: any;
  localUrl = '';
  imagesList = [];
  localFileUrl = '';

  endBotReplyType = [
    { name : 'Yes', value: 'yes'},
    { name : 'No', value: 'no'}
  ];

  columnDefs = [
    {headerName: 'Menu Id', field: 'menuId', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 125  },
    {headerName: 'Menu Type', field: 'menuType', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 140 },
    // {headerName: 'Msg Text', field: 'text', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 100 },
    {headerName: 'Option 1', field: 'option1', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 120},
    {headerName: 'Option 2', field: 'option2', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 120},
    {headerName: 'Option 3', field: 'option3', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 120},
    {headerName: 'Option 4', field: 'option4', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 120},
    {headerName: 'Option 5', field: 'option5', filter: 'agTextColumnFilter', filterParams: { clearButton: true }, width: 120},
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

  menuType = pickList.menuList;

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
    this.getBotMenus();
  }

  generateForm() {
    this.botMenuForm = new FormGroup({
      _id: new FormControl(''),
      menuId: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
      menuType: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
      file: new FormControl('', { updateOn: 'blur' }),
      text: new FormControl('', { updateOn: 'blur' }),
      option1: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
      option2: new FormControl('', { updateOn: 'blur' }),
      option3: new FormControl('', { updateOn: 'blur' }),
      option4: new FormControl('', { updateOn: 'blur' }),
      option5: new FormControl('', { updateOn: 'blur' }),
      endBotReply: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
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
      const formData = new FormData();
      formData.append('menuId', this.botMenuForm.value.menuId);
      formData.append('menuType', this.botMenuForm.value.menuType);
      if (this.botMenuForm.value.file !== null) {
        for (const singleFile of this.botMenuForm.value.file) {
          formData.append('file[]', singleFile, singleFile.name);
        }
      }
      // formData.append('files[]', this.botMenuForm.value.file);
      formData.append('text', this.botMenuForm.value.text === null ? '' : this.botMenuForm.value.text);
      formData.append('option1', this.botMenuForm.value.option1);
      formData.append('option2', this.botMenuForm.value.option2 === null ? '' : this.botMenuForm.value.option2);
      formData.append('option3', this.botMenuForm.value.option3 === null ? '' : this.botMenuForm.value.option3);
      formData.append('option4', this.botMenuForm.value.option4 === null ? '' : this.botMenuForm.value.option4);
      formData.append('option5', this.botMenuForm.value.option5 === null ? '' : this.botMenuForm.value.option5);
      if (!this.botMenuForm.value._id) {
        if (this.botMenuForm.value.file !== null) {
        this.crudeService
          .createWithHeader('menu/add', formData)
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
        }
      } else {
        if (typeof(this.botMenuForm.value.file) !== 'object') {
          this.crudeService
          .update(
            'menu/update',
            this.botMenuForm.value._id,
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
        } else {
          this.crudeService
          .updateWithHeader(
            'menu/update',
            this.botMenuForm.value._id,
            formData
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
  }

  gridEdit(dataItem) {
    this.imagesList = [];
    if (dataItem.file) {
      const fileNameList = dataItem.file.split(',');
      fileNameList.forEach(fname => {
        this.imagesList.push(fname);
      });
      this.localUrl = configuation.url + 'menuImages/';
    }
    this.localFileUrl = null;
    this.edit = true;
    this.botMenuForm.patchValue(dataItem);
    this.isNew = false;
  }

  gridRemove(dataItem) {
    const context = this;
    this.confirmDialogService.confirmThis(
      'Are you sure to delete?',
      () => {
        context.crudeService.delete('menu/remove', dataItem._id).subscribe(data => {
          context.notificationSvc.success(
            'Info',
            'Bot Menu deleted successfully'
          );
          context.getBotMenus();
        });
      },
      () => {}
    );
  }

  onMenuTypeChanged(event) {
    this.localUrl = '';
    this.botMenuForm.controls.text.setValue('');
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
       this.imagesList = [];
       this.localFileUrl = '';
       const fileList = event.target.files;
       this.botMenuForm.controls.file.setValue(fileList);
       // tslint:disable-next-line: prefer-for-of
       for (let i = 0; i < event.target.files.length; i++) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.imagesList.push(event.target.result);
      };
        reader.readAsDataURL(event.target.files[i]);
      }
      //  event.target.files.forEach(file => {
      //   reader.readAsDataURL(file.name);
      // });
    }
  }

  reset() {
    this.submitted = false;
    this.botMenuForm.reset();
    this.edit = false;
  }

}
