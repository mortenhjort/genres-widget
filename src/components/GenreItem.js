import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import FontAwesome from 'react-fontawesome';
import dropTypes from '../libs/dropTypes';

const cardSource = {
  beginDrag(props) {
    return { ...props };
  },
  canDrag(props) {
    return !props.isParent;
  },
};

@DragSource(dropTypes.GENRE_ITEM, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class GenreItem extends Component {
  static defaultProps = {
    isChild: false,
    isParent: false,
  }
  static propTypes = {
    item: PropTypes.object.isRequired,
    isChild: PropTypes.bool,
    isParent: PropTypes.bool,
    applyChanges: PropTypes.func.isRequired,
    removeParent: PropTypes.func.isRequired,
    removeGenre: PropTypes.func.isRequired,

    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }
  getInitialState(props) {
    return {
      editing: props.editing,
      displayTitle: this.props.item.displayTitle,
    };
  }
  startEdit = () => {
    this.setState({ editing: true });
  }
  cancelEdit = () => {
    this.setState({ editing: false, displayTitle: this.props.item.displayTitle });
  }
  handleInput = (event) => {
    this.setState({ displayTitle: event.target.value });
  }
  applyChanges = () => {
    this.props.applyChanges({ ...this.props.item, displayTitle: this.state.displayTitle });
    this.setState({ editing: false });
  }
  removeParent = () => {
    this.props.removeParent(this.props.item);
    this.setState({ editing: false });
  }
  removeSelf = () => {
    this.props.removeGenre(this.props.item);
  }

  render() {
    const {
      isDragging,
      connectDragSource,
      isChild,
      isParent,
      item,
    } = this.props;
    const {
      editing,
      displayTitle,
    } = this.state;
    const {
      startEdit,
      cancelEdit,
      handleInput,
      applyChanges,
      removeParent,
      removeSelf,
    } = this;

    return connectDragSource(
      <div
        className={`genres__item${!isChild ? ' genres__parent' : ''}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        onDragStart={() => false}
      >
        <div className="genres__caption">
          {
            editing ? (
              <span>
                <input type="text" value={displayTitle} className="genres__input" onChange={handleInput} />
                <button className="genres__btn" onClick={applyChanges}>
                  <FontAwesome name="check" style={{ color: '#56b563' }} />
                </button>
                <button className="genres__btn" onClick={cancelEdit}>
                  <FontAwesome name="close" style={{ color: '#b54820' }} />
                </button>
              </span>
            ) : (
              <span>
                {isChild && (
                  <button className="genres__btn" onClick={removeParent}>
                    <FontAwesome name="angle-left" style={{ color: '#999', marginRight: '6px' }} />
                  </button>
                )}
                {displayTitle}
              </span>
            )
          }
        </div>
        <div>
          {!editing && (
            <button className="genres__btn" onClick={startEdit}>
              <FontAwesome name="pencil" />
            </button>
          )}
          {(isChild || !isParent) && (
            <button className="genres__btn">
              <FontAwesome name="flag" />&nbsp;
              {item.country && item.country.displayTitle}
            </button>
          )}
          {(isChild || !isParent) ? (
            <button className="genres__btn" onClick={removeSelf}>
              <FontAwesome name="trash" />
            </button>
          ) : (
            <button className="genres__btn" disabled>
              <FontAwesome name="lock" />
            </button>
          )}
        </div>
      </div>
    );
  }
}
