import React, { Component } from 'react'

export class Item extends Component {
  render() {
    return (
      <div className='item'>
        <img src = {this.props.item.imageUrl} onClick={()=>this.props.onShowItem(this.props.item)}></img>
        <h2>{this.props.item.title}</h2>
        <p>{this.props.item.description || 'Описание не доступно'}</p>
        <b>{this.props.item.cost}р.</b>
        <div className='add-to-cart' onClick={()=>this.props.onAdd(this.props.item)}>+</div>        
      </div>
    )
  }
}

export default Item