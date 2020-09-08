import React from 'react';
import './App.css';
import Vote from './Components/Vote';
import apolloClient from './ApolloServer';
import { ApolloProvider } from '@apollo/react-hooks';
import BarChart from './Components/BarChart';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <h1 style={{ color: '#2e86de' }}>VOTE YOUR FAVORITE GAME</h1>
        <Vote />
        <BarChart />
      </div>
    </ApolloProvider>
  );
}

export default App;
