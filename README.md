[![Build Status](https://travis-ci.org/mindbox-moscow/redux-helpers.svg?branch=master)](https://travis-ci.org/mindbox-moscow/redux-helpers)
[![codebeat badge](https://codebeat.co/badges/d8b0e56d-8c51-442f-b666-b186d9e51bf2)](https://codebeat.co/projects/github-com-mindbox-moscow-redux-helpers)
[![Coverage Status](https://coveralls.io/repos/github/mindbox-moscow/redux-helpers/badge.svg?branch=master)](https://coveralls.io/github/mindbox-moscow/redux-helpers?branch=master)

[![npm (scoped)](https://img.shields.io/npm/v/@mindbox/redux-helpers.svg)](https://www.npmjs.com/package/@mindbox/redux-helpers)
# Redux helpers
Typed factories for your reducers and actions.

### Install
```shell
npm install --save @mindbox/redux-helpers
```

### Usage
```typescript
// state.ts
export interface State
{
    currentText: string;
    // ... other fields
}
```

```typescript
// reducer.ts -- how to create typed reducer
import { createFactory } from '@mindbox/redux-helpers';
import { State } from './state';

export interface Payload {
    newText: string;
}

export const BUTTON_CLICK = createFactory<Payload>("BUTTON_CLICK");

export reducer = BUTTON_CLICK.createReducer<State>(
    (state, action) => {
        return {
            ...state,
            currentText: action.payload.newText
        }
    },
    {
        currentText: "",
        // ... other fields
    }
);
```

```typescript
// How to dispatch BUTTON_CLICK action
import { BUTTON_CLICK, Payload } from './reducer';
import { State } from './state';
import { Dispatch } from 'redux';

export mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
        onButtonClick: () => {
            let payload: Payload = {
                newText: "test"
            };

            // note: this is type-safe
            dispatch(BUTTON_CLICK.createAction(payload));
        }
    };
}
```


### Build
```shell
tsc ts/helpers.ts --outDir ./js/ --target es5
```
