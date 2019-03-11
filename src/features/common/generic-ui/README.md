# Generic UI

Find it in the `generic-ui` block, in th esubrepos and in te apps. Main purpose: add UI components that could be used in the whole app.

You should control the UI elements with actions/effects, and implement the platform specific details in the `PlatformService`.

See the appropriate action descriptions in the class documentations.

## Toast

Display a toast-like message (that disappears after a while).

```
import * as fromUiActions from 'common/native/blocks/generic-ui/store/actions';

store.dispatch(new fromUiActions.DisplayToast({
  severity: EToastSeverity.Success,
  summary: 'translatableLabels.success',
  detail: 'translatableLabels.dataSaved',
}))
```

## Full-screen spinner

With an optional text, to add some feedback to the user.

```
import * as fromUiActions from 'common/native/blocks/generic-ui/store/actions';

store.dispatch(new fromUiActions.ShowProgressSpinner('translatableLabels.loading'))
```

To hide the spinner:

```
import * as fromUiActions from 'common/native/blocks/generic-ui/store/actions';

store.dispatch(new fromUiActions.HideProgressSpinner())
```

For the platform-specific implementation details, see `common/native/blocks/generic-ui/store/effects`.

## UI selectors

Their main purpose is to support the platform specific implementations.

```
import * as fromUiSelectors from 'common/native/blocks/generic-ui/store/selectors';
```

### selectProgressSpinnerOn

`true` if the progress spinner is currently visible.

### selectProgressSpinnerText

Return the text that the spinner should display.
