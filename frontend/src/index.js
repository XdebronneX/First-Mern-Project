import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store'
import { GoogleOAuthProvider } from '@react-oauth/google' //GoogleLogin
import App from './App';
import { ToastContainer } from 'react-toastify';

// const options = {
//   timeout: 5000,
//   position: positions.BOTTOM_CENTER,
//   transition: transitions.SCALE
// }
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="278334217728-o52uav17ng1a4bu80tdlb5pe6n058pvf.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </GoogleOAuthProvider>
  </Provider>

);