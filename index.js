/*
    * @param {Function} reducer.
    * @param {Object} initial state.
    * @param {Function} middleware (chain of custom middlewares).
*/
function createStore(
    reducer = () => ({}),
    initialState = null,
    middleware = () => null
) {
    const store = {
        subscribers: [],
        reducer,
        subscribe: function(callback) {
            this.subscribers.push(callback);
        },
        getState: function () {
            if (!this.state) {
                this.state = reducer(initialState);
            }
            return this.state;
        },
    }

    Object.defineProperty(store, 'state', {
        get: function() {
            return this._state;
        },
        set: function(newState) {
            this._state = newState;
            this.subscribers.forEach(callback => callback(this._state));
        },
    });

    Object.defineProperty(store, 'dispatch', {
        value: middleware(store) || dispatch,
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
    * @param {Object} scheme to slice state between reducers.
*/

function combineReducers(scheme) {
    return function(currentState, action = {}) {
        const state = currentState || {};
        for (let key in scheme) {
            if (state.hasOwnProperty(key)) {
                state[key] = scheme[key](state[key], action);
            } else {
                state[key] = scheme[key](undefined, action);
            }
        }
        return state;
    };
}

/*
    * @param {Function[]} middlewares to create chain of functions.
*/

function applyMiddleware(...middlewares) {
    return function(store) {
        return middlewares.reduceRight((prevMiddleware, currentMiddleware) => (
            currentMiddleware(store).bind(null, prevMiddleware)()
        ), dispatch.bind(store));
    }
}

/*
    Sync logger
*/

function firstSyncLogger({ getState }) {
    return next => action => {
        console.log('Current state is', getState());
        console.log('First sync logger. Action:', action);
        next(action);
    }
}

/*
    Async logger
*/

function secondAsyncLogger(_store) {
    return next => action => {
        setTimeout(() => {
            console.log('Second async logger. Action:', action);
            next(action);
        }, 2000);
    }
}

/*
    Initial state pieces
*/

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

const INITIAL_ANIMALS_STATE = [
    {
        animal: 'Chiken',
    },
    {
        animal: 'Goat',
    },
    {
        animal: 'Pig',
    },
];

/*
    Actions
*/

const addDeedAction = payload => ({
    type: 'ADD_DEED',
    payload
});

const addAnimalAction = payload => ({
    type: 'ADD_ANIMAL',
    payload
});

/*
    Deeds reducer
*/

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

/*
    Animal reducer
*/

function microReducerForAnimals(state = INITIAL_ANIMALS_STATE, action) {
    switch (action.type) {
        case 'ADD_ANIMAL': {
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

/*
    Root reducer creation
*/

const rootReducer = combineReducers({
    deeds: microReducerForDeeds,
    animals: microReducerForAnimals,
});

/*
    Store creation
*/

const myStore = createStore(
    rootReducer,
    null,
    applyMiddleware(firstSyncLogger, secondAsyncLogger),
);

/*
    Section to test our store
*/
const deedDiv = document.createElement("div");
const animalDiv = document.createElement("div");
my_div = document.getElementById("root");
document.body.insertBefore(deedDiv, my_div);
document.body.insertBefore(animalDiv, my_div);

/*
    Subscribe to store with a callback.
    Callback will recieve the state.
*/

myStore.subscribe(renderDeeds);

myStore.subscribe(function() {
    console.log('ANOTHER SUBSCRIPTION');
});

function renderDeeds({ deeds }) {
    const content = deeds.map(({ description }) => `<h3>${description}</h3>`);
    deedDiv.innerHTML = content.join('');
}

renderDeeds(myStore.getState());

function renderAnimals({ animals }) {
    const content = animals.map(({ animal }) => `<h4>${animal}</h4>`);
    animalDiv.innerHTML = content.join('');
}

renderAnimals(myStore.getState());

myStore.subscribe(renderAnimals);

const newDeed = {
    description: 'Test Some',
};
const newAnimal = {
    animal: 'Cat',
};
myStore.dispatch(addDeedAction(newDeed));
myStore.dispatch(addAnimalAction(newAnimal));

setTimeout(() => {
    const delayedDeed = {
        description: 'Delayed deed',
    };
    myStore.dispatch(addDeedAction(delayedDeed));
}, 1000);
