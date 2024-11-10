// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const multer = require('multer');
// const bodyParser = require('body-parser');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const PORT = 3000;

// // Папка для хранения изображений
// const uploadFolder = path.join(__dirname, 'uploads');

// // Проверяем, существует ли папка для изображений, если нет — создаем её
// if (!fs.existsSync(uploadFolder)) {
//     fs.mkdirSync(uploadFolder);
// }

// // Обработка маршрута для главной страницы
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// // Обработка маршрута для страницы добавления предмета
// app.get('/autentif.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'autentif.html'));
// });

// // Получение списка товаров
// // На сервере, в маршруте /products
// app.get('/products', (req, res) => {
//     db.all(`SELECT * FROM products`, [], (err, rows) => {
//         if (err) {
//             return res.status(500).send(err.message);
//         }
//         console.log('Полученные товары с серверной базы данных:', rows);  // Добавьте этот лог
//         res.json(rows);
//     });
// });

// // Раздача статических файлов из папки uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Настройка базы данных
// const db = new sqlite3.Database('products.db');

// // Создание таблицы, если она не существует
// db.serialize(() => {
//     db.run(`CREATE TABLE IF NOT EXISTS products (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT,
//         description TEXT,
//         category TEXT,
//         cost REAL,
//         image_path TEXT
//     )`);
// });

// // Настройка middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('build'));





// // Запуск сервера
// app.listen(PORT, () => {
//     console.log(`Сервер запущен на http://localhost:${PORT}`);
// });



const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Папка для хранения изображений
const uploadFolder = path.join(__dirname, 'uploads');

// Проверяем, существует ли папка для изображений, если нет — создаем её
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Обработка маршрута для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Получение списка товаров
app.get('/products', (req, res) => {
    db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) {
            console.error('Ошибка при получении товаров: ', err.message);  // Логируем ошибку
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Получение всех заказов
app.get('/orders', (req, res) => {
    db.all(`SELECT o.id, p.title, o.quantity, o.total_price, o.customer_name, o.customer_address, o.customer_phone, o.order_date
            FROM orders o
            JOIN products p ON o.product_id = p.id`, [], (err, rows) => {
        if (err) {
            console.error('Ошибка при получении заказов:', err.message);
            return res.status(500).send(err.message);
        }
        res.json(rows);  // Отправляем данные в формате JSON
    });
});


// Обработка удаления заказа
app.delete('/delete-order/:id', (req, res) => {
    const orderId = req.params.id;

    // Запрос на удаление заказа из базы данных
    db.run(`DELETE FROM orders WHERE id = ?`, [orderId], function(err) {
        if (err) {
            console.error('Ошибка при удалении заказа:', err.message);
            return res.status(500).send('Ошибка при удалении заказа');
        }
        if (this.changes === 0) {
            return res.status(404).send('Заказ не найден');
        }
        res.status(200).send('Заказ удалён');
    });
});

// Удаление товара по ID
app.delete('/delete-product/:id', (req, res) => {
    const productId = req.params.id;  // Получаем ID товара из параметра URL

    // Запрос для удаления товара из базы данных
    db.run('DELETE FROM products WHERE id = ?', [productId], function(err) {
        if (err) {
            console.error('Ошибка при удалении товара:', err);
            return res.status(500).json({ success: false, message: 'Ошибка при удалении товара' });
        }

        if (this.changes === 0) {
            // Если товар не был удален (например, товар не найден)
            return res.status(404).json({ success: false, message: 'Товар не найден' });
        }

        res.json({ success: true });  // Отправляем успешный ответ
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Раздача статических файлов из папки uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Настройка базы данных
const db = new sqlite3.Database('products.db');

// Создание таблиц, если они не существуют
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        category TEXT,
        cost REAL,
        image_path TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        quantity INTEGER,
        total_price REAL,
        customer_name TEXT,
        customer_address TEXT,
        customer_phone TEXT,
        order_date TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )`);
});

// Настройка middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('build'));

// Обработка POST-запроса для добавления заказа
app.post('/add-order', (req, res) => {
    const { productId, quantity, totalPrice, customerName, customerAddress, customerPhone } = req.body;

    if (!productId || !quantity || !totalPrice || !customerName || !customerAddress || !customerPhone) {
        return res.status(400).json({ message: 'Все поля обязательны для заполнения.' });
    }

    const orderDate = new Date().toISOString(); // Получаем текущую дату и время

    db.run(`INSERT INTO orders (product_id, quantity, total_price, customer_name, customer_address, customer_phone, order_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [productId, quantity, totalPrice, customerName, customerAddress, customerPhone, orderDate],
        function (err) {
            if (err) {
                console.error('Ошибка при добавлении заказа: ', err.message); // Логируем ошибку
                return res.status(500).send(err.message);
            }
            res.status(200).send('Заказ успешно добавлен!');
        }
    );
});
// Настройка загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder); // Путь к папке для сохранения изображений
    },
    filename: (req, file, cb) => {
        // Генерируем уникальное имя файла
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename); // Сохраняем файл с уникальным именем
    }
});

const upload = multer({ storage: storage });
// Обработка POST-запроса для добавления товара
app.post('/add-product', upload.single('photo'), (req, res) => {
    const { title, opis, cat, cost } = req.body;
    const imagePath = req.file ? path.join('uploads', req.file.filename) : null;

    db.run(`INSERT INTO products (title, description, category, cost, image_path) VALUES (?, ?, ?, ?, ?)`,
        [title, opis, cat, cost, imagePath],
        function (err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.status(200).send('Товар добавлен!');
        }
    );
});
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
