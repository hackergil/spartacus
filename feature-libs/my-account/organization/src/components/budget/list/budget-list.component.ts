import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PaginationModel, RoutingService, RouterState } from '@spartacus/core';
import { Table } from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { BudgetListService } from './budget-list.service';
import { map } from 'rxjs/operators';

const BASE_CLASS = 'organization';

@Component({
  selector: 'cx-budget-list',
  templateUrl: './budget-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetListComponent implements OnInit, OnDestroy {
  @HostBinding('class') hostClass = BASE_CLASS;

  dataTable$: Observable<Table> = this.budgetService.getTable();

  subscription = new Subscription();

  //TODO: it's workaround for allowing styling views, since we can't get any real selector to setup --cx-max-views: 1;
  lastPath$ = this.routingService
    .getRouterState()
    .pipe(
      map((state: RouterState) =>
        state.state?.url.split('/').reverse()[0].split('?').shift()
      )
    );

  constructor(
    protected budgetService: BudgetListService,
    protected routingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.lastPath$.subscribe(
        (path) => (this.hostClass = `${BASE_CLASS} ${path}`)
      )
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Paginates the budget list. Pagination is not using query parameters, as we like
   * pagination to be driven by infinite scrolling going forward.
   */
  viewPage(pagination: PaginationModel, currentPage: number): void {
    this.budgetService.viewPage(pagination, currentPage);
  }

  /**
   * Sort the list. The pagination is reset to the first page.
   *
   * TODO: consider query parameter for sorting.
   */
  sort(pagination: PaginationModel, sort: string) {
    this.budgetService.sort(pagination, sort);
  }
}