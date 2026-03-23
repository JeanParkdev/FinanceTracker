import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import App from './App.jsx';
import './index.css';
import { getToken } from './utils/auth.js';
import { ThemeProvider } from './utils/ThemeContext.jsx';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL ||'http://localhost:3001/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    </ThemeProvider>
  </StrictMode>
);