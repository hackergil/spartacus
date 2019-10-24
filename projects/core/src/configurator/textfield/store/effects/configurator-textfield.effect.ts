import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { ConfiguratorTextfield } from '../../../../model/configurator-textfield.model';
import { makeErrorSerializable } from '../../../../util/serialization-utils';
import { ConfiguratorTextfieldConnector } from '../../connectors/configurator-textfield.connector';
import {
  CreateConfiguration,
  CreateConfigurationFail,
  CreateConfigurationSuccess,
  CREATE_CONFIGURATION,
} from '../actions/configurator-textfield.action';

@Injectable()
export class ConfiguratorTextfieldEffects {
  @Effect()
  createConfiguration$: Observable<
    CreateConfiguration | CreateConfigurationSuccess | CreateConfigurationFail
  > = this.actions$.pipe(
    ofType(CREATE_CONFIGURATION),
    map(
      (action: { type: string; payload?: { productCode: string } }) =>
        action.payload
    ),
    mergeMap(payload => {
      return this.configuratorTextfieldConnector
        .createConfiguration(payload.productCode)
        .pipe(
          switchMap((configuration: ConfiguratorTextfield.Configuration) => {
            return [new CreateConfigurationSuccess(configuration)];
          }),
          catchError(error =>
            of(new CreateConfigurationFail(makeErrorSerializable(error)))
          )
        );
    })
  );

  constructor(
    private actions$: Actions,
    private configuratorTextfieldConnector: ConfiguratorTextfieldConnector
  ) {}
}
