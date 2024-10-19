const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');


var app = express();

let port = 3005
let hostname = "127.0.0.1"

var cors = function (req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(cors);

app.use(bodyParser.json())

const baseDir = 'C:\\Users\\Alexe\\Documents\\TestForMPK';
//app.use('/files', express.static(baseDir));

app.post('/find-file', (req, res) => {
    const { folderName, fileKeyword } = req.body;

    // Путь к папке, в которой нужно искать
    const folderPath = path.join(baseDir, folderName, 'Mittaukset');

    // Проверяем, существует ли папка
    if (fs.existsSync(folderPath)) {
        // Если fileKeyword не задан (пустой), возвращаем все файлы
        let files;
        if (!fileKeyword) {
            // Все файлы в папке
            files = fs.readdirSync(folderPath).filter(file => file.endsWith('.xls') || file.endsWith('.xlsx'));
        } else {
          // Ищем файлы, содержащие ключевое слово
          files = fs.readdirSync(folderPath).filter(file => {
            return file.includes(fileKeyword) && (file.endsWith('.xls') || file.endsWith('.xlsx'));
          });
        }
    
        if (files.length > 0) {
            // Генерируем URL-адреса для файлов, доступных через сервер
            const filePaths = files.map(file => path.join('files', folderName, 'Mittaukset', file)); // Возвращаем относительные пути
            res.json({ filePaths });
      } else {
        res.status(404).json({ error: 'tiedosto ei löydetty' });
      }
    } else {
      res.status(404).json({ error: 'Kansio ei löydetty' });
    }
  });
/*
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
    */

// Маршрут для доступа к оригинальным файлам
app.get('/files/*', (req, res) => {
    const filePath = path.join(baseDir, req.params[0]);
    console.log(filePath)
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath); // Отправляем файл клиенту
    } else {
        res.status(404).send('File not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});