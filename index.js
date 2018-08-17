/*
    * @param {Object | null | undefined} initialState.
    * @param {Function[]} reducers.
*/
function createStore(/*initialState = {},*/ reducer) {
    const store = {
        state: {},
        subscribers: [],
        dispatch,
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

const addDeedAction = payload => ({
    type: 'ADD_DEED',
    payload
});

const addAnimalAction = payload => ({
    type: 'ADD_ANIMAL',
    payload
});

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

const rootReducer = combineReducers({
    deeds: microReducerForDeeds,
    animals: microReducerForAnimals,
});
const myStore = createStore(rootReducer);

const deedDiv = document.createElement("div");
const animalDiv = document.createElement("div");
my_div = document.getElementById("root");
document.body.insertBefore(deedDiv, my_div);
document.body.insertBefore(animalDiv, my_div);

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

