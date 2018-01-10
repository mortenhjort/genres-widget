import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import GenreFamily from './GenreFamily';
import './GenreWidget.css';

@graphql(gql`
  query {
    genres {
      id
      displayTitle
      parent {
        id
      }
      country {
        id
        displayTitle
      }
    }
  }
`)
@compose(
  graphql(gql`
    mutation($genre: GenreInput!) {
      createGenre(genre: $genre) {
        id
        displayTitle
        parent {
          id
        }
        country {
          id
        }
      }
    }
  `, { name: 'createGenreMutation' }),
  graphql(gql`
    mutation($genre: GenreInput!, $genreId: ID!) {
      updateGenre(genre: $genre, genreId: $genreId) {
        id
        displayTitle
        parent {
          id
        }
        country {
          id
        }
      }
    }
  `, { name: 'updateGenreMutation' }),
  graphql(gql`
    mutation($genreId: ID!) {
      removeGenre(genreId: $genreId)
    }
  `, { name: 'removeGenreMutation' }),
)
export default class GenreWidget extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      genres: PropTypes.array,
      refetch: PropTypes.func,
    }).isRequired,
    createGenreMutation: PropTypes.func.isRequired,
    updateGenreMutation: PropTypes.func.isRequired,
    removeGenreMutation: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      tree: [],
      genres: [],
      newGenre: null,
    };
  }
  componentWillReceiveProps(props) {
    const { genres } = props.data;

    this.setState({
      genres,
      tree: this.getTree(genres)
    });
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
      const parent = tree.find(parentItem => parentItem.id === childItem.parent.id);

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
  applyGenreChanges = async (genre) => {
    await this.props.updateGenreMutation({ variables: {
      genre: {
        displayTitle: genre.displayTitle,
        country: genre.country && genre.country.id,
      },
      genreId: genre.id
    } });
    this.props.data.refetch();
  }
  changeParent = async (newParent, child) => {
    if (newParent.parent) return;

    await this.props.updateGenreMutation({ variables: {
      genre: {
        parent: newParent.id,
      },
      genreId: child.id
    } });
    this.props.data.refetch();
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
  removeGenre = async (genre) => {
    await this.props.removeGenreMutation({ variables: { genreId: genre.id } });
    this.props.data.refetch();
  }
  editNewGenre = () => {
    this.setState({ newGenre: { id: `new_${Date.now()}`, displayTitle: 'new' } });
  }
  saveNewGenre = async (genre) => {
    await this.props.createGenreMutation({ variables: { genre: { displayTitle: genre.displayTitle } } });
    this.setState({ newGenre: null });
    this.props.data.refetch();
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
    const {
      loading
    } = this.props.data;

    return (
      <div className="wrapper">
        <div className="genres">
          <div className="genres__header">
            <h3 className="genres__caption">
              Genres
            </h3>
            <div>
              {loading
                ? <span className="genres__btn">
                  <FontAwesome name="spinner" spin />
                </span>
                : <button className="genres__btn" onClick={editNewGenre}>
                  <FontAwesome name="plus" />
                </button>
              }
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

