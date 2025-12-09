const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// ข้อมูลตัวอย่าง
let pets = [
  {
    id: 1,
    name: 'มะลิ',
    species: 'สุนัข',
    breed: 'ชิวาว่า',
    age: 3,
    color: 'น้ำตาล',
    ownerId: 'O001',
    ownerName: 'สมชาย ใจดี',
    registrationDate: '2022-03-15'
  },
  {
    id: 2,
    name: 'เหมียว',
    species: 'แมว',
    breed: 'เปอร์เซีย',
    age: 2,
    color: 'ขาว',
    ownerId: 'O002',
    ownerName: 'สมหญิง รักสัตว์',
    registrationDate: '2023-01-20'
  }
];

let nextId = 3;

// 1. ดึงข้อมูลสัตว์ทั้งหมด
app.get('/api/pets', (req, res) => {
  const { species, ownerId } = req.query;
  
  let filteredPets = pets;
  
  if (species) {
    filteredPets = filteredPets.filter(p => 
      p.species.toLowerCase() === species.toLowerCase()
    );
  }
  
  if (ownerId) {
    filteredPets = filteredPets.filter(p => p.ownerId === ownerId);
  }
  
  res.json({
    success: true,
    count: filteredPets.length,
    data: filteredPets
  });
});

// 2. ดึงข้อมูลสัตว์ตาม ID
app.get('/api/pets/:id', (req, res) => {
  const pet = pets.find(p => p.id === parseInt(req.params.id));
  
  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'ไม่พบข้อมูลสัตว์'
    });
  }
  
  res.json({
    success: true,
    data: pet
  });
});

// 3. ลงทะเบียนสัตว์ใหม่
app.post('/api/pets', (req, res) => {
  const { name, species, breed, age, color, ownerId, ownerName } = req.body;
  
  if (!name || !species || !ownerId || !ownerName) {
    return res.status(400).json({
      success: false,
      message: 'กรุณาระบุข้อมูลที่จำเป็น: name, species, ownerId, ownerName'
    });
  }
  
  const newPet = {
    id: nextId++,
    name,
    species,
    breed: breed || '',
    age: age || 0,
    color: color || '',
    ownerId,
    ownerName,
    registrationDate: new Date().toISOString().split('T')[0]
  };
  
  pets.push(newPet);
  
  res.status(201).json({
    success: true,
    message: 'ลงทะเบียนสัตว์สำเร็จ',
    data: newPet
  });
});

// 4. อัพเดทข้อมูลสัตว์
app.put('/api/pets/:id', (req, res) => {
  const petIndex = pets.findIndex(p => p.id === parseInt(req.params.id));
  
  if (petIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'ไม่พบข้อมูลสัตว์'
    });
  }
  
  const updatedPet = {
    ...pets[petIndex],
    ...req.body,
    id: pets[petIndex].id,
    registrationDate: pets[petIndex].registrationDate
  };
  
  pets[petIndex] = updatedPet;
  
  res.json({
    success: true,
    message: 'อัพเดทข้อมูลสำเร็จ',
    data: updatedPet
  });
});

// 5. ลบข้อมูลสัตว์
app.delete('/api/pets/:id', (req, res) => {
  const petIndex = pets.findIndex(p => p.id === parseInt(req.params.id));
  
  if (petIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'ไม่พบข้อมูลสัตว์'
    });
  }
  
  const deletedPet = pets.splice(petIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'ลบข้อมูลสำเร็จ',
    data: deletedPet
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🐾 Pet Registry API is running on http://localhost:${PORT}`);
  console.log(`📝 API Endpoints:`);
  console.log(`   GET    /api/health`);
  console.log(`   GET    /api/pets`);
  console.log(`   GET    /api/pets/:id`);
  console.log(`   POST   /api/pets`);
  console.log(`   PUT    /api/pets/:id`);
  console.log(`   DELETE /api/pets/:id`);
});
