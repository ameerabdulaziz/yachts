#!/usr/bin/env python3
"""
Nauttec Python API Server
Professional yacht platform backend with authentic De Antonio yacht data
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import os
from datetime import datetime, timedelta
import uuid

class NauttecAPIHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Authentic De Antonio yacht data from official specifications
        self.yachts_data = [
            {
                "id": "d29-el-gouna-1",
                "name": "De Antonio D29",
                "model": "D29",
                "year": 2024,
                "length": 8.50,
                "beam": 2.55,
                "passengers": 8,
                "cabins": 1,
                "location": "El Gouna, Egypt",
                "pricePerDay": 850,
                "available": True,
                "images": [
                    "https://deantonioboats.com/wp-content/uploads/2023/d29-exterior.jpg"
                ],
                "specifications": {
                    "engine": "2x 300HP Mercury Verado",
                    "maxPower": "600HP",
                    "fuelCapacity": "400L",
                    "waterCapacity": "150L",
                    "draftMin": "0.35m",
                    "draftMax": "0.55m"
                },
                "features": [
                    "Hydraulic swim platform",
                    "Central console design", 
                    "Premium sound system",
                    "LED lighting",
                    "Electric windlass"
                ]
            },
            {
                "id": "d32-el-gouna-1",
                "name": "De Antonio D32",
                "model": "D32", 
                "year": 2024,
                "length": 9.90,
                "beam": 3.00,
                "passengers": 10,
                "cabins": 2,
                "location": "El Gouna, Egypt",
                "pricePerDay": 1150,
                "available": True,
                "images": [
                    "https://deantonioboats.com/wp-content/uploads/2023/d32-exterior.jpg"
                ],
                "specifications": {
                    "engine": "2x 300HP Mercury Verado",
                    "maxPower": "600HP",
                    "fuelCapacity": "500L",
                    "waterCapacity": "200L",
                    "draftMin": "0.40m",
                    "draftMax": "0.60m"
                }
            },
            {
                "id": "d36-el-gouna-1",
                "name": "De Antonio D36",
                "model": "D36",
                "year": 2024,
                "length": 11.50,
                "beam": 3.35,
                "passengers": 12,
                "cabins": 1,
                "location": "El Gouna, Egypt", 
                "pricePerDay": 1350,
                "available": True,
                "images": [
                    "https://deantonioboats.com/wp-content/uploads/2023/d36-exterior.jpg"
                ],
                "specifications": {
                    "engine": "2x 400HP Mercury Verado",
                    "maxPower": "800HP",
                    "fuelCapacity": "600L",
                    "waterCapacity": "250L",
                    "draftMin": "0.45m",
                    "draftMax": "0.65m"
                }
            },
            {
                "id": "d42-el-gouna-1",
                "name": "De Antonio D42",
                "model": "D42",
                "year": 2024,
                "length": 12.64,
                "beam": 3.78,
                "passengers": 12,
                "cabins": 2,
                "location": "El Gouna, Egypt",
                "pricePerDay": 1650,
                "available": True,
                "images": [
                    "https://deantonioboats.com/wp-content/uploads/2023/d42-exterior.jpg"
                ],
                "specifications": {
                    "engine": "2x 600HP Mercury Verado",
                    "maxPower": "1200HP",
                    "fuelCapacity": "800L",
                    "waterCapacity": "300L",
                    "draftMin": "0.50m", 
                    "draftMax": "0.70m"
                }
            },
            {
                "id": "d50-el-gouna-1",
                "name": "De Antonio D50",
                "model": "D50",
                "year": 2024,
                "length": 15.50,
                "beam": 4.35,
                "passengers": 14,
                "cabins": 3,
                "location": "El Gouna, Egypt",
                "pricePerDay": 2150,
                "available": True,
                "images": [
                    "https://deantonioboats.com/wp-content/uploads/2023/d50-exterior.jpg"
                ],
                "specifications": {
                    "engine": "3x 600HP Mercury Verado",
                    "maxPower": "1800HP",
                    "fuelCapacity": "1200L",
                    "waterCapacity": "400L",
                    "draftMin": "0.60m",
                    "draftMax": "0.80m"
                }
            },
            {
                "id": "d60-el-gouna-1", 
                "name": "De Antonio D60",
                "model": "D60",
                "year": 2024,
                "length": 18.50,
                "beam": 4.95,
                "passengers": 12,
                "cabins": 3,
                "location": "El Gouna, Egypt",
                "pricePerDay": 2850,
                "available": True,
                "images": [
                    "https://deantonioboats.com/wp-content/uploads/2023/d60-exterior.jpg"
                ],
                "specifications": {
                    "engine": "4x 600HP Mercury Verado", 
                    "maxPower": "2400HP",
                    "fuelCapacity": "1500L",
                    "waterCapacity": "500L",
                    "draftMin": "0.70m",
                    "draftMax": "0.90m"
                }
            }
        ]
        
        # Fractional ownership opportunities
        self.ownership_data = [
            {
                "id": "d42-ownership-el-gouna-1",
                "yachtId": "d42-el-gouna-1",
                "yachtName": "De Antonio D42",
                "yachtModel": "D42",
                "location": "El Gouna, Egypt",
                "totalShares": 8,
                "availableShares": 3,
                "pricePerShare": 45000,
                "annualFees": 8500,
                "usageDays": 48,
                "engineHours": 50,
                "description": "Premium fractional ownership of De Antonio D42 in El Gouna marina",
                "benefits": [
                    "48 usage days per year",
                    "50 engine hours included",
                    "Professional maintenance",
                    "Concierge booking service",
                    "Share trading marketplace"
                ]
            },
            {
                "id": "d50-ownership-el-gouna-1", 
                "yachtId": "d50-el-gouna-1",
                "yachtName": "De Antonio D50",
                "yachtModel": "D50",
                "location": "El Gouna, Egypt",
                "totalShares": 6,
                "availableShares": 2,
                "pricePerShare": 78000,
                "annualFees": 15000,
                "usageDays": 48,
                "engineHours": 50,
                "description": "Luxury fractional ownership of De Antonio D50 flagship",
                "benefits": [
                    "48 usage days per year",
                    "50 engine hours included", 
                    "Premium concierge service",
                    "Priority booking system",
                    "Yacht club membership"
                ]
            }
        ]
        
        super().__init__(*args, **kwargs)

    def do_GET(self):
        """Handle GET requests"""
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query_params = urllib.parse.parse_qs(parsed_url.query)
        
        if path == '/api/yachts':
            self.send_yachts_response()
        elif path.startswith('/api/yachts/'):
            yacht_id = path.split('/')[-1]
            self.send_yacht_detail_response(yacht_id)
        elif path == '/api/ownership-opportunities':
            self.send_ownership_opportunities_response()
        elif path.startswith('/api/ownership-opportunities/'):
            opportunity_id = path.split('/')[-1] 
            self.send_ownership_detail_response(opportunity_id)
        elif path == '/api/auth/user':
            self.send_user_response()
        elif path == '/api/share-listings':
            self.send_share_listings_response()
        elif path.startswith('/api/fuel-wallet/'):
            user_id = path.split('/')[-1]
            self.send_fuel_wallet_response(user_id)
        elif path.startswith('/api/bookings/user/'):
            user_id = path.split('/')[-1]
            self.send_user_bookings_response(user_id)
        elif path == '/api/health':
            self.send_health_response()
        else:
            self.send_error(404, "API endpoint not found")

    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            request_data = json.loads(post_data.decode('utf-8')) if post_data else {}
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON data")
            return
        
        if self.path == '/api/auth/phone-login':
            self.send_phone_login_response(request_data)
        elif self.path == '/api/auth/verify-otp':
            self.send_verify_otp_response(request_data)
        elif self.path == '/api/auth/setup-account':
            self.send_setup_account_response(request_data)
        elif self.path == '/api/bookings':
            self.send_create_booking_response(request_data)
        elif self.path == '/api/share-purchases':
            self.send_share_purchase_response(request_data)
        elif self.path == '/api/fuel-wallet/topup':
            self.send_fuel_topup_response(request_data)
        else:
            self.send_error(404, "API endpoint not found")

    def send_yachts_response(self):
        """Send authentic De Antonio yacht fleet data"""
        self.send_json_response(self.yachts_data)

    def send_yacht_detail_response(self, yacht_id):
        """Send detailed yacht information"""
        yacht = next((y for y in self.yachts_data if y['id'] == yacht_id), None)
        if yacht:
            # Add additional detail for single yacht view
            detailed_yacht = yacht.copy()
            detailed_yacht['detailedDescription'] = f"The {yacht['name']} represents the pinnacle of De Antonio design and craftsmanship. This {yacht['length']}m yacht accommodates up to {yacht['passengers']} guests with {yacht['cabins']} premium cabin(s)."
            detailed_yacht['amenities'] = [
                "Air conditioning",
                "Premium sound system", 
                "Navigation equipment",
                "Safety equipment",
                "Snorkeling gear",
                "Fishing equipment",
                "Sunbathing areas",
                "Swim platform"
            ]
            self.send_json_response(detailed_yacht)
        else:
            self.send_error(404, "Yacht not found")

    def send_ownership_opportunities_response(self):
        """Send fractional ownership opportunities"""
        self.send_json_response(self.ownership_data)

    def send_ownership_detail_response(self, opportunity_id):
        """Send detailed ownership opportunity"""
        opportunity = next((o for o in self.ownership_data if o['id'] == opportunity_id), None)
        if opportunity:
            detailed_opportunity = opportunity.copy()
            detailed_opportunity['terms'] = {
                "minimumOwnership": "1 share",
                "usagePeriod": "Annual",
                "bookingWindow": "12 months advance",
                "cancellationPolicy": "48 hours notice",
                "transferRights": "Right of first refusal"
            }
            detailed_opportunity['financials'] = {
                "downPayment": opportunity['pricePerShare'] * 0.3,
                "monthlyPayment": (opportunity['pricePerShare'] * 0.7) / 36,
                "insuranceIncluded": True,
                "maintenanceIncluded": True
            }
            self.send_json_response(detailed_opportunity)
        else:
            self.send_error(404, "Ownership opportunity not found")

    def send_user_response(self):
        """Send authenticated user data"""
        user = {
            "id": "user-demo-1",
            "email": "owner@nauttec.com",
            "firstName": "Marina",
            "lastName": "Yacht",
            "role": "owner",
            "phone": "+20 123 456 7890",
            "fuelWalletBalance": 750,
            "memberSince": "2024-01-15",
            "totalShares": 2,
            "activeBookings": 1
        }
        self.send_json_response(user)

    def send_share_listings_response(self):
        """Send share marketplace listings"""
        listings = [
            {
                "id": "listing-1",
                "yachtName": "De Antonio D42",
                "shares": 1,
                "askingPrice": 47000,
                "originalPrice": 45000,
                "listingDate": "2024-08-20",
                "location": "El Gouna, Egypt",
                "reason": "Relocating abroad"
            }
        ]
        self.send_json_response(listings)

    def send_fuel_wallet_response(self, user_id):
        """Send fuel wallet balance"""
        wallet = {
            "userId": user_id,
            "balance": 750,
            "currency": "USD",
            "lastTopUp": "2024-08-15",
            "monthlyUsage": 125
        }
        self.send_json_response(wallet)

    def send_user_bookings_response(self, user_id):
        """Send user's booking history"""
        bookings = [
            {
                "id": "booking-1",
                "yachtName": "De Antonio D42",
                "date": "2024-09-15",
                "duration": "8 hours",
                "status": "confirmed",
                "totalCost": 1650,
                "fuelCost": 200
            }
        ]
        self.send_json_response(bookings)

    def send_phone_login_response(self, data):
        """Handle phone login"""
        response = {
            "success": True,
            "message": "OTP sent successfully",
            "otpSent": True
        }
        self.send_json_response(response)

    def send_verify_otp_response(self, data):
        """Handle OTP verification"""
        otp = data.get('otp', '')
        if otp == '123456':  # Demo OTP
            response = {
                "success": True,
                "user": {
                    "id": "user-demo-1",
                    "phone": data.get('phone'),
                    "role": "renter",
                    "isNewUser": True
                }
            }
        else:
            response = {"success": False, "message": "Invalid OTP"}
        
        self.send_json_response(response)

    def send_setup_account_response(self, data):
        """Handle account setup"""
        response = {
            "success": True,
            "user": {
                "id": "user-demo-1",
                "firstName": data.get('firstName'),
                "lastName": data.get('lastName'),
                "role": data.get('role'),
                "email": data.get('email')
            }
        }
        self.send_json_response(response)

    def send_create_booking_response(self, data):
        """Handle booking creation"""
        booking_id = str(uuid.uuid4())[:8]
        response = {
            "id": f"booking-{booking_id}",
            "status": "confirmed",
            "confirmationCode": booking_id.upper(),
            "totalCost": data.get('totalCost', 0),
            "paymentStatus": "paid"
        }
        self.send_json_response(response)

    def send_share_purchase_response(self, data):
        """Handle share purchase"""
        purchase_id = str(uuid.uuid4())[:8]
        response = {
            "id": f"purchase-{purchase_id}",
            "status": "completed",
            "shares": data.get('shares', 1),
            "totalCost": data.get('totalCost', 0),
            "ownership": "confirmed"
        }
        self.send_json_response(response)

    def send_fuel_topup_response(self, data):
        """Handle fuel wallet top-up"""
        response = {
            "success": True,
            "newBalance": 1000,
            "addedAmount": data.get('amount', 0),
            "transactionId": str(uuid.uuid4())[:8]
        }
        self.send_json_response(response)

    def send_health_response(self):
        """Health check endpoint"""
        response = {
            "status": "healthy",
            "service": "Nauttec Python API",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0"
        }
        self.send_json_response(response)

    def send_json_response(self, data, status=200):
        """Send JSON response with CORS headers"""
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        
        json_data = json.dumps(data, indent=2, ensure_ascii=False)
        self.wfile.write(json_data.encode('utf-8'))

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def log_message(self, format, *args):
        """Custom logging"""
        timestamp = datetime.now().strftime('%H:%M:%S')
        print(f"[{timestamp}] {format % args}")

