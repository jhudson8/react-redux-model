import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

// in a real app you would probably organize your reducer files differently
// but it keeps things simple and straightforward here
import appReducer from './profile-page/reducer';

export default {
  // `routing` this isn't necessary if we didn't care about react-router state being in the redux store
  routing: routerReducer,
  // `app` will be the state attribute that our view component will look for profile data
  app: appReducer
};
