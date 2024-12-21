import { getConnection } from '../../lib/db.js';

export const getSellers = async (req, res) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM PRODAVAC');
    res.json(rows);
  } finally {
    await connection.end();
  }
};

export const addSeller = async (req, res) => {
  const { Ime_prodavaca, Adresa_prodavaca, E_mail_prodavaca } = req.body;
  const connection = await getConnection();
  try {
    await connection.execute(
      'INSERT INTO PRODAVAC (Ime_prodavaca, Adresa_prodavaca, E_mail_prodavaca) VALUES (?, ?, ?)',
      [Ime_prodavaca, Adresa_prodavaca, E_mail_prodavaca]
    );
    res.status(201).json({ message: 'Seller added successfully' });
  } finally {
    await connection.end();
  }
};

export const updateSeller = async (req, res) => {
  const { Sifra_prodavaca } = req.params;
  const { Ime_prodavaca, Adresa_prodavaca, E_mail_prodavaca } = req.body;
  const connection = await getConnection();
  try {
    await connection.execute(
      'UPDATE PRODAVAC SET Ime_prodavaca = ?, Adresa_prodavaca = ?, E_mail_prodavaca = ? WHERE Sifra_prodavaca = ?',
      [Ime_prodavaca, Adresa_prodavaca, E_mail_prodavaca, Sifra_prodavaca]
    );
    res.json({ message: 'Seller updated successfully' });
  } finally {
    await connection.end();
  }
};

export const deleteSeller = async (req, res) => {
  const { Sifra_prodavaca } = req.params;
  const connection = await getConnection();
  try {
    await connection.execute('DELETE FROM PRODAVAC WHERE Sifra_prodavaca = ?', [Sifra_prodavaca]);
    res.json({ message: 'Seller deleted successfully' });
  } finally {
    await connection.end();
  }
};