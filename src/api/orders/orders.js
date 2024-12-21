import { getConnection } from '../../lib/db.js';

export const getOrders = async (req, res) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM NARUDZBA');
    res.json(rows);
  } finally {
    await connection.end();
  }
};

export const addOrder = async (req, res) => {
  const { SIFRA_KUPCA, SIFRA_PRODAVACA, Datum_narudzbe, Nacin_placanja, Cijena_narudzbe } = req.body;
  const connection = await getConnection();
  try {
    // Log the values to debug
    console.log('Order values:', SIFRA_KUPCA, SIFRA_PRODAVACA, Datum_narudzbe, Nacin_placanja, Cijena_narudzbe);

    await connection.execute(
      'INSERT INTO NARUDZBA (SIFRA_KUPCA, SIFRA_PRODAVACA, Datum_narudzbe, Nacin_placanja, Cijena_narudzbe) VALUES (?, ?, ?, ?, ?)',
      [SIFRA_KUPCA, SIFRA_PRODAVACA, Datum_narudzbe, Nacin_placanja, Cijena_narudzbe]
    );

    res.status(201).json({ message: 'Order added successfully' });
  } finally {
    await connection.end();
  }
};

export const updateOrder = async (req, res) => {
  const { Sifra_narudzbe } = req.params;
  const { SIFRA_KUPCA, SIFRA_PRODAVACA, Datum_narudzbe, Nacin_placanja, Cijena_narudzbe } = req.body;
  const connection = await getConnection();
  try {
    await connection.execute(
      'UPDATE NARUDZBA SET SIFRA_KUPCA = ?, SIFRA_PRODAVACA = ?, Datum_narudzbe = ?, Nacin_placanja = ?, Cijena_narudzbe = ? WHERE Sifra_narudzbe = ?',
      [SIFRA_KUPCA, SIFRA_PRODAVACA, Datum_narudzbe, Nacin_placanja, Cijena_narudzbe, Sifra_narudzbe]
    );
    res.json({ message: 'Order updated successfully' });
  } finally {
    await connection.end();
  }
};

export const deleteOrder = async (req, res) => {
  const { Sifra_narudzbe } = req.params;
  const connection = await getConnection();
  try {
    await connection.execute('DELETE FROM NARUDZBA WHERE Sifra_narudzbe = ?', [Sifra_narudzbe]);
    res.json({ message: 'Order deleted successfully' });
  } finally {
    await connection.end();
  }
};