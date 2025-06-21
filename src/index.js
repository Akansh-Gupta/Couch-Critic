import App from './App';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './components/Context'
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="dev-z0rvyj6urasdkpip.us.auth0.com"
    clientId="9PJKjhH4e0L1y046JcYxiit2DEWU4gf1"
    authorizationParams={{
      redirect_uri: `${window.location.origin}/Couch-Critic`,
      audience: "https://akansh-gupta.github.io/Couch-Critic/",
      scope: "openid profile email"
    }}
    cacheLocation="localstorage"
  >
    <AppProvider>
      <App />
    </AppProvider>
  </Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
