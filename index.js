/*
    * @param {Object | null | undefined} initialState.
    * @param {Function[]} reducers.
*/
function createStore(reducer = () => ({}), middleware = () => null) {
    const store = {
        subscribers: [],
        reducer,
        subscribe: function(callback) {
            this.subscribers.push(callback);
        },
        getState: function () {
            return this.state || reducer();
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
    * @param {Object} action to dispatch. Will mutate a state.
*/

function dispatch(action) {
    this.state = this.reducer(this.state, action);
}

/*
    * @param {Object} scheme to slice state between reducers.
*/

function combineReducers(scheme) {
    return function(state = {}, action = {}) {
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
        return middlewares.reduceRight((prev, current) => (
            current(store).bind(store, prev)()
        ), dispatch.bind(store));
    }
}

/*
    Sync logger
*/

function firstLogger() {
    return next => action => {
        console.log('First logger. Action:', action);
        return next(action);
    }
}

/*
    Sync logger
*/

function secondLogger() {
    return next => action => {
        console.log('Second logger. Action:', action);
        return next(action);
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
    applyMiddleware(firstLogger, secondLogger),
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

setTimeout(() => {
    const newDeed = {
        description: 'Test Some',
    };
    myStore.dispatch(addDeedAction(newDeed));
}, 2000);

setTimeout(() => {
    const newAnimal = {
        animal: 'Cat',
    };
    myStore.dispatch(addAnimalAction(newAnimal));
}, 3000);

