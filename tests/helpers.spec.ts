import * as Helpers from "../ts/helpers";

describe("Redux helpers tests",
	() =>
	{
		describe("GuardedFactory tests",
		() =>
		{
			it("'type'-getter returns type of action",
				() =>
				{
					const anActionFactory = Helpers.createFactory<string>("ACTION");

					const anAction = anActionFactory.createAction("abacaba");


					expect(anAction.type).toEqual(anActionFactory.type);
					expect(anActionFactory.type).toEqual("ACTION");
				});

			it("reducer processes actions from same factory",
				() =>
				{
					interface State
					{
						a: string;
					}

					const anActionFactory = Helpers.createFactory<string>("ACTION");

					const anAction = anActionFactory.createAction("abacaba");
					const aReducer = anActionFactory.createReducer<State>((state, action) => ({ a: action.payload }));


					const expectedState = aReducer.reducer({a: null}, anAction);


					expect(expectedState.a).toEqual("abacaba");
				});

			it("reducers returns not modified state for 'misstyped' action",
				() =>
				{
					const alphaActionFactory = Helpers.createFactory<string>("ALPHA");
					const betaActionFactory = Helpers.createFactory<string>("BETA");

					const alphaReducer = alphaActionFactory.createReducer<string>(
						(state, action) => action.payload);

					const betaAction = betaActionFactory.createAction("B");


					const actualState = alphaReducer.reducer("abacaba", betaAction);


					expect(actualState).toEqual("abacaba");
				})

			it("reducer returns initial modified state for 'mistyped' action",
				() =>
				{
					const alphaActionFactory = Helpers.createFactory<string>("ALPHA");
					const betaActionFactory = Helpers.createFactory<string>("BETA");

					const alphaReducer = alphaActionFactory.createReducer<string>(
						(state, action) => action.payload,
						"initialState");

					const betaAction = betaActionFactory.createAction("B");


					const actualState = alphaReducer.reducer(undefined, betaAction);


					expect(actualState).toEqual("initialState");
				})
		});

		describe("joinReducers tests",
			() =>
			{
				it("Reducers joint works correct",
					() =>
					{
						interface State
						{
							a: string;
						}

						const firstActionFactory = Helpers.createFactory<string>("FIRST_ACTION");
						const secondActionFactory = Helpers.createFactory<string>("SECOND_ACTION");


						const jointReducer = Helpers.joinReducers(
							{ a: "" },
							[
								firstActionFactory.createReducer<State>((state, action) => ({ a: action.payload })),
								secondActionFactory.createReducer<State>((state, action) => ({ a: action.payload.toUpperCase() }))
							]);

						const firstState = jointReducer(null, secondActionFactory.createAction("abacaba"));
						const secondState = jointReducer(firstState, firstActionFactory.createAction("ololo"));

						expect(firstState.a).toEqual("ABACABA");
						expect(secondState.a).toEqual("ololo");
					});

				it("Default reducer have been used",
					() =>
					{
						interface State
						{
							a: string;
							b: string;
						}

						const actionFactory = Helpers.createFactory<string>("ACTION");
						const reducer = actionFactory.createReducer<State>((state, action) => ({ a: action.payload, b: null }));

						const defaultActionFactory = Helpers.createFactory<string>("DEFAULT_ACTION");
						const defaultReducer = (state: State, action: Helpers.Action<string>) => ({ a: state.a, b: action.payload });


						const jointReducer = Helpers.joinReducers(
							{ a: null, b: null },
							[reducer],
							defaultReducer);

						const actualState = jointReducer({ a: "AAA", b: null }, defaultActionFactory.createAction("BBB"));


						expect(actualState).toEqual({ a: "AAA", b: "BBB" });
					});

				it("Impossible to register two reducers for same state and action",
					() =>
					{
						interface State
						{
						}

						const actionFactory = Helpers.createFactory<string>("ACTION");
						const aReducer = actionFactory.createReducer<State>(() => ({}));
						const bReducer = actionFactory.createReducer<State>(() => ({}));


						expect(() => Helpers.joinReducers<State>({}, [aReducer, bReducer]))
							.toThrowError("Reducer with type \"ACTION\" had already been registered.");
					});

				it("Returns null in case of null current state",
					() =>
					{
						interface State
						{
							a: string;
						}

						const initialState: State = { a: "abacaba" };
						const jointReducer = Helpers.joinReducers<State>(initialState, []);


						const actualState = jointReducer(null, { type: "ACTION" });


						expect(actualState).toEqual(null);
					});

				it("JointReducer with initialState = true doesn't change state on unexpected actions",
					() =>
					{
						const jointReducer = Helpers.joinReducers<boolean>(true, []);

						const currentState = false;
						const nextState = jointReducer(false, { type: "ACTION" });

						expect(nextState).toEqual(currentState);
					});
			});
	});
