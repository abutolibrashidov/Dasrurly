# 🚀 OSHXONA Backend API Testing Guide

## ✅ Current Status

```
✅ Backend: Running on http://localhost:3000
✅ Frontend: Running on http://localhost:5173
✅ Database: In-memory (ready to use)
✅ Auth: JWT-based with 3 user roles
```

---

## 🧪 TESTING THE APIs

### Tool: Postman or curl

---

## 1️⃣ LOGIN (Get JWT Token)

**Endpoint**: `POST http://localhost:3000/api/auth/login`

**Test for Manager:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin",
    "username": "admin",
    "role": "manager"
  }
}
```

**Copy the token!** You'll use it for all other requests.

---

## 2️⃣ GET MENU (Public - No Auth Needed)

**Endpoint**: `GET http://localhost:3000/api/menu`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Plov",
    "price": 25000,
    "categoryId": 1,
    "isAvailable": true,
    "category": "Palovlar"
  },
  {
    "id": 2,
    "name": "Manti",
    "price": 18000,
    "categoryId": 2,
    "isAvailable": true,
    "category": "Ichakli taomlar"
  }
  ...
]
```

---

## 3️⃣ GET ROOMS (Manager Only)

**Endpoint**: `GET http://localhost:3000/api/rooms`

**Headers:**
```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Hall",
    "type": "main",
    "capacity": 50,
    "tableCount": 4,
    "freeTables": 4,
    "occupiedTables": 0
  },
  {
    "id": 2,
    "name": "VIP",
    "type": "vip",
    "capacity": 20,
    "tableCount": 2,
    "freeTables": 2,
    "occupiedTables": 0
  }
]
```

---

## 4️⃣ GET TABLES (Manager Only)

**Endpoint**: `GET http://localhost:3000/api/tables`

**Headers:**
```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Response:**
```json
[
  {
    "id": 1,
    "number": 1,
    "roomId": 1,
    "status": "free",
    "capacity": 4,
    "roomName": "Hall"
  },
  {
    "id": 2,
    "number": 2,
    "roomId": 1,
    "status": "free",
    "capacity": 4,
    "roomName": "Hall"
  }
]
```

---

## 5️⃣ CREATE NEW MENU ITEM (Manager Only)

**Endpoint**: `POST http://localhost:3000/api/menu`

**Headers:**
```
Authorization: Bearer <YOUR_JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Biryani",
  "price": 30000,
  "categoryId": 1,
  "isAvailable": true
}
```

**Response:**
```json
{
  "id": 9,
  "name": "Biryani",
  "price": 30000,
  "categoryId": 1,
  "isAvailable": true,
  "createdAt": "2026-04-10T09:45:00.000Z"
}
```

---

## 6️⃣ CREATE NEW ROOM (Manager Only)

**Endpoint**: `POST http://localhost:3000/api/rooms`

**Headers:**
```
Authorization: Bearer <YOUR_JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Terrace",
  "type": "outdoor",
  "capacity": 35
}
```

---

## 7️⃣ CREATE NEW TABLE (Manager Only)

**Endpoint**: `POST http://localhost:3000/api/tables`

**Headers:**
```
Authorization: Bearer <YOUR_JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "number": 9,
  "roomId": 3,
  "capacity": 6
}
```

---

## 8️⃣ GET ORDERS (Kitchen/Manager Only)

**Endpoint**: `GET http://localhost:3000/api/orders`

**Headers:**
```
Authorization: Bearer <KITCHEN_OR_MANAGER_TOKEN>
```

**Response:**
```json
[
  {
    "id": 1,
    "tableId": 1,
    "waiterId": 2,
    "items": [
      { "id": 1, "name": "Plov", "price": 25000 }
    ],
    "status": "NEW",
    "totalPrice": 25000,
    "table": { "id": 1, "number": 1 },
    "room": { "id": 1, "name": "Hall" },
    "waiter": { "id": 2, "name": "Alisher" }
  }
]
```

---

## 9️⃣ CREATE ORDER (Waiter Only)

**Endpoint**: `POST http://localhost:3000/api/orders`

