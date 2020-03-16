import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { B2BApprovalProcess, B2BUnitNode } from '../../../model/org-unit.model';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { OrgUnitConnector } from '../../connectors/org-unit/org-unit.connector';
import { OrgUnitActions } from '../actions/index';

@Injectable()
export class OrgUnitEffects {
  @Effect()
  loadOrgUnit$: Observable<
    OrgUnitActions.LoadOrgUnitSuccess | OrgUnitActions.LoadOrgUnitFail
  > = this.actions$.pipe(
    ofType(OrgUnitActions.LOAD_ORG_UNIT),
    map((action: OrgUnitActions.LoadOrgUnit) => action.payload),
    switchMap(({ userId, orgUnitId }) => {
      return this.orgUnitConnector.get(userId, orgUnitId).pipe(
        map(
          (orgUnit: B2BUnitNode) =>
            new OrgUnitActions.LoadOrgUnitSuccess([orgUnit])
        ),
        catchError(error =>
          of(
            new OrgUnitActions.LoadOrgUnitFail({
              orgUnitId,
              error: makeErrorSerializable(error),
            })
          )
        )
      );
    })
  );

  @Effect()
  loadAvailableOrgUnits$: Observable<
    OrgUnitActions.LoadOrgUnitNodesSuccess | OrgUnitActions.LoadOrgUnitNodesFail
  > = this.actions$.pipe(
    ofType(OrgUnitActions.LOAD_UNIT_NODES),
    map((action: OrgUnitActions.LoadOrgUnitNodes) => action.payload),
    switchMap(payload =>
      this.orgUnitConnector.getList(payload.userId).pipe(
        map(
          (orgUnitsList: B2BUnitNode[]) =>
            new OrgUnitActions.LoadOrgUnitNodesSuccess(orgUnitsList)
        ),
        catchError(error =>
          of(
            new OrgUnitActions.LoadOrgUnitNodesFail({
              error: makeErrorSerializable(error),
            })
          )
        )
      )
    )
  );

  @Effect()
  createUnit$: Observable<
    OrgUnitActions.CreateUnitSuccess | OrgUnitActions.CreateUnitFail
  > = this.actions$.pipe(
    ofType(OrgUnitActions.CREATE_ORG_UNIT),
    map((action: OrgUnitActions.CreateUnit) => action.payload),
    switchMap(payload =>
      this.orgUnitConnector.create(payload.userId, payload.unit).pipe(
        map(data => new OrgUnitActions.CreateUnitSuccess(data)),
        catchError(error =>
          of(
            new OrgUnitActions.CreateUnitFail({
              unitCode: payload.unit.uid,
              error: makeErrorSerializable(error),
            })
          )
        )
      )
    )
  );

  @Effect()
  updateUnit$: Observable<
    OrgUnitActions.UpdateUnitSuccess | OrgUnitActions.UpdateUnitFail
  > = this.actions$.pipe(
    ofType(OrgUnitActions.UPDATE_ORG_UNIT),
    map((action: OrgUnitActions.UpdateUnit) => action.payload),
    switchMap(payload =>
      this.orgUnitConnector
        .update(payload.userId, payload.unitCode, payload.unit)
        .pipe(
          map(data => new OrgUnitActions.UpdateUnitSuccess(data)),
          catchError(error =>
            of(
              new OrgUnitActions.UpdateUnitFail({
                unitCode: payload.unit.uid,
                error: makeErrorSerializable(error),
              })
            )
          )
        )
    )
  );

  @Effect()
  loadTree$: Observable<
    OrgUnitActions.LoadTreeSuccess | OrgUnitActions.LoadTreeFail
  > = this.actions$.pipe(
    ofType(OrgUnitActions.LOAD_UNIT_TREE),
    map((action: OrgUnitActions.LoadOrgUnit) => action.payload),
    switchMap(({ userId }) => {
      return this.orgUnitConnector.getTree(userId).pipe(
        map(
          (orgUnit: B2BUnitNode) => new OrgUnitActions.LoadTreeSuccess(orgUnit)
        ),
        catchError(error =>
          of(
            new OrgUnitActions.LoadTreeFail({
              error: makeErrorSerializable(error),
            })
          )
        )
      );
    })
  );

  @Effect()
  loadApprovalProcesses$: Observable<
    | OrgUnitActions.LoadApprovalProcessesSuccess
    | OrgUnitActions.LoadApprovalProcessesFail
  > = this.actions$.pipe(
    ofType(OrgUnitActions.LOAD_APPROVAL_PROCESSES),
    map((action: OrgUnitActions.LoadOrgUnit) => action.payload),
    switchMap(({ userId }) => {
      return this.orgUnitConnector.getApprovalProcesses(userId).pipe(
        map(
          (approvalProcesses: B2BApprovalProcess[]) =>
            new OrgUnitActions.LoadApprovalProcessesSuccess(approvalProcesses)
        ),
        catchError(error =>
          of(
            new OrgUnitActions.LoadApprovalProcessesFail({
              error: makeErrorSerializable(error),
            })
          )
        )
      );
    })
  );

  constructor(
    private actions$: Actions,
    private orgUnitConnector: OrgUnitConnector
  ) {}
}