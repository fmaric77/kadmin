// src/api/customers.js

import { getConnection } from '../../lib/db.js';

export const getCustomers = async (req, res) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM KUPAC');
    res.json(rows);
  } finally {
    await connection.end();
  }
};

export const addCustomer = async (req, res) => {
  const { Ime_kupca, Prezime_kupca, Adresa_kupca, E_mail } = req.body;
  const connection = await getConnection();
  try {
    await connection.execute(
      'INSERT INTO KUPAC (Ime_kupca, Prezime_kupca, Adresa_kupca, E_mail) VALUES (?, ?, ?, ?)',
      [Ime_kupca, Prezime_kupca, Adresa_kupca, E_mail]
    );
    res.status(201).json({ message: 'Customer added successfully' });
  } finally {
    await connection.end();
  }
};

export const updateCustomer = async (req, res) => {
  const { Sifra_kupca } = req.params;
  const { Ime_kupca, Prezime_kupca, Adresa_kupca, E_mail } = req.body;
  const connection = await getConnection();
  try {
    await connection.execute(
      'UPDATE KUPAC SET Ime_kupca = ?, Prezime_kupca = ?, Adresa_kupca = ?, E_mail = ? WHERE Sifra_kupca = ?',
      [Ime_kupca, Prezime_kupca, Adresa_kupca, E_mail, Sifra_kupca]
    );
    res.json({ message: 'Customer updated successfully' });
  } finally {
    await connection.end();
  }
};

export const deleteCustomer = async (req, res) => {
  const { Sifra_kupca } = req.params;
  const connection = await getConnection();
  try {
    await connection.execute('DELETE FROM KUPAC WHERE Sifra_kupca = ?', [Sifra_kupca]);
    res.json({ message: 'Customer deleted successfully' });
  } finally {
    await connection.end();
  }
};