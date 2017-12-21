import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import GenreWidget from './components/GenreWidget';
import './App.css';

@DragDropContext(HTML5Backend)
export default class App extends Component {
  render() {
    return <GenreWidget />;
  }
}
