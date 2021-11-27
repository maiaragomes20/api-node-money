var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var db = new sqlite3.Database('./home/maiara/cadastro.db');

app.get('/', function(req,res){
  res.send("CRUD APLICACAO [CREATE] URL 'http://localhost:3000/add/(id number)/(name)'                    [READ] 'http://localhost:3000/view/(id number)'                   [UPDATE] 'http://localhost:3000/update/(id number)/(new name)'                     [DELETE] 'http://localhost:3000/del/(id number)' t                           Para fechar  'http://localhost:3000/close'");
});

app.post('/add/:id/:name', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO cadastro(id,nome_solicitante) VALUES(?,?)', [req.params.id, req.params.name], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("Nova insercao");
    });
});
});

app.get('/cadastro/:id', function(req,res){
  db.serialize(()=>{
    db.each('SELECT * FROM cadastro', [req.params.id], function(err,row){     
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` Solicitacoes`);
      console.log("Entry displayed successfully");
    });
  });
});

app.put('/update/:id/:name', function(req,res){
  db.serialize(()=>{
    db.run('UPDATE cadastro SET nome_solicitante = ? WHERE id_cadastro = ?', [req.params.name,req.params.id], function(err){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      res.send("Entrada atualizada");
    });
  });
});

app.delete('/del/:id', function(req,res){
  db.serialize(()=>{
    db.run('DELETE FROM cadastro WHERE id_cadastro = ?', req.params.id, function(err) {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.send("Entrada deletada");
    });
  });
});

app.get('/close', function(req,res){
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });
});

server.listen(3000,function(){ 
    console.log("Server listening on port: 3000");
});
