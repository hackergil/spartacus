import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RoutingService, UserGroupService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserGroupFormService } from '../form/user-group-form.service';
import { FormUtils } from '@spartacus/storefront';

@Component({
  selector: 'cx-user-group-create',
  templateUrl: './user-group-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGroupCreateComponent {
  // It would be nice to replace this query param approach with a session service that
  // provides a generic approach for session-interests, so that we can autofill forms, without
  // changing the URL. This can keep the current language, currency, parent unit, cost center, user, etc.
  protected parentUnit$: Observable<
    string
  > = this.routingService
    .getRouterState()
    .pipe(map((routingData) => routingData.state.queryParams?.['parentUnit']));

  form$: Observable<FormGroup> = this.parentUnit$.pipe(
    map((parentUnit: string) =>
      this.userGroupFormService.getForm({ orgUnit: { uid: parentUnit } })
    )
  );

  constructor(
    protected userGroupService: UserGroupService,
    protected userGroupFormService: UserGroupFormService,
    protected routingService: RoutingService
  ) {}

  save(form: FormGroup): void {
    if (form.invalid) {
      form.markAllAsTouched();
      FormUtils.deepUpdateValueAndValidity(form);
    } else {
      form.disable();
      this.userGroupService.create(form.value);

      this.routingService.go({
        cxRoute: 'userGroupDetails',
        params: form.value,
      });
    }
  }
}