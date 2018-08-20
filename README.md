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

function microReducerForDeeds(state = INITIAL_DEEDS_STATE, action) {
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

myStore.subscribe(function(stateData) {
    console.log(stateData);
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
