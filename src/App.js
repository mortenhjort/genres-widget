import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import GenreWidget from './components/GenreWidget';
import GenreSelect from './components/GenreSelect';
import './App.css';

@DragDropContext(HTML5Backend)
export default class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <GenreWidget />
        <GenreSelect />
      </div>
    );
  }
}
