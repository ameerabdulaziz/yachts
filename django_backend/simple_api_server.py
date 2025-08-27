#!/usr/bin/env python3
"""
Simple Python API server for Nauttec yacht platform
Fallback when Django dependencies are not available
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import os

class NauttecAPIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        if self.path.startswith('/api/yachts'):
            self.send_yachts_response()
        elif self.path.startswith('/api/ownership-opportunities'):
            self.send_ownership_response()
        elif self.path.startswith('/api/auth/user'):
            self.send_user_response()
        else:
            self.send_error(404, "Endpoint not found")
    
    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        if self.path.startswith('/api/auth/'):
            self.send_auth_response()
        elif self.path.startswith('/api/bookings'):
            self.send_booking_response()
        else:
            self.send_error(404, "Endpoint not found")
    
    def send_yachts_response(self):
        """Send yacht data - authentic De Antonio models"""
        yachts = [
            {
                "id": "d29-el-gouna-1",
                "name": "De Antonio D29",
                "model": "D29", 
                "year": 2024,
                "length": 8.50,
                "passengers": 8,
                "cabins": 1,
                "location": "El Gouna, Egypt",
                "pricePerDay": 850,
                "images": ["/api/images/d29-1.jpg"],
                "specifications": {
                    "engine": "2x 300HP",
                    "fuelCapacity": "400L",
                    "waterCapacity": "150L"
                }
            },
            {
                "id": "d42-el-gouna-1", 
                "name": "De Antonio D42",
                "model": "D42",
                "year": 2024,
                "length": 12.64,
                "passengers": 12,
                "cabins": 2, 
                "location": "El Gouna, Egypt",
                "pricePerDay": 1450,
                "images": ["/api/images/d42-1.jpg"],
                "specifications": {
                    "engine": "2x 600HP",
                    "fuelCapacity": "800L", 
                    "waterCapacity": "300L"
                }
            }
        ]
        
        self.send_json_response(yachts)
    
    def send_ownership_response(self):
        """Send fractional ownership opportunities"""
        opportunities = [
            {
                "id": "d42-ownership-1",
                "yachtId": "d42-el-gouna-1",
                "yachtName": "De Antonio D42",
                "totalShares": 8,
                "availableShares": 3,
                "pricePerShare": 45000,
                "annualFees": 8500,
                "usageDays": 48,
                "engineHours": 50
            }
        ]
        
        self.send_json_response(opportunities)
    
    def send_user_response(self):
        """Send demo user data"""
        user = {
            "id": "demo-user-1",
            "email": "demo@nauttec.com", 
            "firstName": "Demo",
            "lastName": "User",
            "role": "owner",
            "fuelWalletBalance": 250
        }
        
        self.send_json_response(user)
    
    def send_auth_response(self):
        """Handle authentication"""
        response = {"success": True, "message": "Authentication successful"}
        self.send_json_response(response)
    
    def send_booking_response(self):
        """Handle booking creation"""
        response = {"id": "booking-123", "status": "confirmed"}
        self.send_json_response(response)
    
    def send_json_response(self, data):
        """Send JSON response with CORS headers"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server():
    """Run the simple API server"""
    port = int(os.environ.get('PORT', 8000))
    server = HTTPServer(('0.0.0.0', port), NauttecAPIHandler)
    print(f"Nauttec API server running on port {port}")
    print(f"Available endpoints:")
    print(f"- GET  /api/yachts")
    print(f"- GET  /api/ownership-opportunities") 
    print(f"- GET  /api/auth/user")
    print(f"- POST /api/auth/login")
    print(f"- POST /api/bookings")
    server.serve_forever()

if __name__ == '__main__':
    run_server()
