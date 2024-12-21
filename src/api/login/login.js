// src/api/login.js

import { getConnection } from '../../lib/db.js';
import bcrypt from 'bcrypt';

export const authenticateUser = async (ime, lozinka) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM Administratori WHERE ime = ?', [ime]);
    if (rows.length === 0) {
      throw new Error('User not found');
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(lozinka, user.lozinka);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    return user;
  } finally {
    await connection.end();
  }
};