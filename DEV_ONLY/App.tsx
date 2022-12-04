import React, { useCallback, useEffect, useState } from 'react';
import {
  Provider as ReactReduxProvider,
  useDispatch,
  useStore,
} from 'react-redux';
import {
  // store,
  storeConfigured as store,
  type ReduxState,
} from './store';

import { part, usePart, usePartUpdate, usePartValue } from '../src';
import {
  activateToggleAction,
  activeTogglePart,
  conditionalUpdate,
  deactivateToggleAction,
  descriptionPart,
  firstNamePart,
  fullNameSelect,
  idPart,
  lastNamePart,
  parentPart,
  titlePart,
  todosPart,
  userSelect,
} from './store/parts';

store.subscribe(() => {
  console.log('store changed', store.getState());
});

store.subscribeToPartition(descriptionPart, () => {
  console.log('description changed', store.getState(descriptionPart));
});

console.log('initial state', store.getState());

store.dispatch(descriptionPart('next description'));

function useAfterTimeout(fn: () => void, ms: number) {
  useEffect(() => {
    setTimeout(fn, ms);
  }, []);
}

function Active() {
  const active = usePartValue(activeTogglePart);

  console.count('active');

  return <div>Active: {String(active)}</div>;
}

function Description() {
  const description = usePartValue(descriptionPart);
  const updateDescription = usePartUpdate(descriptionPart);

  useAfterTimeout(() => updateDescription('better description'), 2000);

  console.count('description');

  return <div>Description: {description}</div>;
}

function Owner() {
  const owner = usePartValue(parentPart);

  console.count('owner');

  return (
    <div>
      <div>Owner title: {owner.title}</div>
      <div>Owner todos: {JSON.stringify(owner.todos)}</div>
    </div>
  );
}

function Status() {
  const store = useStore<ReduxState>();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(store.getState().legacy);

  useEffect(() => {
    return store.subscribe(() => {
      const nextStatus = store.getState().legacy;

      if (nextStatus !== status) {
        setStatus(nextStatus);
      }
    });
  }, [store]);

  useAfterTimeout(() => dispatch({ type: 'LEGACY' }), 3000);

  return <div>Status: {status}</div>;
}

function Title() {
  const title = usePartValue(titlePart);
  const [, setTitle] = usePart(conditionalUpdate);

  useAfterTimeout(() => setTitle(12345), 1000);
  useAfterTimeout(() => setTitle('next title'), 5000);

  console.count('title');

  return <div>Title: {title}</div>;
}

const resetUpdate = part(null, (_getState, dispatch) =>
  dispatch(todosPart([]))
);

function Todos() {
  const [todos, updateTodos] = usePart(todosPart);
  const [, resetTodos] = usePart(resetUpdate);

  console.count('todos');

  useAfterTimeout(() => updateTodos(['foo']), 1000);
  useAfterTimeout(
    () => updateTodos((exitingTodos) => [...exitingTodos, 'bar']),
    2000
  );
  useAfterTimeout(resetTodos, 3000);

  return <div>Todos: {JSON.stringify(todos)}</div>;
}

function Toggle() {
  const setActive = usePartUpdate(activeTogglePart);
  const toggleActive = useCallback(
    () => setActive((prevActive) => !prevActive),
    [setActive]
  );

  // const activate = useCallback(
  //   () => setActive(true, { context: 'Activating toggle' }),
  //   [setActive]
  // );
  // const deactivate = useCallback(
  //   () => setActive(false, { context: 'Deactivating toggle' }),
  //   [setActive]
  // );
  const dispatch = useDispatch();
  const activate = useCallback(
    () => dispatch(activateToggleAction()),
    [dispatch]
  );
  const deactivate = useCallback(
    () => dispatch(deactivateToggleAction()),
    [dispatch]
  );

  console.count('toggle');

  return (
    <div>
      <button type="button" onClick={toggleActive}>
        Toggle active
      </button>
      <button type="button" onClick={activate}>
        Activate
      </button>
      <button type="button" onClick={deactivate}>
        Deactivate
      </button>
    </div>
  );
}

function User() {
  const [user] = usePart(userSelect);

  console.count('user');

  return (
    <div>
      <h2>User: {user}</h2>

      <UserId />
      <UserName />
    </div>
  );
}

function UserId() {
  const id = usePartValue(idPart);
  const updateLastName = usePartUpdate(lastNamePart);

  useAfterTimeout(() => updateLastName(`O'Testerson`), 1500);

  console.count('user id');

  return <div>Id: {id}</div>;
}

function UserName() {
  const firstName = usePartValue(firstNamePart);
  const lastName = usePartValue(lastNamePart);

  console.count('user name');

  return (
    <div>
      Name: {firstName} {lastName}
    </div>
  );
}

function UserNameStoreSelector() {
  const [fullName] = usePart(fullNameSelect);
  // const fullName = usePartValue(fullNameSelect);

  console.count('stored selector');

  return <div>Stored selector: {fullName}</div>;
}

export default function App() {
  const [userVisible, setUserVisible] = useState(true);

  // useAfterTimeout(() => setUserVisible(false), 1000);

  return (
    <ReactReduxProvider store={store}>
      <main>
        <h1>App</h1>

        <Active />
        <Toggle />
        <Status />

        <br />

        {userVisible && (
          <>
            <User />
            <UserNameStoreSelector />
          </>
        )}

        <br />

        <Title />
        <Description />
        <Todos />

        <br />

        <Owner />
      </main>
    </ReactReduxProvider>
  );
}
