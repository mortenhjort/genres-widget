import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

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
export default class GenreSelect extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      genres: PropTypes.array,
    }).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      selectedGenre: null,
    };
  }
  handleSelect = (e) => {
    this.setState({ selectedGenre: e.target.value });
  }

  render() {
    const {
      selectedGenre,
    } = this.state;
    const {
      handleSelect,
    } = this;
    const {
      loading,
      genres,
    } = this.props.data;

    return (
      <select value={selectedGenre} onChange={handleSelect}>
        {loading && <option selected>Loading...</option>}
        {genres && genres.map(item => <option value={item.id} key={item.id}>{item.displayTitle}</option>)}
      </select>
    );
  }
}

