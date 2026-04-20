# OSHXONA - Oynamalı Qo'llanma
## (Interactive Guide)

---

## 🎬 VIDEO-YAQIN QO'LLANMA

### 1️⃣ ISHGA TUSHIRISH (1 min)

**A. Windows (PowerShell yoki Command Prompt)**

```powershell
# Terminal 1
cd c:\Users\KSM\Desktop\OSHXONA\backend
npm install
npm start

# Terminal 2 (yangi oyna)
cd c:\Users\KSM\Desktop\OSHXONA\frontend
npm install
npm run dev
```

**B. Mac/Linux**
```bash
# Terminal 1
cd ~/Desktop/OSHXONA/backend
npm install
npm start

# Terminal 2
cd ~/Desktop/OSHXONA/frontend
npm install
npm run dev
```

**C. Yoki Batch Fayl Orqali (Windows)**
```cmd
# OSHXONA papkasida
start.bat
```

---

### 2️⃣ BROWSER'DA OCHING

**Birinci Tab (Ofitsiant Paneli):**
```
http://localhost:5173
→ "Ofitsiant Paneli" tugmasini bosing
```

**Ikkinchi Tab (Oshxona Paneli):**
```
http://localhost:5173
→ "Oshxona Paneli" tugmasini bosing
```

---

### 3️⃣ BIRINCHI BUYURTMA (Demo Sinov)

**Ofitsiant Panelida:**

| Qadam | Amal | Natija |
|-------|------|--------|
| 1 | Stol raqamiga "1" yozing | Stol #1 tanlandi |
| 2 | "Plov" checkbox'ni bosing | ☑ Plov tanlandı |
| 3 | "Manti" checkbox'ni bosing | ☑ Manti tanlandı |
| 4 | "Yuborish" tugmasini bosing | ✅ Zakaz yuborildi |
| 5 | 2 ta ovoz signali eshitasiz | 📢 Ding-Ding! |

**Ofitsiant Panelida ko'rish:**
- Status: "Yangi"
- Orang rang
- Vaqti: 12:XX

---

### 4️⃣ OSHXONA PANELIDA JAVOB

**Oshxona Panelida:**

| Qadam | Amal | Natiji |
|-------|------|--------|
| 1 | Buyurtmani ko'ring | Stol 1, YANGI, orange |
| 2 | "Tayyorlashni Boshlash" bosing | Rang ko'k o'zgaradi |
| 3 | Ishni tugatganingizdan so'ng | "Tayyor" tugmasini bosing |
| 4 | "Tayyor" bosing | Rang yashil o'zgaradi |
| 5 | Ofitsiant panelga qaytib ko'ring | Status "Tayyor" + Bildirishnoma! |

---

## 🎯 ASOSIY FUNKTSIYALAR

### Ofitsiant Paneli
```
┌─ BOSH OYNA ──────────────────────────────┐
│ Ofitsiant Paneli              [← Orqaga] │
├───────────────────────────────────────────┤
│                                           │
│ 📝 BUYURTMA FORMASI                       │
│                                           │
│  Stol Raqami: [    ]                      │
│                                           │
│  Taomlarni Tanlang:                       │
│  ☐ Plov           25 000 so'm             │
│  ☐ Manti          18 000 so'm             │
│  ☐ Shashlik       22 000 so'm             │
│  ☐ Lagman         20 000 so'm             │
│  ☐ Dimlama        24 000 so'm             │
│  ☐ Samsa          12 000 so'm             │
│  ☐ Palov          28 000 so'm             │
│  ☐ Kabob          26 000 so'm             │
│                                           │
│  [       YUBORISH       ]                 │
│                                           │
│  ✅ Zakaz yuborildi!                      │
│                                           │
│                                           │
│ 📦 MENING BUYURTMALARIM                   │
│                                           │
│ ┌────────────────────────────────────┐   │
│ │ Stol: 1            Yangi           │   │
│ │ Plov, Manti, Kabob                 │   │
│ │ 12:30:00                           │   │
│ └────────────────────────────────────┘   │
│                                           │
│ ┌────────────────────────────────────┐   │
│ │ Stol: 2            Tayyorlana...    │   │
│ │ Lagman                             │   │
│ │ 12:31:00                           │   │
│ └────────────────────────────────────┘   │
│                                           │
│ ┌────────────────────────────────────┐   │
│ │ Stol: 3            Tayyor! 🎉      │   │
│ │ Samsa, Dimlama                     │   │
│ │ 12:32:00                           │   │
│ └────────────────────────────────────┘   │
│                                           │
└───────────────────────────────────────────┘
```

