## [state-store](https://github.com/sardonyxwt/state-store) 

state-store is a predictable async state container for JavaScript and Typescript apps. 

### Installation

To install the stable version:

```
npm install --save @sardonyxwt/state-store
```

This assumes you are using [npm](https://www.npmjs.com/) as your package manager. 

### The Gist

The whole state of your app is stored in an scopes inside a single *store*.  
The only way to change the scope is to emit an *action*, an object describing what happened.  
To specify how the actions transform the scope, you write pure *action* and register its in scope.

That's it!

```js
import {createAsyncScope, createSyncScope, composeScope, setStoreDevTool} from '@sardonyxwt/state-store';

const INCREMENT_ACTION = 'increment';
const DECREMENT_ACTION = 'decrement';
const SET_COUNTER_ACTION = 'setCounter';

// Scope middleware example.
const logScopeMiddleware = {
  postSetup: (scope) => {
    console.log('Scope(' + scope.name + ') with LogScopeMiddleware complete setup.')
  },
  appendActionMiddleware: (action) => {
    return (state, props) => {
      console.log('Log from LogScopeMiddleware: ', state, props);
      return action(state, props);
    }
  }
};

// Create a new async scope.
const counterAsyncScope = createAsyncScope({
  name: 'counterAsyncScope',
  initState: 0,
  middleware: [logScopeMiddleware]
});

// Create a new sync scope.
const counterSyncScope = createAsyncScope({
  name: 'counterScope', 
  initState: 0, 
  middleware: [logScopeMiddleware]
});

// Registers a new action in COUNTER_SCOPE.
counterAsyncScope.registerAction(
  INCREMENT_ACTION,
  (scope, props) => Promise.resolve(scope + 1)
);

counterAsyncScope.registerAction(
  DECREMENT_ACTION,
  (scope, props) => Promise.resolve(scope - 1),
);

// You can save action dispatcher and call later.
const setCouterActionDispatcher = counterAsyncScope.registerAction(
  SET_COUNTER_ACTION,
  (scope, props) => {
    if(typeof props !== 'number') {
      throw new Error('Props is not number');
    }
    return Promise.resolve(props);
  }
  /*
  * You can use actionResultTransformer to change result value it only affect in action dispatcher.
  * , (actionResult, props) => actionResult + props + 10000
  * */
);

// You can add macro as it and call later.
counterAsyncScope.registerMacro('remains', (state, props) => {
  const remains = props - state;
  if (remains < 0) {
    return 0;
  }
  return remains;
});

// You can add macro as getter or setter type.
counterAsyncScope.registerMacro('count', (state) => {
  return state;
}, 'GETTER');

// You can use lock() to forbid add new action to scope.
counterAsyncScope.lock();

// You can use isLocked to check is scope is lock.
console.log(counterAsyncScope.isLocked);

// You can use subscribe() to update the UI in response to state changes.
let allActionListenerId = counterAsyncScope.subscribe(
  ({oldScope, newScope, scopeName, actionName, props}) => {
    console.log(oldScope, newScope, scopeName, actionName, props)
  }
);

// You can use subscribe() with specific actionName (you can use array of actions) to handle only this action.
let setCounterActionListenerId = counterAsyncScope.subscribe(
  () => console.log('set counter value action dispatch.'),
  SET_COUNTER_ACTION
);

let syncObject1 = {}, syncObject2 = {};

// You can use synchronize() to synchronize the object with scope state.
let synchronizeObject1Id = counterAsyncScope.synchronize(syncObject1, 'state');

// You can use synchronize() with specific actionName to handle only this action.
let synchronizeObject2Id = counterAsyncScope.synchronize(syncObject2, 'state', INCREMENT_ACTION);

// The only way to mutate the internal state in scope is to dispatch an action.
counterAsyncScope.dispatch(INCREMENT_ACTION);
counterAsyncScope.dispatch(DECREMENT_ACTION);

counterAsyncScope.dispatch(SET_COUNTER_ACTION, 1000)
  .then(newScope => console.log(newScope));

counterAsyncScope.dispatch(SET_COUNTER_ACTION, "invalid props")
  .catch(err => console.log(err));

// dispatch action with action dispatcher.
setCouterActionDispatcher(1000);

// or you can call action dispatcher like this.
// The method name is the same as the action name.
counterAsyncScope.setCounter(2000);

// call remains macro.
console.log(counterAsyncScope.remains(10000));

// call getter count macro.
console.log(counterAsyncScope.count);

counterAsyncScope.unsubscribe(allActionListenerId);
counterAsyncScope.unsubscribe(setCounterActionListenerId);
counterAsyncScope.unsubscribe(synchronizeObject1Id);
counterAsyncScope.unsubscribe(synchronizeObject2Id);

console.log(counterAsyncScope.state);


// You can use getSupportActions to get supported actions of scope.
console.log(counterAsyncScope.supportActions);

// You can use composeScope to create compose scope.
const composedScope = composeScope('ComposeScope', [counterAsyncScope, ROOT_SCOPE]);

composedScope.dispatch(SET_COUNTER_ACTION, 2000);

console.log(composedScope.state);

// You can use setStoreDevTool to set middleware dev tool.
setStoreDevTool({
  //Call when created new scope.
  onCreate(scope) {
    console.log('Scope with name: ' + scope.name + ' created');
  },
  //Call when change scope (lock, registerAction, dispatch).
  onChange(scope) {
    console.log('Scope with name: ' + scope.name + ' changed', {
      supportActions: scope.supportActions,
      isLock: scope.isLocked,
      state: scope.state
    })
  },
  //Call when in any scope dispatch action.
  onAction(event) {
    console.log('StoreAction: ', event)
  },
  //Call when in any scope dispatch action error.
  onActionError(error) {
    console.log('StoreActionError: ', error)
  }
});
```

### License

state-store is [MIT licensed](./LICENSE).
