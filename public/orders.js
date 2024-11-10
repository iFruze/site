document.addEventListener('DOMContentLoaded', function() {
    // Функция для получения всех заказов
    function fetchOrders() {
        fetch('/orders')  // Запрос на сервер для получения всех заказов
            .then(response => response.json())
            .then(data => {
                // Очистим таблицу перед добавлением новых данных
                const tableBody = document.querySelector('#orders-table tbody');
                tableBody.innerHTML = '';

                // Добавляем заказы в таблицу
                data.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${order.id}</td>
                        <td>${order.title}</td>
                        <td>${order.quantity}</td>
                        <td>${order.total_price}р</td>
                        <td>${order.customer_name}</td>
                        <td>${order.customer_address}</td>
                        <td>${order.customer_phone}</td>
                        <td>${order.order_date}</td>
                        <td><button class="delete-btn" data-id="${order.id}">Выполнен</button></td>
                    `;
                    tableBody.appendChild(row);
                });

                // Добавляем обработчик событий для кнопок удаления
                const deleteButtons = document.querySelectorAll('.delete-btn');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const orderId = this.getAttribute('data-id');
                        deleteOrder(orderId);
                    });
                });
            })
            .catch(error => {
                console.error('Ошибка при получении заказов:', error);
                alert('Произошла ошибка при загрузке заказов.');
            });
    }

    // Функция для удаления заказа
    function deleteOrder(orderId) {
        if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
            fetch(`/delete-order/${orderId}`, {  // Запрос на удаление заказа по ID
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при удалении заказа');
                }
                alert('Заказ удалён');
                fetchOrders(); // Перезагружаем список заказов
            })
            .catch(error => {
                console.error('Ошибка при удалении заказа:', error);
                alert('Произошла ошибка при удалении заказа.');
            });
        }
    }

    // Загружаем заказы при загрузке страницы
    fetchOrders();
});
