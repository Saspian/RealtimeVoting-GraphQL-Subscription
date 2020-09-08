import {
  split,
  HttpLink,
  ApolloClient,
  InMemoryCache,
} from '@apollo/react-hooks';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const httpLink = new HttpLink({
  uri: 'http://localhost:4747/graphql',
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4747/graphql`,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export default new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
