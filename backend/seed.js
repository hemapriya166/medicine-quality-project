const mongoose = require('mongoose');
require('dotenv').config();

const Medicine = require('./models/Medicine');
const TestResult = require('./models/TestResult');
const Alert = require('./models/Alert');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Medicine.deleteMany({});
    await TestResult.deleteMany({});
    await Alert.deleteMany({});
    console.log('Existing data cleared...');

    // ===== MEDICINES =====
    await Medicine.insertMany([
      {
        name: 'Paracetamol',
        batchNumber: 'B001',
        manufacturer: 'ABC Pharma',
        expiryDate: new Date('2027-12-31')
      },
      {
        name: 'Amoxicillin',
        batchNumber: 'B002',
        manufacturer: 'XYZ Labs',
        expiryDate: new Date('2026-08-15')
      },
      {
        name: 'Ibuprofen',
        batchNumber: 'B003',
        manufacturer: 'MediCorp',
        expiryDate: new Date('2027-06-30')
      }
    ]);
    console.log('3 medicines inserted...');

    // ===== TEST RESULTS =====
    await TestResult.insertMany([
      {
        medicineName: 'Paracetamol',
        batchNumber: 'B001',
        purity: 98,
        pH: 6.8,
        status: 'Pass',
        testDate: new Date('2026-06-01')
      },
      {
        medicineName: 'Ibuprofen',
        batchNumber: 'B003',
        purity: 97,
        pH: 7.0,
        status: 'Pass',
        testDate: new Date('2026-06-05')
      },
      {
        medicineName: 'Amoxicillin',
        batchNumber: 'B002',
        purity: 91,
        pH: 5.1,
        status: 'Fail',
        testDate: new Date('2026-06-08')
      },
      {
        medicineName: 'Ibuprofen',
        batchNumber: 'B003',
        purity: 93,
        pH: 4.9,
        status: 'Fail',
        testDate: new Date('2026-06-10')
      }
    ]);
    console.log('4 test results inserted...');

    // ===== ALERTS =====
    await Alert.insertMany([
      {
        medicineName: 'Amoxicillin',
        batchNumber: 'B002',
        message: 'Low purity detected: 91% (below 95% threshold)',
        severity: 'Critical',
        resolved: false
      },
      {
        medicineName: 'Ibuprofen',
        batchNumber: 'B003',
        message: 'pH out of range: 4.9 (acceptable range is 5.5 to 7.5)',
        severity: 'Warning',
        resolved: false
      }
    ]);
    console.log('2 alerts inserted...');

    // ===== ADMIN USER =====
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'Admin'
      });
      console.log('Admin user created — username: admin, password: admin123');
    } else {
      console.log('Admin user already exists, skipping...');
    }

    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('3 medicines added');
    console.log('4 test results added (2 pass, 2 fail)');
    console.log('2 alerts added');
    console.log('Admin login → username: admin | password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    mongoose.connection.close();

  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
  }
}

seedDatabase();