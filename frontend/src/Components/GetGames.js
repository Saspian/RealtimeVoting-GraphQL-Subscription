import React from 'react';
import { gql, useQuery } from '@apollo/react-hooks';

export default () => {
  const GET_GAMES = gql`
    query GetGames {
      games {
        name
        votes
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_GAMES);
  if (loading) console.log('loading...');
  if (error) console.log(error, 'error...');
  if (data) console.log(data, 'data...');
  return (
    <div>
      {loading ? <p>Loading...</p> : null}
      {error ? (
        <p>
          Sorry an error occured...
          <br />
          {error.message}
        </p>
      ) : null}
      {data
        ? data.games.map((game) => (
            <div key={game.name}>
              <h3>Game: {game.name}</h3>
              <p>Total Votes: {game.votes}</p>
            </div>
          ))
        : null}
    </div>
  );
};
