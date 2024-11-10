import React, { Component } from 'react'

export class Categories extends Component {
    constructor(props){
        super(props)
        this.state ={
            ctg:[
                {
                    key: 'all',
                    name: 'Всё'
                },
                {
                    key: 'shl',
                    name: 'Шлемы'
                },
                {
                    key: 'velM',
                    name: 'Майки'
                },
                {
                    key: 'velT',
                    name: 'Штаны/шорты'
                },
                {
                    key: 'golov',
                    name: 'Головные уборы'
                },
                {
                    key: 'och',
                    name: 'Очки'
                },
                {
                    key: 'perch',
                    name: 'Перчатки'
                },
                {
                    key: 'obv',
                    name: 'Туфли'
                },
                {
                    key: 'cycle',
                    name: 'Велосипеды'
                }
            ]
        }
    }
  render() {
    return (
      <div className='categories'>
        {this.state.ctg.map(el=>(
            <div key={el.key} onClick={()=>this.props.chooseCategory(el.key)}>{el.name}</div>
        ))}
      </div>
    )
  }
}

export default Categories