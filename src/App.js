import logo from './logo.svg';
import './App.css';
import Background from './components/Background/Background';
import Temperature from './components/Temperature/Temperature';
import { UserStorage, UserStorageContext } from './components/UserStorage/UserStorage';
import Widgets from './components/Widgets/Widgets';
import Links from './components/Links/Links';
import Attribution from './components/Attribution/Attribution';
import ContextMenu from './components/ContextMenu/ContextMenu';
// import Options from './components/options/Options/Options';
import { lazy, useEffect } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
const Options = lazy(() => import('./components/options/Options/Options'));


function App() {

  // const [userStorage, setUserStorage, isPersistent, error] = useChromeStorageSync();

  // console.log(window.location.pathname);
  if (window.location.search.includes("?options")) {
    return (
      <div className="App">
        <UserStorage>
          <Options />
        </UserStorage>
      </div>
    )
  } else {

    return (
      <div className="App">
        <UserStorage>
          <Background />
          <Temperature />
          {/* <Widgets /> */}
          <Links />
          <ContextMenu />
        </UserStorage>
      </div>
    );
  }
}

export default App;
