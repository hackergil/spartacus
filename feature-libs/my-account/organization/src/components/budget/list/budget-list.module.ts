import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule, OrganizationModule, UrlModule } from '@spartacus/core';
import {
  IconModule,
  OutletRefModule,
  PaginationModule,
  SplitViewModule,
  TableModule,
} from '@spartacus/storefront';
import { BudgetListComponent } from './budget-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    OrganizationModule,

    // shared
    TableModule,
    SplitViewModule,
    IconModule,
    UrlModule,
    I18nModule,
    OutletRefModule,

    PaginationModule,
  ],
  declarations: [BudgetListComponent],
})
export class BudgetListModule {}
