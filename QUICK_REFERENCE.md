# 📋 OSHXONA - Tez Ma'lumot (Quick Reference)

## 🚀 ISHGA TUSHIRISH (1 minut)

```powershell
# Terminal 1 - BACKEND
cd c:\Users\KSM\Desktop\OSHXONA\backend
npm install
npm start

# Terminal 2 - FRONTEND (yangi oyna)
cd c:\Users\KSM\Desktop\OSHXONA\frontend
npm install
npm run dev
```

**URL'lar:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🎯 VAGETA

| Rol | Amal | Qadamlar |
|-----|------|---------|
| **Ofitsiant** | Buyurtma yuborish | 1. Stol raqami kiritish 2. Taomlarni tanlash 3. "Yuborish" bosish |
| **Oshxona** | Buyurtmani tayyorlash | 1. Yangi buyurtma ko'rish 2. "Boshlash" bosish 3. "Tayyor" bosish |
| **Bildirishnoma** | Ofitsiantga xabar | 1. Oshxona "Tayyor" bosadi 2. Ofitsiant: 🔔 Bildirishnoma oladi |

---

## 🎨 RANGLAR

| Rang | Maani | Holat |
|------|-------|--------|
| 🟠 Orange | YANGI | Stol raqami va taomlar ko'rinadi |
| 🔵 Ko'k | TAYYORLANMOQDA | Oshxonada tayyorlanmoqda |
| 🟢 Yashil | TAYYOR | Olish uchun tayyor |

---

## 📊 BUYURTMA HOLATLARI

```
YANGI → TAYYORLANMOQDA → TAYYOR
 ⬇️       ⬇️                ⬇️
Qabul    Tahni             Bildirishnoma
```

---

## 🔧 TEXNIKA

| Komponent | Texnologiya |
|-----------|-------------|
| Backend | Node.js + Express |
| Frontend | React + Vite |
| Real-time | Socket.io |
| Storage | In-memory (RAM) |
| Language | O'zbek (lotin) |

---

## 🐛 TEZKOR YECHIMLAR

| Muammo | Yechim |
|--------|--------|
| Ishlamayapti | `npm install` qayta bajarib ko'ring |
| Real-time yo'q | Ikkala terminal ham ishlamoqda mi? |
| Port band | 3000 va 5173 portlar band emasligini tekshiring |
| Ovoz yo'q | Brauzer volumni tekshiring |

---

## 📂 FAYL TUZILISHI

```
OSHXONA/
├── backend/
│   ├── server.js (Backend server)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx (Asosiy komponent)
│   │   ├── App.css (Dizayn)
│   │   └── i18n.js (O'zbek tarjimalar)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── README.md (Batafsil qo'llanma)
├── SETUP.md (O'rnatish)
├── INTERACTIVE_GUIDE.md (Oynamalı qo'llanma)
└── ARCHITECTURE.md (Texnik tafsilotlar)
```

---

## ⌨️ QISQA TUGMALAR

| OS | Command |
|----|---------|
| **Windows** | `start.bat` yoki `start.ps1` |
| **Mac/Linux** | `chmod +x start.sh && ./start.sh` |

---

## 🎬 BIRINCHI SINOV (30 sekund)

1. **Ofitsiant Tab**: Stol 1, Plov, Yuborish
2. **Oshxona Tab**: "Tayyorlashni Boshlash" bosing
3. **Ofitsiant Tab**: Status o'zgarganini ko'ring ✅

---

## 📞 API Endpoints

```
GET  /api/menu                    - Taomlar
GET  /api/orders                  - Buyurtmalar
POST /api/orders                  - Yangi
PUT  /api/orders/:id/status       - Holatni o'zgartirish
```

---

## 🔌 Socket.io Events

```
order:created        - Yangi buyurtma
order:updated        - Buyurtma o'zgarti
notification:ready   - Tayyor bildirishnomasi
notification:sound   - Ovoz signali
```

---

## ✨ XUSUSIYATLAR

✅ Real-time yangilanish (Socket.io)
✅ Ofitsiant va Oshxona ro'lari
✅ Buyurtma holati o'tishi
✅ Ovoz signallari
✅ O'zbek tilida interfeys
✅ Mobile-responsive
✅ Hisobli dizayn

---

## ⚠️ ESLATMALAR

- 🔐 DEMO - authentication yo'q
- 💾 In-memory - data uzilsa yo'q bolib ketadi
- 🌐 Local network uchun optimal
- 📱 2 browser tab = 2 foydalanuvchi

---

## 🎓 O'RGATILGAN NARSALAR

✅ Full-stack development
✅ Real-time communication
✅ REST API design
✅ React hooks
✅ Socket.io integration
✅ Responsive CSS
✅ State management

---

## 🚀 PRODUCTION UCHUN TAYYORLASH

- [ ] Database qo'shish (MongoDB/PostgreSQL)
- [ ] Authentication qo'shish (JWT)
- [ ] HTTPS/SSL sozlash
- [ ] Deployment (Heroku/Railway/AWS)
- [ ] Monitoring setup
- [ ] Backup strategy

---

**📌 SHUNCHAKI BOSHLANG: npm install && npm start**

**🍽️ Omad!**
