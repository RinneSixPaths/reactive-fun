/*
    * @param {Object | null | undefined} initialState.
    * @param {Function[]} reducers.
*/
function createStore(initialState = {}, reducers) {
    const store = {
        state: initialState,
        subscribers: [],
        dispatch,
        reducers,
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
    * @param {Object} action.
*/

function dispatch(action) {
    this.reducers.forEach(reducer => {
        this.state = reducer(this.state, action);
    });
}

const INITIAL_STATE = {
    deeds: [
        {
            description: 'Throw out the trash',
        },
        {
            description: 'Clear kitchen',
        },
        {
            description: 'Pay some gold',
        },
    ],
};

const addDeedAction = payload => ({
    type: 'ADD_DEED',
    payload
});

function microReducerForDeeds(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'ADD_DEED': {
            return {
                ...state,
                deeds: [...state.deeds, action.payload],
            };
        }
        default: {
            return state;
        }
    }
}

const myStore = createStore(INITIAL_STATE, [microReducerForDeeds]);
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
