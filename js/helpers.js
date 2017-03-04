"use strict";
var redux_actions_1 = require("redux-actions");
;
/**
 * Фабрика action creator'ов и reducer'ов, хранящая в себе типы текущей ветки store и Payload action'а.
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
     * Создает action creator.
     * @param payload payload для action'а.
     */
    GuardedFactory.prototype.createAction = function (payload) {
        return this._actionCreator(payload);
    };
    /**
     * Создает reducer, привязанный к конкретному GuardedActionType.
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
        this._type = (type || "").toString();
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
* Склеивает набор reducer'ов для работы с одной веткой state'а
* (в отличие от combine, где каждый reducer работает со своим поддеревом).
*
* Можно добиться такой неприятной ситуации, когда defaultReducer среагирует на action, на который уже среагировал
* один из actionReducer'ов. Запретить такую регистрацию не представляется возможным.
* @param initialState state по-умолчанию.
* @param actionReducers массив reducer'ов с GuardedActionType'ом.
* @param defaultReducer reducer по-умолчанию.
*/
var joinReducers = function (initialState, actionReducers, defaultReducer) {
    var actionReducerMap = {};
    for (var _i = 0, actionReducers_1 = actionReducers; _i < actionReducers_1.length; _i++) {
        var actionReducer = actionReducers_1[_i];
        if (actionReducerMap[actionReducer.type] != null)
            throw new Error("reducer \u0441 \u0442\u0438\u043F\u043E\u043C \"" + actionReducer.type + "\" \u0443\u0436\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u043D");
        actionReducerMap[actionReducer.type] = actionReducer.reducer;
    }
    var reducer = function (currentState, action) {
        var actionReducer = actionReducerMap[action.type];
        var actualState = currentState || initialState;
        if (actionReducer != null)
            actualState = actionReducer(actualState, action);
        if (defaultReducer != null)
            actualState = defaultReducer(actualState, action);
        return actualState;
    };
    return reducer;
};
exports.joinReducers = joinReducers;
/**
 * Проверяет, имеет ли указанный FSA (Flux Standard Action) требуемый тип.
 * @param action action, который нужно проверить.
 * @param type требуемый тип action'а.
 * @template TPayload тип полезной нагрузки action'а.
 */
var is = function (action, type) { return action.type === type; };
/**
 * Создает фабрику action-creator'ов и reducer-creator'ов.
 * @param type тип action'а.
 * @template TPayload тип полезной нагрузки action'а.
 */
var createFactory = function (type) { return new GuardedFactory(type); };
exports.createFactory = createFactory;
