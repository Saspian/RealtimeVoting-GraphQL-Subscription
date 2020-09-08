const express = require('express');
const http = require('http');
const { ApolloServer, gql, PubSub } = require('apollo-server-express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Game = require('./Model/Game');

const typeDefs = gql`
  type Game {
    name: String!
    votes: Int
  }
  input AddGames {
    name: String!
    votes: Int = 0
  }
  type Query {
    games: [Game!]!
  }
  type Mutation {
    addGames(gameInput: AddGames): Game!
    vote(game: String!): Game!
  }
  type Subscription {
    allGames: [Game!]!
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
const NEW_VOTE = 'NEW_VOTE';
const resolvers = {
  Subscription: {
    allGames: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_VOTE),
    },
  },
  Query: {
    games: async () => {
      try {
        const games = await Game.find();
        return games.map((game) => {
          return game;
        });
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    addGames: async (_, args) => {
      const game = new Game({
        name: args.gameInput.name,
        votes: args.gameInput.votes,
      });
      try {
        await game.save();
        return game;
      } catch (error) {
        return error;
      }
    },
    vote: async (_, args, { pubsub }) => {
      try {
        const addVote = await Game.findOneAndUpdate(
          { name: args.game },
          { $inc: { votes: 1 } }
        );
        const games = await Game.find();
        pubsub.publish(NEW_VOTE, { allGames: games });
        return addVote;
      } catch (error) {
        return error;
      }
    },
  },
};

const pubsub = new PubSub();
const app = express();
app.use(bodyParser.json());
require('dotenv/config');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => ({ req, res, pubsub }),
});

const PORT = 4747;
server.applyMiddleware({ app });

//CONNECTING TO THE DATABASE
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
  console.log('Connected to the database');
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(
    `Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
