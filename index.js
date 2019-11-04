const path = require('path')
const express = require('express');
const app = express();
const port = 9000;
const hbs = require('hbs');
const bodyParser= require('body-parser');
const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'buku_db'
})

conn.connect((err) => {
    if (err) throw err
    console.log('Mysql Connected ...')
})

app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'hbs')

  // use body parser middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
      extended: false
  }))

  // set public folder
  app.use('/assets', express.static(__dirname + '/public'))

  // routes
  // index : post list
  app.get('/', (req, res) => {
      var sql = 'select * from buku'
      var query = conn.query(sql, (err, results) => {
          if (err) throw err
          res.render('index', {
              buku: results
          })
      })
  })

  // save new post
  app.post('/buku', (req, res) => {
      var data = {
          judul_buku: req.body.judul_buku,
          nama_pengarang: req.body.nama_pengarang
      }
      var sql = 'insert into buku set ?'
      var query = conn.query(sql, data, (err, results) => {
          if (err) throw err
          res.redirect('/')
      })
  })

  // update post
  app.put('/buku/edit', (req, res) => {
      var sql = 'update buku set judul_buku="'+req.body.judul_buku+'", nama_pengarang="'+req.body.nama_pengarang+'" where id_buku='+req.body.id_buku
      var query = conn.query(sql, (err, results) => {
          if (err) throw err
          res.redirect('/')
      })
  })

  // delete post
  app.delete('/buku/delete', (req, res) => {
      var sql = 'delete from buku where id_buku='+req.body.id_buku+''
      var query = conn.query(sql, (err, results) => {
          if (err) throw err
          res.redirect('/')
      })
  })

  // listen server
  app.listen(9000, () => {
      console.log('Server is running at port 9000')
  })