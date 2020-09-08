import React from 'react';
import { useSubscription, gql } from '@apollo/react-hooks';

export default () => {
  const SUBSCRIBE_VOTE_ADDED = gql`
    subscription VoteAdded {
      allGames {
        name
        votes
      }
    }
  `;

  const { loading, error, data } = useSubscription(SUBSCRIBE_VOTE_ADDED);
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
        ? data.allGames.map((game) => (
            <div key={game.name}>
              <h3>Game: {game.name}</h3>
              <p>Total Votes: {game.votes}</p>
            </div>
          ))
        : null}
    </div>
  );
};
