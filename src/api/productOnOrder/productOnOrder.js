// src/api/productOnOrder/productOnOrder.js

import { getConnection } from '../../lib/db.js';

// Get all products in orders
export const getProductsOnOrder = async (req, res) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM PROIZVOD_NA_NARUDZBI');
    res.json(rows);
  } finally {
    await connection.end();
  }
};

// Add a product to an order
export const addProductOnOrder = async (req, res) => {
  const { Sifra_narudzbe, Sifra_proizvoda, Kolicina_narucenog_proizvoda } = req.body;

  console.log('Add Product on Order - Received Data:', req.body);
  console.log('Sifra_narudzbe:', Sifra_narudzbe);
  console.log('Sifra_proizvoda:', Sifra_proizvoda);
  console.log('Kolicina_narucenog_proizvoda:', Kolicina_narucenog_proizvoda);

  const connection = await getConnection();
  try {
    await connection.execute(
      'INSERT INTO PROIZVOD_NA_NARUDZBI (Sifra_narudzbe, Sifra_proizvoda, Kolicina_narucenog_proizvoda) VALUES (?, ?, ?)',
      [Sifra_narudzbe, Sifra_proizvoda, Kolicina_narucenog_proizvoda]
    );
    res.status(201).json({ message: 'Proizvod na narudžbi uspješno dodan' });
  } catch (error) {
    console.error('Error adding product on order:', error);
    res.status(500).json({ message: 'Došlo je do greške prilikom dodavanja proizvoda na narudžbu.' });
  } finally {
    await connection.end();
  }
};

// Update a product in an order
export const updateProductOnOrder = async (req, res) => {
  const { Sifra_narudzbe, Sifra_proizvoda } = req.params;
  const { Kolicina_narucenog_proizvoda } = req.body;

  console.log('Update Product on Order - Params:', req.params);
  console.log('Kolicina_narucenog_proizvoda:', Kolicina_narucenog_proizvoda);

  const connection = await getConnection();
  try {
    await connection.execute(
      'UPDATE PROIZVOD_NA_NARUDZBI SET Kolicina_narucenog_proizvoda = ? WHERE Sifra_narudzbe = ? AND Sifra_proizvoda = ?',
      [Kolicina_narucenog_proizvoda, Sifra_narudzbe, Sifra_proizvoda]
    );
    res.json({ message: 'Proizvod na narudžbi uspješno ažuriran' });
  } catch (error) {
    console.error('Error updating product on order:', error);
    res.status(500).json({ message: 'Došlo je do greške prilikom ažuriranja proizvoda na narudžbu.' });
  } finally {
    await connection.end();
  }
};

// Delete a product from an order
export const deleteProductOnOrder = async (req, res) => {
  const { OrderId, ProductId } = req.params;

  console.log('Delete Product on Order - Params:', req.params);

  // Additional Debugging Logs
  console.log(`OrderId: ${OrderId}, ProductId: ${ProductId}`);

  if (!OrderId || !ProductId) {
    return res.status(400).json({ message: 'OrderId and ProductId are required.' });
  }

  const connection = await getConnection();
  try {
    const [result] = await connection.execute(
      'DELETE FROM PROIZVOD_NA_NARUDZBI WHERE Sifra_narudzbe = ? AND Sifra_proizvoda = ?',
      [OrderId, ProductId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No matching record found.' });
    }

    res.json({ message: 'Proizvod na narudžbi uspješno izbrisan' });
  } catch (error) {
    console.error('Error deleting product on order:', error);
    res.status(500).json({ message: 'Došlo je do greške prilikom brisanja proizvoda na narudžbi.' });
  } finally {
    await connection.end();
  }
};