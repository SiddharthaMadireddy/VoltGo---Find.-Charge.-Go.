import express from 'express';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Helper to fetch full user state
function getUserState(userId) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const walletTxns = db.prepare('SELECT * FROM wallet_txns WHERE userId = ? ORDER BY date DESC').all(userId);
  const chargingSessions = db.prepare('SELECT * FROM charging_sessions WHERE userId = ? ORDER BY date DESC').all(userId);
  const vehicles = db.prepare('SELECT * FROM vehicles WHERE userId = ?').all(userId).map(v => ({
    ...v,
    connectors: JSON.parse(v.connectors)
  }));
  const bookings = db.prepare('SELECT * FROM bookings WHERE userId = ? ORDER BY date DESC').all(userId);
  const notifications = db.prepare('SELECT * FROM notifications WHERE userId = ? ORDER BY date DESC').all(userId).map(n => ({
    ...n,
    read: Boolean(n.read)
  }));

  return {
    user,
    walletTxns,
    sessions: chargingSessions,
    vehicles,
    bookings,
    notifications
  };
}

// Seed dummy data if registering for the first time
function seedDummyData(userId) {
  const txns = [
    { id: 't1', userId, type: 'credit', amount: 1000, title: 'Wallet Recharge', subtitle: 'UPI · @user', date: 'Aug 06, 2026 · 9:14 AM', method: 'UPI' },
    { id: 't2', userId, type: 'debit', amount: 540, title: 'Charging Session', subtitle: 'VoltGo Hitech City', date: 'Aug 05, 2026 · 7:48 PM', method: 'Wallet' },
  ];
  
  const insertTxn = db.prepare('INSERT INTO wallet_txns (id, userId, type, amount, title, subtitle, date, method) VALUES (@id, @userId, @type, @amount, @title, @subtitle, @date, @method)');
  txns.forEach(t => insertTxn.run(t));

  const sessions = [
    { id: 's1', userId, stationId: 'st-hitech', stationName: 'VoltGo Hitech City', date: 'August 5, 2026', energyKwh: 30, durationMin: 38, connector: 'CCS2', amount: 540 },
  ];
  const insertSession = db.prepare('INSERT INTO charging_sessions (id, userId, stationId, stationName, date, energyKwh, durationMin, connector, amount) VALUES (@id, @userId, @stationId, @stationName, @date, @energyKwh, @durationMin, @connector, @amount)');
  sessions.forEach(s => insertSession.run(s));

  const vehicles = [
    { id: 'v1', userId, name: 'Tesla Model 3', model: 'Long Range 2024', batteryKwh: 60, connectors: JSON.stringify(['Type 2', 'CCS2']), maxChargingKw: 170, regNumber: 'TS 09 EV 4471' }
  ];
  const insertVehicle = db.prepare('INSERT INTO vehicles (id, userId, name, model, batteryKwh, connectors, maxChargingKw, regNumber) VALUES (@id, @userId, @name, @model, @batteryKwh, @connectors, @maxChargingKw, @regNumber)');
  vehicles.forEach(v => insertVehicle.run(v));

  const notifs = [
    { id: 'n1', userId, type: 'wallet', title: 'Welcome to VoltGo', body: 'Your account has been created successfully.', date: 'Just now', read: 0 },
  ];
  const insertNotif = db.prepare('INSERT INTO notifications (id, userId, type, title, body, date, read) VALUES (@id, @userId, @type, @title, @body, @date, @read)');
  notifs.forEach(n => insertNotif.run(n));
}

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, avatarColor } = req.body;
  try {
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const result = db.prepare('INSERT INTO users (name, email, phone, avatarColor, walletBalance) VALUES (?, ?, ?, ?, ?)')
      .run(name, email, phone, avatarColor, 0);
    
    const newUserId = result.lastInsertRowid;
    
    // Seed only a welcome notification instead of dummy wallet/session data
    db.prepare('INSERT INTO notifications (id, userId, type, title, body, date, read) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(`n${Date.now()}`, newUserId, 'wallet', 'Welcome to VoltGo', 'Your account has been created successfully.', 'Just now', 0);

    res.json(getUserState(newUserId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(getUserState(user.id));
});

const googleClient = new OAuth2Client('343639237864-13b40p009vie5mt6me1ouag4jutp73rk.apps.googleusercontent.com');

app.post('/api/auth/google', async (req, res) => {
  const { access_token } = req.body;
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const payload = await response.json();
    if (!payload.email) return res.status(400).json({ error: 'Invalid Google token' });

    const { email, name } = payload;
    
    let user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    
    if (!user) {
      const result = db.prepare('INSERT INTO users (name, email, phone, avatarColor, walletBalance) VALUES (?, ?, ?, ?, ?)')
        .run(name, email, '', 'from-volt-400 to-spark-500', 0);
      
      const newUserId = result.lastInsertRowid;
      
      db.prepare('INSERT INTO notifications (id, userId, type, title, body, date, read) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(`n${Date.now()}`, newUserId, 'wallet', 'Welcome to VoltGo', 'Your account has been created successfully via Google.', 'Just now', 0);
        
      user = { id: newUserId };
    }
    
    res.json(getUserState(user.id));
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ error: 'Server error during Google auth' });
  }
});

