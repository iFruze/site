import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Items from "./components/Items";
import Categories from "./components/Categories";
import ShowFullItem from "./components/ShowFullItem";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      items: [],
      currentItems: [],
      showFullItem: false,
      fullItem: {}
    };
    this.addToOrder = this.addToOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.chooseCategory = this.chooseCategory.bind(this);
    this.onShowItem = this.onShowItem.bind(this);
  }

  componentDidMount() {
    // Получаем данные о товарах с сервера
    fetch('/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const itemsWithImages = data.map(item => {
          // Создаем URL для изображения с учетом новой структуры серверной части
          return {
            ...item,
            imageUrl: `/${item.image_path}`, // Составляем полный путь для отображения изображения
          };
        });
        console.log('Полученные данные:', itemsWithImages);
        this.setState({ items: itemsWithImages, currentItems: itemsWithImages });
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  }

  render() {
    return (
      <div className="wrapper">
        <Header orders={this.state.orders} onDelete={this.deleteOrder} />
        <Categories chooseCategory={this.chooseCategory} />
        <Items onShowItem={this.onShowItem} items={this.state.currentItems} onAdd={this.addToOrder} />
        {this.state.showFullItem && <ShowFullItem onAdd={this.addToOrder} onShowItem={this.onShowItem} item={this.state.fullItem} />}
        <Footer />
      </div>
    );
  }

  onShowItem(item) {
    this.setState({ fullItem: item, showFullItem: !this.state.showFullItem });
  }
  
  deleteOrder(id) {
    this.setState({ orders: this.state.orders.filter(el => el.id !== id) });
  }

  chooseCategory(cat) {
    if (cat === 'all') {
      this.setState({ currentItems: this.state.items });
      return;
    }
    this.setState({
      currentItems: this.state.items.filter(el => el.category === cat), // Фильтрация по категории
    });
  }
  
  addToOrder(item) {
    let isInArray = this.state.orders.some(el => el.id === item.id);
    if (!isInArray) {
      this.setState({ orders: [...this.state.orders, item] }, () => console.log(this.state.orders));
    }
  }

}

export default App;
