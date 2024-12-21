// src/api/products/products.js

import { getConnection } from '../../lib/db.js';

export const getProducts = async (req, res) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM PROIZVOD');
    res.json(rows);
  } finally {
    await connection.end();
  }
};

export const addProduct = async (req, res) => {
  const { Naziv, Marka, Cijena_proizvoda } = req.body;
  const connection = await getConnection();
  try {
    await connection.execute(
      'INSERT INTO PROIZVOD (Naziv, Marka, Cijena_proizvoda) VALUES (?, ?, ?)',
      [Naziv, Marka, Cijena_proizvoda]
    );
    res.status(201).json({ message: 'Proizvod uspješno dodan' });
  } finally {
    await connection.end();
  }
};

export const updateProduct = async (req, res) => {
  const { Sifra_proizvoda } = req.params;
  const { Naziv, Marka, Cijena_proizvoda } = req.body;
  const connection = await getConnection();
  try {
    await connection.execute(
      'UPDATE PROIZVOD SET Naziv = ?, Marka = ?, Cijena_proizvoda = ? WHERE Sifra_proizvoda = ?',
      [Naziv, Marka, Cijena_proizvoda, Sifra_proizvoda]
    );
    res.json({ message: 'Proizvod uspješno ažuriran' });
  } finally {
    await connection.end();
  }
};

export const deleteProduct = async (req, res) => {
  const { Sifra_proizvoda } = req.params;
  const connection = await getConnection();
  try {
    await connection.execute('DELETE FROM PROIZVOD WHERE Sifra_proizvoda = ?', [Sifra_proizvoda]);
    res.json({ message: 'Proizvod uspješno izbrisan' });
  } finally {
    await connection.end();
  }
};