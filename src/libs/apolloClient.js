import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const isProduction = process.env.NODE_ENV === 'production'
const uri = isProduction ? 'http://graphql.onerights.com' : 'http://localhost:5000'

export default new ApolloClient({
  link: new HttpLink({
    uri,
  }),
  cache: new InMemoryCache()
});
