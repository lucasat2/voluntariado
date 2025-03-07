// config/db.js
const RocksDB = require('rocksdb');
const path = require('path');
const levelup = require('levelup');

// Configuração do RocksDB
const dbPath = path.join(__dirname, '../db'); // Caminho para o banco de dados
const db = new RocksDB(dbPath);

// Abrir o banco de dados
db.open((err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err);
  } else {
    console.log('Banco de dados RocksDB está pronto!');
  }
});

module.exports = db;