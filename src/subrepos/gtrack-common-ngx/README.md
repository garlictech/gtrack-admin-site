# Common NGX module

## Upgrade to 1.0

1. You should remove the old CommonModule from the app imports
2. Rename the CommonConfig to SharedConfig
3. You need to import the following modules: MapModule, HikeModule, ShareModule

### Example app module

```

import { HikeModule, MapModule, SharedModule, SharedConfig, DeepstreamModule } from '../../src/ngx';
import { Actions as JwtActions } from '../../src/authentication-api-ngx';

const sharedConfig = new SharedConfig();
sharedConfig.googleMaps.key = googleMapApiKey;

@NgModule({
  imports: [
    SharedModule.forRoot(sharedConfig),
    HikeModule,
    MapModule,
    DeepstreamModule.forRoot({
      JwtApiActions: {
        LOGIN_SUCCESS: JwtActions.LOGIN_SUCCESS,
        LOGOUT_START: JwtActions.LOGOUT_START
      },
      deepstreamConnectionString: 'localhost:6020'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

You can find a working example in the development app's app module too.

## Modules

### Hike module

This module contains all the services and helper classes for the hike related database operations and calculations and the components for display hike related maps and informations.

### Map module

Basic services and components for the low level map manupilations.

### Deepstream module

Wrapper module around the deepstream-ngx package.
