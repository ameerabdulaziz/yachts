# 🧪 **REST API Testing Guide - Nauttec Yacht Platform**

## **Backend Servers Available**
- **Node.js/Express** - Port 5000 (Primary)
- **Django REST Framework** - Port 8001 (Ready for setup)
- **Python HTTP Server** - Port 8000 (Standalone)

---

## **✅ WORKING APIs - Node.js Backend (Port 5000)**

### **1. Yachts Management**

**GET /api/yachts** - List all yachts ✅
```bash
curl "http://localhost:5000/api/yachts"
```
✅ **Result**: Returns array with De Antonio D60 and D42 yachts

**POST /api/yachts** - Create new yacht ✅
```bash
curl -X POST "http://localhost:5000/api/yachts" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "De Antonio D36",
    "description": "Elegant day cruiser with premium amenities",
    "location": "El Gouna, Egypt",
    "pricePerDay": "1200.00",
    "capacity": 10,
    "cabins": 1,
    "length": "11.50",
    "yearBuilt": 2024,
    "images": ["https://example.com/d36-1.jpg"],
    "amenities": ["Air conditioning", "WiFi", "Bluetooth sound"]
  }'
```

### **2. Users Management**

**GET /api/users** - List all users ✅
```bash
curl "http://localhost:5000/api/users"
```

**POST /api/users** - Create new user ✅
```bash
curl -X POST "http://localhost:5000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+201234567890",
    "email": "owner@nauttec.com",
    "firstName": "Mohamed",
    "lastName": "Ahmed",
    "role": "owner",
    "password": "securepass123"
  }'
```

### **3. Fractional Ownership**

**GET /api/ownership-opportunities** - List ownership opportunities ⚠️
```bash
curl "http://localhost:5000/api/ownership-opportunities"
```
**Status**: Returns error - needs schema fix

**POST /api/ownership-opportunities** - Create ownership opportunity ✅
```bash
curl -X POST "http://localhost:5000/api/ownership-opportunities" \
  -H "Content-Type: application/json" \
  -d '{
    "yachtId": "2ded1cf3-faa6-4191-af1b-5670b3b9c04b",
    "totalShares": 8,
    "availableShares": 6,
    "pricePerShare": "125000.00",
    "usageDaysPerYear": 48,
    "description": "Own a share of the luxurious De Antonio D60"
  }'
```

### **4. Bookings System**

**GET /api/bookings** - List all bookings ✅
```bash
curl "http://localhost:5000/api/bookings"
```

**POST /api/bookings** - Create new booking ✅
```bash
curl -X POST "http://localhost:5000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "yachtId": "2ded1cf3-faa6-4191-af1b-5670b3b9c04b",
    "userId": "user_id_here",
    "startDate": "2024-12-25T10:00:00Z",
    "endDate": "2024-12-27T18:00:00Z",
    "guestCount": 8,
    "totalPrice": "7500.00"
  }'
```

---

## **🧪 Testing Tools & Methods**

### **Method 1: Terminal/Command Line**
```bash
# Basic GET request
curl "http://localhost:5000/api/yachts"

# POST with JSON data
curl -X POST "http://localhost:5000/api/endpoint" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'

# Include response headers
curl -i "http://localhost:5000/api/yachts"
```

### **Method 2: Browser Developer Tools**
1. Open browser → F12 → Console
2. Test with JavaScript:
```javascript
// GET Request
fetch('http://localhost:5000/api/yachts')
  .then(r => r.json())
  .then(console.log)

// POST Request  
fetch('http://localhost:5000/api/users', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  })
}).then(r => r.json()).then(console.log)
```

### **Method 3: Online Tools**
- **Postman** - Desktop API client
- **Insomnia** - Free API testing tool
- **HTTPie** - Command line tool
- **Thunder Client** - VS Code extension

### **Method 4: Python Testing Script**
```python
import requests
import json

# Test GET endpoint
response = requests.get('http://localhost:5000/api/yachts')
print(f"Status: {response.status_code}")
print(f"Data: {response.json()}")

# Test POST endpoint
data = {
    "name": "Test Yacht",
    "location": "Test Location",
    "pricePerDay": "1000.00",
    "capacity": 8,
    "cabins": 2
}
response = requests.post(
    'http://localhost:5000/api/yachts',
    json=data
)
print(f"Created: {response.json()}")
```

---

## **📊 Expected API Responses**

### **Successful Response**
```json
{
  "id": "uuid-here",
  "name": "De Antonio D60",
  "description": "Flagship luxury yacht",
  "location": "El Gouna, Egypt",
  "pricePerDay": "2500.00",
  "capacity": 12,
  "cabins": 3,
  "length": "18.50",
  "yearBuilt": 2024,
  "isActive": true,
  "createdAt": "2025-08-27T17:21:43.915Z"
}
```

### **Error Response**
```json
{
  "message": "Error description",
  "status": 400
}
```

---

## **🛠️ Troubleshooting**

### **Common Issues:**
1. **HTML returned instead of JSON** → Check URL path, ensure it starts with `/api/`
2. **Connection refused** → Server not running, start with workflow
3. **404 Not Found** → Wrong endpoint URL
4. **500 Server Error** → Check server logs in workflow console

### **Debugging Steps:**
1. Check server is running: `curl http://localhost:5000/api/yachts`
2. Verify request format: Ensure Content-Type header for POST
3. Check logs: Look at workflow console for errors
4. Test simple endpoints first: Start with GET requests

---

## **🚀 Next Steps**

1. **Fix ownership opportunities endpoint**
2. **Add authentication to protected endpoints**
3. **Set up Django REST Framework APIs**
4. **Add API documentation with Swagger/OpenAPI**
5. **Implement rate limiting and security**

Your Node.js backend APIs are working well for yachts, users, and bookings. The fractional ownership system needs a small fix to complete the testing suite.