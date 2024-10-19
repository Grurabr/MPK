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

    // path to folder jossa etsimme
    const folderPath = path.join(baseDir, folderName, 'Mittaukset');

    // onko olemassa kansio
    if (fs.existsSync(folderPath)) {
        // Jos työnumero tyhjä, etsimme kaikki tiedostot nimikenumerolla
        let files;
        if (!fileKeyword) {
            
            files = fs.readdirSync(folderPath).filter(file => file.endsWith('.xls') || file.endsWith('.xlsx'));
        } else {
          
          files = fs.readdirSync(folderPath).filter(file => {
            return file.includes(fileKeyword) && (file.endsWith('.xls') || file.endsWith('.xlsx'));
          });
        }
    
        if (files.length > 0) {
            
            const filePaths = files.map(file => path.join('files', folderName, 'Mittaukset', file));
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

app.get('/files/*', (req, res) => {
    const filePath = path.join(baseDir, req.params[0]);
    console.log(filePath)
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath); 
    } else {
        res.status(404).send('File not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});