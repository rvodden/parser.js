import React from 'react';
import {TextField} from '@material-ui/core';
import './App.css';

/**
 * A test react app to demonstrate how awesome we are!
 *
 * @return {Component} a react component which is the app.
 */
function App() {
  return (
    <div className='App'>
      <TextField id="outlined-basic" variant="outlined" />
    </div>
  );
}

export default App;
