# reactive-fun

Reducer creation

```
const INITIAL_DEEDS_STATE = [
    {
        description: 'Throw out the trash',
    },
    {
        description: 'Clear kitchen',
    },
    {
        description: 'Pay some gold',
    },
];

//Use this reducer for createStore()

function microReducerForDeeds(state = INITIAL_DEEDS_STATE, action = {}) {
    switch (action.type) {
        case 'ADD_DEED': {
            return [
                ...state,
                action.payload,
            ];
        }
        default: {
            return state;
        }
    }
}
```

or

```
//Use this reducer for createStore()

const rootReducer = combineReducers({
    deeds: microReducerForDeeds,
});
```

Store creation and subscription

```
const myStore = createStore(rootReducer);

myStore.subscribe(function({ deeds }) {
    console.log(deeds);
});
```

Dispatch an action

```
const addDeedAction = payload => ({
    type: 'ADD_DEED',
    payload
});

const newTodo = {
    description: 'Test Some',
};
myStore.dispatch(addDeedAction(newTodo));
```

Pass initial state into createStore(). Will ignore reducer's initial state

```
function microReducerForDeeds(state = INITIAL_DEEDS_STATE, action = {}) {
    switch (action.type) {
        case 'ADD_DEED': {
            return {
                deeds: [
                    ...state,
                    action.payload,
                ],   
            };
        }
        default: {
            return state;
        }
    }
}

const INITIAL_STATE = {
    deeds: [
        {
            description: 'Todo from initial state',
        },
    ],
}

const myStore = createStore(
    microReducerForDeeds,
    INITIAL_STATE,
);
```

Apply middleware

```
function logger({ getState }) {
    return next => action => {
        console.log('Current state is', getState());
        console.log('First sync logger. Action:', action);
        next(action);
    }
}

const myStore = createStore(
    rootReducer,
    null,
    applyMiddleware(logger),
);
```
