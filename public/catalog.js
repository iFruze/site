document.addEventListener('DOMContentLoaded', function() {
    // Функция для получения товаров с сервера
    function fetchProducts() {
        fetch('/products')  // Запрос на сервер для получения всех товаров
            .then(response => response.json())
            .then(data => {
                const productList = document.getElementById('product-list');
                productList.innerHTML = '';  // Очистить список товаров перед добавлением новых

                // Перебор полученных товаров и добавление карточек
                data.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.setAttribute('data-id', product.id); // Устанавливаем ID товара

                    productCard.innerHTML = `
                        <img src="${product.image_path}" alt="${product.title}" class="product-image">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-description">${product.description}</p>
                        <p class="product-price">${product.cost} р.</p>
                        <button class="delete-btn">Удалить</button>
                    `;

                    // Добавляем карточку товара в контейнер
                    productList.appendChild(productCard);

                    // Слушатель для кнопки удаления
                    const deleteButton = productCard.querySelector('.delete-btn');
                    deleteButton.addEventListener('click', function() {
                        deleteProduct(product.id); // Удаление товара по его ID
                    });
                });
            })
            .catch(error => {
                console.error('Ошибка при получении товаров:', error);
                alert('Произошла ошибка при загрузке товаров.');
            });
    }

    // Функция для удаления товара
    function deleteProduct(productId) {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            fetch(`/delete-product/${productId}`, {
                method: 'DELETE',  // Используем DELETE метод
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Товар успешно удалён');
                    fetchProducts();  // Обновляем список товаров после удаления
                } else {
                    alert('Ошибка при удалении товара');
                }
            })
            .catch(error => {
                console.error('Ошибка при удалении товара:', error);
                alert('Произошла ошибка при удалении товара.');
            });
        }
    }

    // Загружаем товары при загрузке страницы
    fetchProducts();
});
