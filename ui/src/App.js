import React from 'react';
import logo from './logo.svg';
import './App.css';

console.log(logo)

/**
 * A test react app to demonstrate how awesome we are!
 *
 * @return {Component} a react component which is the app.
 */
function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