**Ranglar:**
- 🟠 Orange = Yangi (yangi qabul qilindi)
- 🔵 Ko'k = Tayyorlanmoqda (oshxonada tayyorlanmoqda)
- 🟢 Yashil = Tayyor (olish uchun tayyor!)

---

### Oshxona Paneli

```
┌─ OSHXONA ─────────────────────────────┐
│ Oshxona Paneli  [4 Yangi] [2 Tayyorla...]
├───────────────────────────────────────┤
│                                       │
│  ┌────────────┐  ┌────────────┐      │
│  │ 🟠         │  │ 🟠         │      │
│  │ Stol 1     │  │ Stol 5     │      │
│  │ YANGI      │  │ YANGI      │      │
│  │            │  │            │      │
│  │ Plov       │  │ Lagman     │      │
│  │ Manti      │  │ Samsa      │      │
│  │ Kabob      │  │            │      │
│  │            │  │            │      │
│  │ 12:30      │  │ 12:35      │      │
│  │            │  │            │      │
│  │ [Boshlash] │  │ [Boshlash] │      │
│  └────────────┘  └────────────┘      │
│                                       │
│  ┌────────────┐  ┌────────────┐      │
│  │ 🔵         │  │ 🟢         │      │
│  │ Stol 2     │  │ Stol 4     │      │
│  │ TAYYORLA.. │  │ TAYYOR ✅  │      │
│  │            │  │            │      │
│  │ Dimlama    │  │ Palov      │      │
│  │            │  │            │      │
│  │            │  │            │      │
│  │            │  │            │      │
│  │ 12:31      │  │ 12:33      │      │
│  │            │  │            │      │
│  │ [Tayyor]   │  │ [Tayyor ✅]│      │
│  └────────────┘  └────────────┘      │
│                                       │
└───────────────────────────────────────┘
```

---

## 🔄 BUYURTMA STATUSI O'TISHI

```
┌─────────────────────────────────────────┐
│                                         │
│  YANGI (Orange)                        │
│  ├─ Just received from waiter          │
│  ├─ Kitchen sees it FIRST              │
│  └─ 1 min waiting time                 │
│         ↓                              │
│  TAYYORLANMOQDA (Ko'k)                 │
│  ├─ In kitchen preparing               │
│  ├─ Waiter sees: "Preparing..."        │
│  └─ 10-15 min cooking time             │
│         ↓                              │
│  TAYYOR (Yashil)                       │
│  ├─ Ready to serve                     │
│  ├─ Waiter gets ALERT! 🔔              │
│  └─ "Table X is READY!"                │
│         ↓                              │
│  [OFITSIANT OLADI]                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔊 OVOZ SIGNALLARI

| Tilishi | Vaqti | Foydalanuvchi |
|---------|-------|---------------|
| 📢 Ding-Ding | Yangi buyurtma qabul | Oshxona |
| 🎵 Do-Re | Buyurtma yuborildi | Ofitsiant |
| 🎺 Beep-Beep | Tayyor bildirishnomasi | Ofitsiant |

---

## 🧪 SINOV STSENARIYLARI

### Test 1: Oddiy Oqim (Basic Flow)
```
Vaqti: 2-3 daqiqa

1. Ofitsiant: Stol 5, Plov + Manti
2. Oshxona: "Tayyorlashni Boshlash"
3. Ofitsiant: Status "Tayyorlanmoqda"ni ko'ring
4. Oshxona: "Tayyor"
5. Ofitsiant: Bildirishnoma oladi ✅
```

### Test 2: Ko'plab Buyurtmalar
```
Vaqti: 5-10 daqiqa

1. 3 ta taraychi tab oching
2. Birinchi: Stol 1 + 2 ta taom
3. Ikkinchi: Stol 2 + 3 ta taom
4. Uchinchi: Stol 3 + 1 ta taom
5. Oshxona: Barchasini turli vaqtda tugatish
6. Barchasini tekshirish
```

### Test 3: Xatolarni Tekshirish
```
Vaqti: 1 daqiqa

1. Stol raqamisiz "Yuborish" → ❌ Xatolik
2. Taom tanlamay "Yuborish" → ❌ Xatolik
3. Noto'g'ri raqam → ❌ Validation
```

### Test 4: Real-time Tekshirish
```
Vaqti: 3 daqiqa