app.post('/api/wallet/add', (req, res) => {
  const { userId, amount, method, title, subtitle, date } = req.body;
  const id = `t${Date.now()}`;
  
  db.transaction(() => {
    db.prepare('UPDATE users SET walletBalance = walletBalance + ? WHERE id = ?').run(amount, userId);
    db.prepare('INSERT INTO wallet_txns (id, userId, type, amount, title, subtitle, date, method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, userId, 'credit', amount, title, subtitle, date, method);
  })();

  res.json({ success: true, txn: { id, userId, type: 'credit', amount, title, subtitle, date, method } });
});

app.post('/api/vehicles/add', (req, res) => {
  const { id, userId, name, model, batteryKwh, connectors, maxChargingKw, regNumber } = req.body;
  db.prepare('INSERT INTO vehicles (id, userId, name, model, batteryKwh, connectors, maxChargingKw, regNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, userId, name, model, batteryKwh, JSON.stringify(connectors), maxChargingKw, regNumber);
  res.json({ success: true });
});

app.put('/api/vehicles/update', (req, res) => {
  const { id, name, model, batteryKwh, connectors, maxChargingKw, regNumber } = req.body;
  db.prepare('UPDATE vehicles SET name=?, model=?, batteryKwh=?, connectors=?, maxChargingKw=?, regNumber=? WHERE id=?')
    .run(name, model, batteryKwh, JSON.stringify(connectors), maxChargingKw, regNumber, id);
  res.json({ success: true });
});

app.delete('/api/vehicles/:id', (req, res) => {
  db.prepare('DELETE FROM vehicles WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

app.post('/api/bookings/add', (req, res) => {
  const { id, userId, stationId, stationName, chargerLabel, date, time, durationMin, reservationFee, estimatedCost, total, status } = req.body;
  
  db.transaction(() => {
    db.prepare('INSERT INTO bookings (id, userId, stationId, stationName, chargerLabel, date, time, durationMin, reservationFee, estimatedCost, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, userId, stationId, stationName, chargerLabel, date, time, durationMin, reservationFee, estimatedCost, total, status);
    
    if (total > 0) {
      db.prepare('UPDATE users SET walletBalance = walletBalance - ? WHERE id = ?').run(total, userId);
      db.prepare('INSERT INTO wallet_txns (id, userId, type, amount, title, subtitle, date, method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(`t${Date.now()}`, userId, 'debit', total, 'Booking Payment', stationName, new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }), 'Wallet');
    }

    db.prepare('INSERT INTO notifications (id, userId, type, title, body, date, read) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(`n${Date.now()}`, userId, 'booking', 'Reservation Confirmed', `Your charger at ${stationName} is reserved for ${date}, ${time}.`, 'Just now', 0);
  })();
  
  res.json(getUserState(userId));
});

app.post('/api/bookings/cancel', (req, res) => {
  const { bookingId, userId } = req.body;
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ? AND userId = ?').get(bookingId, userId);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  
  db.transaction(() => {
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run('cancelled', bookingId);
    db.prepare('UPDATE users SET walletBalance = walletBalance + ? WHERE id = ?').run(booking.total, userId);
    db.prepare('INSERT INTO wallet_txns (id, userId, type, amount, title, subtitle, date, method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(`t${Date.now()}`, userId, 'credit', booking.total, 'Booking Refund', booking.stationName, new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }), 'Wallet');
    db.prepare('INSERT INTO notifications (id, userId, type, title, body, date, read) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(`n${Date.now()}`, userId, 'wallet', 'Refund Processed', `₹${booking.total} refunded for cancelled booking at ${booking.stationName}.`, 'Just now', 0);
  })();

  res.json(getUserState(userId));
});

app.put('/api/notifications/read', (req, res) => {
  const { userId } = req.body;
  db.prepare('UPDATE notifications SET read = 1 WHERE userId = ?').run(userId);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
