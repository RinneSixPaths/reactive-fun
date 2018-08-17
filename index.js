/*
    * @param {Object | null | undefined} initialState.
    * @param {Function[]} reducers.
*/
function createStore(initialState = {}, reducer) {
    const store = {
        state: initialState,
        subscribers: [],
        dispatch,
        reducer,
        subscribe: function(callback) {
            this.subscribers.push(callback);
        },
        getState: function () {
            return this.state || initialState;
        },
    }

    Object.defineProperty(store, 'state', {
        get: function() {
            return this._state;
        },
        set: function(newState) {
            this._state = newState;
            this.subscribers.forEach(callback => callback(this._state));
        }
    });

    return store;
}

/*
    * @param {Object} action to dispatch.
*/

function dispatch(action) {
    this.state = this.reducer(this.state, action);
}

/*
    * @param {Object} scheme to slice state between reducers .
*/

function combineReducers(scheme) {
    return function(state = {}, action) {
        for (let key in scheme) {
            state[key] = scheme[key](state[key], action);
        }
        return state;
    };
}

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

const INITIAL_STATE = {
    deeds: INITIAL_DEEDS_STATE,
}

const addDeedAction = payload => ({
    type: 'ADD_DEED',
    payload
});

function microReducerForDeeds(state = INITIAL_DEEDS_STATE, action) {
    console.log(state);
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

const rootReducer = combineReducers({
    deeds: microReducerForDeeds,
});
const myStore = createStore(INITIAL_STATE, rootReducer);

const newDiv = document.createElement("div");
my_div = document.getElementById("root");
document.body.insertBefore(newDiv, my_div);

myStore.subscribe(renderDeeds);

myStore.subscribe(function() {
    console.log('ANOTHER SUBSCRIPTION');
});

function renderDeeds({ deeds }) {
    const content = deeds.map(({ description }) => `<h3>${description}</h3>`);
    newDiv.innerHTML = content.join('');
}

renderDeeds(myStore.getState());

setTimeout(() => {
    const newDeed = {
        description: 'Test Some',
    };
    myStore.dispatch(addDeedAction(newDeed));
}, 2000);
