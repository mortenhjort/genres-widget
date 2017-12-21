import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import gql from 'graphql-tag';
import GenreFamily from './GenreFamily';
import './GenreWidget.css';

const genres = [
  { id: '001', name: 'pop' },
  { id: '002', name: 'rap' },
  { id: '003', name: 'lounge' },
  { id: '004', name: 'any pop', parent: '001' },
  { id: '005', name: 'danish any pop', parent: '001', country: '001' },
  { id: '006', name: 'lounge' },
  { id: '007', name: 'lorem' },
  { id: '008', name: 'ipsum' },
  { id: '009', name: 'dolore' },
  { id: '010', name: 'prosto' },
  { id: '011', name: 'kakat' },
  { id: '012', name: 'livan' },
  { id: '013', name: 'root' },
];

@graphql(gql`
  query {
    todos {
      id
      text
    }
  }
`)
export default class GenreWidget extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      tree: this.getTree(genres),
      genres,
      newGenre: null,
    };
  }
  getTree(_genres) {
    let tree = [];
    let childGenres = [];

    _genres.forEach(item => {
      if (item.parent) {
        // { ...item } is neccessary for splitting object references with original 'genres'
        childGenres.push({ ...item });
      } else {
        tree.push({ ...item });
      }
    });
    childGenres.forEach(childItem => {
      const parent = tree.find(parentItem => parentItem.id === childItem.parent);

      if (parent) {
        if (parent.children) {
          parent.children.push(childItem);
        } else {
          parent.children = [childItem];
        }
      }
    });

    return tree;
  }
  applyGenreChanges = (genre) => {
    const newGenres = this.state.genres.map(item => item.id === genre.id ? { ...item, name: genre.name } : item);

    this.setState({ genres: newGenres, tree: this.getTree(newGenres) });
  }
  changeParent = (newParent, child) => {
    if (newParent.parent) return;

    const newGenres = this.state.genres.map(item => item.id === child.id ? { ...item, parent: newParent.id } : item);

    this.setState({ genres: newGenres, tree: this.getTree(newGenres) });
  }
  removeParent = (genre) => {
    if (!genre.parent) return;

    const newGenres = this.state.genres.map(item => {
      if (item.id !== genre.id) return item;
      const newGenre = { ...item };

      delete newGenre.parent;
      return newGenre;
    });

    this.setState({ genres: newGenres, tree: this.getTree(newGenres) });
  }
  removeGenre = (genre) => {
    const newGenres = this.state.genres.filter(item => item.id !== genre.id);

    this.setState({ genres: newGenres, tree: this.getTree(newGenres) });
  }
  editNewGenre = () => {
    this.setState({ newGenre: { id: `new_${Date.now()}`, name: 'new' } });
  }
  saveNewGenre = (genre) => {
    const newGenres = [genre, ...this.state.genres];

    this.setState({ genres: newGenres, tree: this.getTree(newGenres), newGenre: null });
  }

  render() {
    const { tree, newGenre } = this.state;
    const {
      applyGenreChanges,
      editNewGenre,
      saveNewGenre,
      changeParent,
      removeParent,
      removeGenre,
    } = this;

    return (
      <div className="wrapper">
        <div className="genres">
          <div className="genres__header">
            <h3 className="genres__caption">
              Genres
            </h3>
            <div>
              <button className="genres__btn">
                <FontAwesome name="plus" onClick={editNewGenre} />
              </button>
            </div>
          </div>
          {newGenre && (
            <GenreFamily
              item={newGenre}
              editing
              applyChanges={saveNewGenre}
              changeParent={changeParent}
              removeParent={removeParent}
              removeGenre={removeGenre}
            />
          )}
          {tree.map(item => (
            <GenreFamily
              key={item.id}
              keyT={item.id}
              item={item}
              applyChanges={applyGenreChanges}
              changeParent={changeParent}
              removeParent={removeParent}
              removeGenre={removeGenre}
            />
          ))}
        </div>
      </div>
    );
  }
}