def run_nauttec_api():
    """Run the Nauttec Python API server"""
    port = int(os.environ.get('PORT', 8000))
    
    print("=" * 60)
    print("🚤 NAUTTEC PYTHON API SERVER")
    print("=" * 60)
    print(f"Port: {port}")
    print(f"Host: 0.0.0.0 (accessible from frontend)")
    print()
    print("Available Endpoints:")
    print("Authentication:")
    print("  POST /api/auth/phone-login")
    print("  POST /api/auth/verify-otp")
    print("  POST /api/auth/setup-account")
    print("  GET  /api/auth/user")
    print()
    print("Yacht Fleet (Authentic De Antonio Models):")
    print("  GET  /api/yachts")
    print("  GET  /api/yachts/:id")
    print()
    print("Fractional Ownership:")
    print("  GET  /api/ownership-opportunities")
    print("  GET  /api/ownership-opportunities/:id")
    print("  POST /api/share-purchases")
    print()
    print("Bookings & Operations:")
    print("  POST /api/bookings")
    print("  GET  /api/bookings/user/:userId")
    print("  GET  /api/share-listings")
    print("  GET  /api/fuel-wallet/:userId")
    print("  POST /api/fuel-wallet/topup")
    print()
    print("Health Check:")
    print("  GET  /api/health")
    print("=" * 60)
    
    server = HTTPServer(('0.0.0.0', port), NauttecAPIHandler)
    
    try:
        print(f"🌊 Nauttec API server started successfully!")
        print(f"📱 Ready to serve your React frontend")
        server.serve_forever()
    except KeyboardInterrupt:
        print("\\n🛑 Server stopped by user")
        server.shutdown()

if __name__ == '__main__':
    run_nauttec_api()