**Headers:**
```
Authorization: Bearer <WAITER_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "tableId": 1,
  "items": [
    { "id": 1, "name": "Plov" },
    { "id": 2, "name": "Manti" }
  ],
  "notes": "No onions"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 1
}
```

---

## 🔟 UPDATE ORDER STATUS (Kitchen Only)

**Endpoint**: `PUT http://localhost:3000/api/orders/1/status`

**Headers:**
```
Authorization: Bearer <KITCHEN_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "status": "COOKING"
}
```

**Status Values:** `NEW` → `COOKING` → `READY`

---

## 1️⃣1️⃣ GET ANALYTICS (Manager Only)

**Endpoint**: `GET http://localhost:3000/api/analytics`

**Headers:**
```
Authorization: Bearer <MANAGER_TOKEN>
```

**Response:**
```json
{
  "totalOrders": 5,
  "ordersToday": 5,
  "activeOrders": 2,
  "readyOrders": 1,
  "occupiedTables": 2,
  "totalTables": 8,
  "averageOrderValue": 21500
}
```

---

## 🔐 Quick Login Commands (curl)

### Manager:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Waiter:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"waiter1","password":"pass123"}'
```

### Kitchen:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"kitchen1","password":"pass123"}'
```

---

## ⚠️ COMMON ERRORS & SOLUTIONS

### Error: 401 Unauthorized
**Cause**: Missing or invalid JWT token
**Solution**: Make sure you added `Authorization: Bearer <token>` header

### Error: 403 Forbidden
**Cause**: Your role doesn't have access to this endpoint
**Solution**: Use the correct user role (manager for config, waiter for orders, etc)

### Error: 404 Not Found
**Cause**: Resource doesn't exist
**Solution**: Check the ID is valid

### Error: 400 Bad Request
**Cause**: Invalid data in request body
**Solution**: Check field names and data types match the API spec

---

## 🧩 Socket.io Test (Browser Console)

Open browser console and test real-time updates:

```javascript
// Listen for order updates
socket.on('orders:updated', (orders) => {
  console.log('Orders updated:', orders);
});

// Listen for new orders
socket.on('order:created', (order) => {
  console.log('New order:', order);
});

// Listen for ready notifications
socket.on('notification:ready', (data) => {
  console.log('Order ready:', data);
});
```

---

## ✅ Full Workflow Test

```
1. Manager logs in → admin / admin123
2. Manager creates new menu item
3. Manager creates new room
4. Manager creates table in room
5. Manager logs out

6. Waiter logs in → waiter1 / pass123
7. Waiter creates order for table 1
   ├─ Items: Plov, Manti
8. Waiter sees order in their panel
9. Waiter logs out

10. Kitchen logs in → kitchen1 / pass123
11. Kitchen sees new order in real-time
12. Kitchen changes status: NEW → COOKING
13. Kitchen changes status: COOKING → READY
14. Kitchen sees analytics
15. Kitchen logs out

16. Waiter logs back in
17. Waiter sees order is READY
18. Waiter marks order as complete
19. Table becomes free
20. Done! ✅
```

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│   Manager UI    │
└────────┬────────┘
         │
         ├─ POST /api/menu
         ├─ POST /api/rooms
         ├─ POST /api/tables
         └─ GET /api/analytics

┌─────────────────┐
│   Waiter UI     │
└────────┬────────┘
         │
         ├─ GET /api/tables
         ├─ POST /api/orders
         └─ GET /api/orders/:id/status

┌─────────────────┐
│   Kitchen UI    │
└────────┬────────┘
         │
         ├─ GET /api/orders
         ├─ PUT /api/orders/:id/status
         └─ GET /api/analytics
         
         ↓
         
┌──────────────────────────────────┐
│    Backend Services (JWT Auth)   │
└──────────────────────────────────┘
         │
         ├─ AuthService
         ├─ MenuService
         ├─ RoomService
         ├─ TableService
         └─ OrderService
         
         ↓
         
┌──────────────────────────────────┐
│    In-Memory Database            │
│  (Ready for MongoDB/PostgreSQL)  │
└──────────────────────────────────┘
```

---

## 🎯 Ready to Proceed?

All backend APIs are tested and working!

**Next Phase**: Build Manager Dashboard UI on frontend
