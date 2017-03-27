"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_actions_1 = require("redux-actions");
;
/**
 * Action creator's and reducer's factory. It contains current store brunch's type and action payload's type.
 * @template TState store's current brunch type.
 * @template TPayload action's payload type.
 */
var GuardedFactory = (function () {
    function GuardedFactory(type) {
        this._type = type;
        this._actionCreator = redux_actions_1.createAction(this._type.toString());
    }
    Object.defineProperty(GuardedFactory.prototype, "type", {
        get: function () {
            return this._type.toString();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates an action creator.
     * @param payload payload for an action.
     */
    GuardedFactory.prototype.createAction = function (payload) {
        return this._actionCreator(payload);
    };
    /**
     * Creates a reducer, bounded to concrete GuardedActionType.
     * @param reducer reducer.
     */
    GuardedFactory.prototype.createReducer = function (reducer, initialState) {
        var _this = this;
        var actionReducer = function (state, action) {
            if (is(action, _this._type))
                return reducer(state, action);
            return state || initialState;
        };
        return new GuardedReducer(this._type, actionReducer);
    };
    return GuardedFactory;
}());
exports.GuardedFactory = GuardedFactory;
var GuardedReducer = (function () {
    function GuardedReducer(type, reducer) {
        this._type = (type).toString();
        this._reducer = reducer;
    }
    Object.defineProperty(GuardedReducer.prototype, "reducer", {
        get: function () {
            return this._reducer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuardedReducer.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return GuardedReducer;
}());
/**
* Join a set of reducers that work with same state's branch
* (unlike combine where each reducer work with different branches).
*
* You can register a defaultReducer that will be triggered even if an action
* was already processed. Please avoid such registrations.
* @param initialState initial state.
* @param actionReducers a set of reducers with GuardedActionType.
* @param defaultReducer default reducer.
*/
var joinReducers = function (initialState, actionReducers, defaultReducer) {
    var actionReducerMap = {};
    for (var _i = 0, actionReducers_1 = actionReducers; _i < actionReducers_1.length; _i++) {
        var actionReducer = actionReducers_1[_i];
        if (actionReducerMap[actionReducer.type] != null)
            throw new Error("Reducer with type \"" + actionReducer.type + "\" had already been registered.");
        actionReducerMap[actionReducer.type] = actionReducer.reducer;
    }
    var reducer = function (currentState, action) {
        if (currentState === void 0) { currentState = initialState; }
        var actionReducer = actionReducerMap[action.type];
        var nextState = currentState;
        if (actionReducer != null)
            nextState = actionReducer(nextState, action);
        if (defaultReducer != null)
            nextState = defaultReducer(nextState, action);
        return nextState;
    };
    return reducer;
};
exports.joinReducers = joinReducers;
/**
 * Check that FSA (Flux Standard Action) has required type.
 * @param action action to check.
 * @param type required action type.
 * @template TPayload action's payload type.
 */
var is = function (action, type) { return action.type === type; };
/**
 * Create action creator's and action reducer's factory.
 * @param type action's type.
 * @template TPayload action's payload type.
 */
var createFactory = function (type) { return new GuardedFactory(type); };
exports.createFactory = createFactory;
