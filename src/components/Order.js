import React, { Component } from 'react';
import { FaTrash } from 'react-icons/fa';
import { CiMoneyCheck1 } from "react-icons/ci";

export class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOrderForm: false, // Состояние для отображения формы заказа
      name: '',
      address: '',
      phone: '',
      quantity: 1,
      totalPrice: this.props.item.cost, // Изначальная стоимость товара
    };
  }

  // Метод для переключения видимости формы заказа
  toggleOrderForm = () => {
    this.setState(prevState => ({
      showOrderForm: !prevState.showOrderForm
    }));
  };

  // Обработчик изменения количества товара
  handleQuantityChange = (event) => {
    const quantity = event.target.value;
    const totalPrice = quantity * this.props.item.cost; // Вычисляем итоговую цену
    this.setState({ quantity, totalPrice });
  };

  // Обработчик отправки формы
  // handleSubmit = (event) => {
  //   event.preventDefault();
  //   const { name, address, phone, quantity, totalPrice } = this.state;

  //   // Логика для обработки заказа (например, отправка на сервер)
  //   alert(`Ваш заказ принят!\nТовар: ${this.props.item.title}\nКоличество: ${quantity}\nИтого: ${totalPrice}р\nИмя: ${name}\nАдрес: ${address}\nТелефон: ${phone}`);
    
  //   // Закрываем форму после отправки
  //   this.setState({ showOrderForm: false });
  // };
  handleSubmit = (event) => {
    event.preventDefault();
    const { name, address, phone, quantity, totalPrice } = this.state;

    // Проверим, что все данные корректны
    if (!name || !address || !phone || !quantity || !totalPrice) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }

    // Отправляем данные о заказе на сервер
    fetch('/add-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId: this.props.item.id,  // Отправляем ID товара
            quantity: quantity,             // Отправляем количество
            totalPrice: totalPrice,         // Отправляем итоговую цену
            customerName: name,             // Имя клиента
            customerAddress: address,       // Адрес клиента
            customerPhone: phone            // Телефон клиента
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка на сервере');
        }
        return response.text();
    })
    .then(data => {
        alert('Ваш заказ принят!');
        this.setState({ showOrderForm: false });
    })
    .catch(error => {
        console.error('Ошибка при оформлении заказа:', error);
        alert('Произошла ошибка при оформлении заказа. Попробуйте снова.');
    });
};


  render() {
    return (
      <div className='item'>
        <img src={this.props.item.imageUrl} alt={this.props.item.title} />
        <h2>{this.props.item.title}</h2>
        <b>{this.props.item.cost}р.</b>

        {/* Иконка для открытия формы заказа */}
        <CiMoneyCheck1 className='order-icon' onClick={this.toggleOrderForm} />
        
        {/* Иконка для удаления */}
        <FaTrash className='delete-icon' onClick={() => this.props.onDelete(this.props.item.id)} />

        {/* Условный рендеринг формы заказа */}
        {this.state.showOrderForm && (
          <div className="order-form">
            <h3>Форма заказа</h3>
            <p>Товар: {this.props.item.title}</p>
            <p>Цена: {this.props.item.cost}р</p>
            <p>Общая стоимость: {this.state.totalPrice}р</p>

            {/* Поля ввода */}
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                placeholder="Ваше имя"
                required
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Адрес"
                required
                value={this.state.address}
                onChange={(e) => this.setState({ address: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Телефон"
                required
                value={this.state.phone}
                onChange={(e) => this.setState({ phone: e.target.value })}
              />
              <input
                type="number"
                placeholder="Количество товара"
                required
                value={this.state.quantity}
                onChange={this.handleQuantityChange}
              />
              <button type="submit">Заказать</button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default Order;
