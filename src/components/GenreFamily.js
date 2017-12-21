import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
// import FontAwesome from 'react-fontawesome';
import GenreItem from './GenreItem';
import dropTypes from '../libs/dropTypes';

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    dropHover: monitor.isOver(),
    dropItem: monitor.getItem(),
    didDrop: monitor.didDrop(),
  }
}

@DropTarget(dropTypes.GENRE_ITEM, {
  drop(props, monitor) {
    props.changeParent(props.item, monitor.getItem().item);
  }
}, collect)
export default class GenreFamily extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    changeParent: PropTypes.func.isRequired,

    connectDropTarget: PropTypes.func.isRequired,
    dropHover: PropTypes.bool.isRequired,
    dropItem: PropTypes.object.isRequired,
    didDrop: PropTypes.bool.isRequired,
  };

  render() {
    const { item, connectDropTarget, dropHover, dropItem, didDrop, ...props } = this.props;

    return connectDropTarget(
      <div>
        <div className={`genres__family${dropHover && dropItem.item.id !== item.id ? ' genres__family--drop-hover' : ''}`}>
          <GenreItem item={item} isParent={!!item.children} {...props} />
          {item.children && item.children.map(_item => <GenreItem isChild key={_item.id} item={_item} {...props} />)}
        </div>
      </div>
    );
  }
}
