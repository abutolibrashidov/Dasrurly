# 🔧 OSHXONA - Muammolarni Yechish (Troubleshooting Guide)

## 🚨 TEZKOR MUAMMOLAR VA YECHIMLAR

---

## ❌ MUAMMO 1: "npm: command not found"

### Sababi
Node.js o'rnatilmagan yoki PATH'da yo'q.

### Yechimi
1. [nodejs.org](https://nodejs.org) dan Node.js 16+ yuklab oling
2. O'rnatishni o'tkazing
3. Terminalni qayta oching
4. `node --version` va `npm --version` kiriting

---

## ❌ MUAMMO 2: Backend "npm install" qilib ishlamayapti

### Xatolar
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

### Yechimi
```bash
# Qayta o'rnatish
rm package-lock.json
npm cache clean --force
npm install

# Yoki force option bilan
npm install --legacy-peer-deps

# Yoki npm versiyasini yangilang
npm install -g npm@latest
```

---

## ❌ MUAMMO 3: "Port 3000 allaqachon band"

### Belgilari
```
listen EADDRINUSE: address already in use :::3000
```

### Yechimi

**A. Port'ni tekshiring (Windows):**
```powershell
# Qaysi dastur portni band ekanligini ko'ring
netstat -ano | findstr :3000

# Port raqamini ko'rining (PID), masalan 12345
# Terminalda to'xtating:
taskkill /PID 12345 /F
```

**B. Port raqamini o'zgartiring:**
```javascript
// backend/server.js'da:
const PORT = 3001; // 3000 o'rniga
```

**C. Boshqa dasturni yopib ko'ring:**
- Skype (3000 dan kеyin foydalanadi)
- Ollaqachon ishlaydigan Node process
- Boshqa Express serveri

---

## ❌ MUAMMO 4: "Port 5173 band"

### Belgilari
```
error when starting dev server:
Error: listen EADDRINUSE: address already in use :::5173
```

### Yechimi

**A. Port'ni tekshiring (Windows):**
```powershell
netstat -ano | findstr :5173
taskkill /PID [PID] /F
```

**B. Vite'ga port o'zgarting:**
```javascript
// frontend/vite.config.js'da:
export default defineConfig({
  server: {
    port: 5174, // 5173 o'rniga
  }
});
```

---

## ❌ MUAMMO 5: Frontend yuklanmayapti ("Blank Page")

### Sabablari
- Backend ishlamayapti
- Frontend dev server ishlamayapti
- Browser keshi

### Yechimi

1. **Backend terminalini tekshiring:**
   ```
   ✅ "Server running on http://localhost:3000"
   ✅ "WebSocket ready on ws://localhost:3000"
   ```

2. **Frontend terminalini tekshiring:**
   ```
   ✅ "VITE v4.x.x ready in X ms"
   ✅ "Local: http://localhost:5173"
   ```

3. **Browser konsolini tekshiring (F12):**
   - Network tab'da xatolar yo'qligini tekshiring
   - Console tab'da red xatolar yo'qligini tekshiring

4. **Keshine qayta boshlash:**
   ```
   Chrome: Ctrl+Shift+Delete → Clear browsing data
   Firefox: Ctrl+Shift+Delete → Clear Recent History
   ```

5. **Harder refresh:**
   ```
   Ctrl+F5 (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

---

## ❌ MUAMMO 6: Real-time Yangilanma Ishlamayapti

### Belgilari
- Ofitsiant buyurtma yuboradi, Oshxonada ko'rinmaydi
- Oshxona holatni o'zgartirad, Ofitsiantda ko'rinmaydi

### Sabablari
- Socket.io ulanishi yo'q
- CORS xatosi
- Frontend/Backend mos kelmaydi

### Yechimi

1. **Backend terminalida Socket.io xatolarini tekshiring:**
   ```
   ✅ "Client connected: [socket-id]"
   ✅ "Client disconnected: [socket-id]"
   ```

2. **Browser konsolini (F12) tekshiring:**
   ```javascript
   // Console'da tekshiring:
   // Socket.io status
   
   // Xato bo'lsa:
   Socket.IO client is not connected
   CORS error
   ```

3. **Backend server.js'da CORS tekshiring:**
   ```javascript
   cors: {
     origin: '*',  // ✅ TO'G'RI
     methods: ['GET', 'POST']
   }
   ```

4. **Frontend va Backend URL'larini tekshiring:**
   ```javascript
   // Frontend: socket = io('http://localhost:3000')
   // Backend: PORT = 3000
   // ✅ MOS kelishi kerak
   ```

5. **Ikkala oynani qayta oching:**
   ```
   Tab 1 & 2: Refresh (F5)
   Terminal: npm start/npm run dev qayta boshlang
   ```

---

## ❌ MUAMMO 7: "Stol raqamini kiritish" ishlamayapti

### Belgilari
- Input maydoniga yoz qabullanmayapti
- Buyurtma yuborish tugmasi ishlamayapti

### Yechimi

1. **Browser konsolini (F12 → Console) tekshiring:**
   - Qizil xatolar mavjud emasligini tekshiring

2. **Input maydonini tekshiring:**
   ```javascript
   // App.jsx'da:
   <input
     type="number"
     value={tableNumber}
     onChange={(e) => setTableNumber(e.target.value)} // ✅ KERAK
   />
   ```

3. **State'ni tekshiring:**
   - React Developer Tools (Chrome extension) o'rnatib, state ko'ring

4. **Brauzerni restart qiling:**
   - Ctrl+Shift+Delete (keshine o'chirish)
   - Sahifani F5 bilan yangilang

---

## ❌ MUAMMO 8: Ovoz Signali Eshitilmayapti

### Sabablari
- Brauzer ovozni blokirladi
- Audio context xatosi
- Sistema ovozi o'chiqlangan

### Yechimi

1. **Brauzer ovozini tekshiring:**
   - Taraychi panelida "🔔" belgisini tekshiring
   - Chrome: ⚙️ → Settings → Privacy → Site settings → Sound

2. **Sistem ovozini tekshiring:**
   - Windows: Volume mixerda Node/Chrome ovozini 100% qiling

3. **Console'da xatolarni tekshiring (F12):**
   ```javascript
   // Agar xato bo'lsa:
   AudioContext is not supported
   Permission denied for audio
   ```

4. **Veb-saytni qayta yuklang:**
   - Ctrl+Shift+R (Hard refresh)

---

## ❌ MUAMMO 9: "CORS error" (Network tab'da)

### Belgilari
```
Access to XMLHttpRequest at 'http://localhost:3000/api/orders'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

### Yechimi

**Backend server.js'da CORS'ni qo'shing:**
```javascript
import cors from 'cors';

app.use(cors());  // ✅ Barcha origin'lar uchun

// Yoki specific:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## ❌ MUAMMO 10: Taom ro'yxati yuklanmayapti

### Belgilari
- Taomlar checkboxlari ko'rinmayapti
- Menu grid bo'sh

### Yechimi

1. **Backend'ni tekshiring:**
   ```bash
   # Terminal'da:
   curl http://localhost:3000/api/menu
   
   # JSON array qaytib berish kerak
   ```

2. **Frontend console'ni tekshiring:**
   ```javascript
   // Network → /api/menu → Response
   // JSON data bo'lishi kerak
   ```

3. **Backend server.js'ni tekshiring:**
   ```javascript
   app.get('/api/menu', (req, res) => {
     res.json(menuItems);  // ✅ Kerak
   });
   ```

---

## ❌ MUAMMO 11: Bildirishnoma ishlamayapti

### Belgilari
- "Stol X tayyor!" ko'rinmaydi
- Toast message yo'q

### Yechimi

1. **Frontend App.jsx'ni tekshiring:**
   ```javascript
   socket.on('notification:ready', (data) => {
     setMessage(`🎉 Stol ${data.tableNumber} tayyor!`);
   });
   ```

2. **Backend holatini tekshiring:**
   ```javascript
   // Status READY bo'ladimi?
   if (status === 'READY') {
     io.emit('notification:ready', {
       orderId: order.id,
       tableNumber: order.tableNumber
     });
   }
   ```

3. **Socket.io events'ni tekshiring:**
   - Browser Developer Tools
   - "Socket.io Client" tab'i
   - Events log'ni ko'ring

---

## ❌ MUAMMO 12: "Cannot find module" xatosi

### Belgilari
```
Error: Cannot find module 'express'
```

### Yechimi

```bash
# Backend papkasida:
cd backend
npm install

# Frontend papkasida:
cd ../frontend
npm install

# Yoki paketi ixcham o'rnatish:
npm install express socket.io cors
npm install react socket.io-client vite
```

---

## ❌ MUAMMO 13: Terminal komandasi ishlamayapti

### Windows'da
```powershell
# npm komandasi ishlamasa:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Yoki cmd.exe ishlatib ko'ring
cmd.exe
cd c:\Users\KSM\Desktop\OSHXONA\backend
npm start
```

### Mac/Linux'da
```bash
# Ruxsatni berish:
chmod +x start.sh
./start.sh

# Yoki bevosita:
bash start.sh
```

---

## ❌ MUAMMO 14: React komponentlar render bo'lmiş

### Belgilari
- "Error boundary" xatosi
- Blank white page
- JavaScript xatosi

### Yechimi

1. **Browser konsolini ochish:**
   - F12 → Console
   - Qizil xatolarni o'qish

2. **Frontend faylini tekshiring:**
   ```javascript
   // src/App.jsx: Syntax xatosi yo'qligini tekshiring
   // src/main.jsx: Root element

   // index.html'da:
   <div id="root"></div>  // ✅ Kerak
   ```

3. **React Developer Tools:**
   - Chrome extension o'rnatib tekshiring
   - Component tree'ni ko'ring

---

## ❌ MUAMMO 15: "database.json" kerak xatosi

### Sababi
- Biron ko'tarilgan loyihadan copy qilingan
- OSHXONA in-memory database ishlatadi

### Yechimi
```javascript
// In-memory array yetarli!
let orders = [];  // ✅ Database o'rniga
```

---

## ✅ DEBUG CHECKLIST

Agar biron muammo bo'lsa, shu tartibda tekshiring:

```
□ Node.js o'rnatilgan emasligini tekshiring
  npm --version

□ Backend o'rnatilgan emasligini tekshiring
  cd backend && npm install

□ Frontend o'rnatilgan emasligini tekshiring
  cd frontend && npm install

□ Backend ishlamoqda
  http://localhost:3000

□ Frontend ishlamoqda
  http://localhost:5173

□ 2 ta tab'da ochilig
  Ofitsiant + Oshxona

□ Browser konsolida (F12) xatolar yo'q
  Console tab → Qizil xata?

□ Network tab'da 200 status
  Network → /api/menu, /api/orders

□ Socket.io ulanishi aktiv
  Console → Socket.IO Client

□ Real-time yangilanma ishlayapti
  Ofitsiant: Yuborish → Oshxona: Ko'rish
```

---

## 🚨 EMERGENCY RESET

Agar hammasi ishlamasa, qayta boshlang:

```powershell
# 1. Terminallni yopish
Ctrl+C (har ikkala terminalda)

# 2. Cache'ni o'chirish
cd backend
rmdir /s node_modules
rm package-lock.json

cd ../frontend
rmdir /s node_modules
rm package-lock.json

# 3. Qayta o'rnatish
cd backend
npm install
npm start

# NEW Terminal
cd frontend
npm install
npm run dev

# 4. Browser'ni qayta oching
http://localhost:5173
```

---

## 📞 KENGAYTIRILGAN DEBUG

### Backend Debug (Node)
```bash
# Debug mode'da run qilish
node --inspect server.js

# Chrome DevTools'ga kirish:
# chrome://inspect
```

### Frontend Debug (Browser)
```javascript
// Console'da:
- Component state: React Developer Tools
- Network requests: Network tab
- Socket.io: Socket.IO Client tab
- Errors: Console tab
```

### Xatolarni Qayd Qilish
```javascript
// Backend: server.js'ga log'lar qo'shing
console.log('Order created:', newOrder);
console.log('Status updated:', order);

// Frontend: App.jsx'ga
console.log('Orders:', orders);
console.log('Socket event:', data);
```

---

## 🎯 UMUMIY YECHIM

Agar hech narsa ishlamasa:

1. **Fayl tuzilishini tekshiring:**
   ```
   ✅ backend/server.js mavjud?
   ✅ frontend/src/App.jsx mavjud?
   ✅ package.json'lar mavjud?
   ```

2. **O'rnatish qayta qiling:**
   ```
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Terminallarni qayta boshlang:**
   ```
   Ctrl+C → npm start/npm run dev
   ```

4. **Browser'ni reset qiling:**
   ```
   Ctrl+Shift+Delete → Clear browsing data
   http://localhost:5173 → F5
   ```

5. **Kompyuterni restart qiling:**
   ```
   Oxirgi chora :)
   ```

---

## 📚 FOYDALANILGAN RESOURCELAR

- [Node.js Issues](https://github.com/nodejs/node/issues)
- [npm Troubleshooting](https://docs.npmjs.com/troubleshooting)
- [Express.js Errors](https://expressjs.com/en/guide/error-handling.html)
- [React Error Handling](https://react.dev/reference/react)
- [Socket.io Debugging](https://socket.io/docs/v4/debugging/)

---

**💡 Maslahat:** Agar muammoni hal qila olmasangiz, README.md va INTERACTIVE_GUIDE.md'ni qayta o'qib chiqing!

**🚀 Omad! Hammasi ishlaydimi? Shohir oladigan vaqt! 🎉**