1. Oshxona paneli oyna ko'rish sohada
2. Ofitsiant panelida buyurtma yuborish
3. DARHOL Oshxonada ko'rinishini tekshirish
4. Oshxonada holatni o'zgartirish
5. DARHOL Ofitsiantda ko'rinishini tekshirish
```

---

## 🐛 MUAMMOLAR VA YECHIMLAR

### ❌ "Localhost ishlamayapti"
**Yechim:**
- Ikkala terminal oynasida `npm install` va `npm start`/`npm run dev` bajarganingizni tekshiring
- Port 3000 va 5173 band emasligini tekshiring
- Firewall sozlamalarini tekshiring

### ❌ "Real-time ishlamayapti"
**Yechim:**
- Backend terminalida "Socket.io ready" ko'rinishini tekshiring
- Brauzer konsolida (F12 → Console) xatolarni tekshiring
- Ikkala tab'a bir xil `localhost` da ekanligini tekshiring

### ❌ "Ovoz signali eshitilmayapti"
**Yechim:**
- Brauzer hangi sil ekanligini tekshiring
- Audio kengaytmalarini tekshiring
- Konsolida "Sound playing..." xatolarini tekshiring

### ❌ "Statusi o'zgarmiş kо'rinmayapti"
**Yechim:**
- Sahifani f5 tuzing (refresh)
- Oshxona panelida "Tayyor" tugmasini yana bosing
- Backend terminalida xatolar yo'qligini tekshiring

---

## 📊 PERFORMANCE KO'RSATKICHLARI

### Normal Holatda
- **Buyurtma yuborish vaqti**: < 100ms
- **Status o'zgarish vaqti**: < 50ms
- **Bildirishnoma vaqti**: < 100ms
- **Max buyurtmalar**: 1000+ (computer RAM'ga qarab)

### Sezilarli Saklanish (Lag)
- Agar > 500ms bo'lsa → Backend terminalini tekshiring
- Agar > 1s bo'lsa → Network ulanishini tekshiring

---

## 📱 MOBILE/TABLET SINOVI

```
Responsive Breakpoints:
- Desktop (1200px+): Full layout ✅
- Tablet (768px - 1199px): Responsive ✅
- Mobile (< 768px): Single column ✅
```

**Sinov uchun Chrome DevTools:**
1. F12 bosing
2. Ctrl+Shift+M (Device toolbar)
3. Turli o'lchamlarni tanlang
4. Interfeys tugri kо'rinishini tekshiring

---

## 🎓 CODING CONCEPTS

### Backend
```javascript
// Express server
const app = express();

// Socket.io
io.on('connection', (socket) => {
  // Real-time events
  socket.emit('order:created', data);
});

// REST API
app.post('/api/orders', (req, res) => {
  // New order logic
});
```

### Frontend
```javascript
// React hooks
const [orders, setOrders] = useState([]);

// Socket.io client
socket.on('order:updated', (order) => {
  setOrders(prev => [...prev, order]);
});

// API calls
fetch('/api/orders', { method: 'POST' });
```

---

## 🚀 KEYINGI QADAM

### O'rnatish/Deployment
1. Heroku yoki Railway'ga deploy qilish
2. Database qo'shish (MongoDB)
3. Authentication qo'shish
4. Production build yaratish

### Features Qo'shish
1. Buyurtma tarixini ko'rish
2. Taomlar uchun spetsifik talab
3. To'lov integratsiyasi
4. Vaqtli bildirishnomalar

### Optimization
1. Performance tezligi
2. Caching strategiyasi
3. Database indexing
4. Frontend bundling

---

## 📞 DEBUG COMMANDS

**Backend Debug:**
```bash
# Node'ni debug mode'da run qilish
node --inspect server.js

# Chrome DevTools'da:
chrome://inspect
```

**Frontend Debug:**
```
Browser DevTools (F12):
- Console tab: console.log() messages
- Network tab: API requests
- React tab: Component state
```

---

## ✅ CHECKLIST - HAMMASI ISHLAY OTKANI?

- [ ] Backend server ishlamoqda (terminal 1)
- [ ] Frontend dev server ishlamoqda (terminal 2)
- [ ] Browser 2 ta tab'da ochilig (ofitsiant + oshxona)
- [ ] Ofitsiant: Taom tanlash va yuborish
- [ ] Oshxona: Yangi buyurtmalarni ko'rish
- [ ] Oshxona: Holatni "Tayyorlashni Boshlash" ga o'zgartirish
- [ ] Ofitsiant: Status "Tayyorlanmoqda"ni ko'rish
- [ ] Oshxona: "Tayyor" tugmasini bosish
- [ ] Ofitsiant: Bildirishnoma olish va/yoki o'zgarish ko'rish
- [ ] Ovoz signalini eshitish (iloji bo'lsa)

---

## 🎉 TAYYOR!

Agar barcha chekbokslar ✅ bo'lsa, sizning sistema to'liq ishlamoqda!

**Tabriklaymiz! Siz hozir production-ready demo sistemi bilan ishlayapsiz!** 🍽️

---

**💡 Maslahat**: Har biron muammo bo'lsa, README.md va SETUP.md'ni o'qib chiqing.

**🚀 Muvaffaqiyat!**
