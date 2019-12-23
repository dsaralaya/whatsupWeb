import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
    <i (click)="onEdit($event)" class="fas fa-lg fa-edit"></i> &nbsp; &nbsp;
    <i (click)="onDelete($event)" class="fas fa-lg fa-trash-alt"></i>
    `
})

export class ButtonRendererComponent implements ICellRendererAngularComp {

  params;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onEdit($event) {
    if (this.params.onEdit instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      };
      this.params.onEdit(params.rowData);

    }
  }

  onDelete($event) {
    if (this.params.onDelete instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      };
      this.params.onDelete(params.rowData);

    }
  }
}
