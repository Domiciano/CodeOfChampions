import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import store from './store/indexRedux';
import { Provider } from 'react-redux';
import { 
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HashRouter>
    <Provider store={store}>
      <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/home" element={<h1>Home rey</h1>}></Route>
    </Routes>
    </Provider>
  </HashRouter>
);
