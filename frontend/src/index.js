import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App';

// v1
// invalid import - https://github.com/apollographql/apollo-client/issues/3069
// import ApolloClient from 'apollo-boost'
// const client = new ApolloClient({
//     uri: 'http://localhost:4004',
//     headers: {
//         token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
//     }
// })

// v2 - https://www.apollographql.com/docs/tutorial/client#apollo-client-setup
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4004/my-graphql',
      headers: {
          token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
      }
})
const client = new ApolloClient({
  cache,
  link
})

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
                <App />
            </ApolloHooksProvider>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
