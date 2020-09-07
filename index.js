const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
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
  schema {
    query: Query
    mutation: Mutation
  }
`;
const resolvers = {
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
    vote: async (_, args) => {
      try {
        const addVote = await Game.findOneAndUpdate(
          { name: args.game },
          { $inc: { votes: 1 } }
        );
        return addVote;
      } catch (error) {
        return error;
      }
    },
  },
};

const app = express();
app.use(bodyParser.json());
require('dotenv/config');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => ({ req, res }),
});

server.applyMiddleware({ app });

//CONNECTING TO THE DATABASE
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
  console.log('Connected to the database');
});

const PORT = 4747;

app.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});
