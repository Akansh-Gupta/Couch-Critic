import App from './App';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './components/Context'
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: `${window.location.origin}/Couch-Critic/callback`,
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

reportWebVitals();
