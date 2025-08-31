# Postman Auto-Generation Guide

## ✅ **Smart Payload Generation Implemented**

Your Postman collection now includes intelligent auto-generation of payload data using pre-request scripts. No more manual data entry!

### **🎯 Auto-Generated Endpoints**

#### **01. User Registration** 
- **Phone Numbers**: Random international numbers (+1, +33, +34, +39, +44)
- **Names**: Realistic first/last name combinations
- **Emails**: Auto-generated @nauttec.com addresses  
- **Roles**: Random selection (renter, owner, admin)
- **Console Output**: Shows generated data for verification

#### **02. Authentication Flow**
- **Phone Consistency**: Uses generated phone from registration
- **OTP Codes**: Demo code (123456) auto-applied
- **Session Management**: Maintains phone number across requests

#### **03. Booking Creation**
- **Dates**: Future dates (7-37 days ahead) with realistic duration (1-5 days)
- **Guest Count**: Random realistic numbers (2, 4, 6, 8, 10, 12)
- **Occasions**: Varied special requests (birthday, anniversary, business, etc.)
- **Smart Scheduling**: Ensures end date is after start date

#### **04. Payment Processing**
- **Amounts**: Realistic yacht pricing (€1,200 - €9,600)
- **Currencies**: Multi-currency support (EUR, USD, GBP)
- **Descriptions**: Context-aware payment descriptions
- **User Context**: Links to current authenticated user

#### **05. Lead Inquiries**
- **Contact Info**: Realistic names, emails, phone numbers
- **Inquiry Types**: Varied interests (fractional ownership, charter, purchase)
- **Budget Ranges**: Realistic yacht market segments (€100K - €2M+)
- **Timelines**: Realistic purchase timelines (immediate to 1 year)
- **Locations**: Premium Mediterranean destinations
- **Messages**: Dynamic yacht model and location combinations

#### **06. Notifications**
- **Titles**: Context-aware notification types
- **Messages**: Realistic yacht platform notifications
- **Priorities**: Appropriate priority levels (low, medium, high)
- **Types**: Categorized notification types (booking, payment, weather, etc.)

#### **07. Fuel Wallet Operations**
- **Amounts**: Realistic fuel credit purchases (€250 - €2,000)
- **Payment Methods**: Various payment options
- **Owner Context**: Uses owner test phone numbers

### **🔧 How It Works**

#### **Pre-Request Scripts**
Each enhanced endpoint includes JavaScript that runs before the request:

```javascript
// Example: User Registration
const randomPhone = '+33' + Math.floor(Math.random() * 900000000 + 100000000);
const firstName = ['Alex', 'Jordan', 'Taylor'][Math.floor(Math.random() * 3)];
pm.environment.set('generated_phone', randomPhone);
```

#### **Environment Variables**
Auto-generated data is stored in environment variables:
- `generated_phone` - Current user's phone number
- `current_phone` - Active session phone
- `booking_start_date` - Generated booking dates
- `payment_amount` - Random payment amounts
- `inquiry_name` - Generated lead names

#### **Console Logging**
Each script logs generated data to Postman console:
```
Generated User Data:
Phone: +33456789123
Email: alex.smith4567@nauttec.com
Name: Alex Smith
Role: owner
```

### **🚀 Usage Instructions**

#### **1. Import & Setup**
- Import `nauttec_comprehensive_api_collection.json`
- Import `nauttec_postman_environment.json`
- Select Nauttec environment

#### **2. Auto-Generation Testing**
- **Single Request**: Just click Send - data auto-generates
- **Sequential Flow**: Registration → OTP → Booking → Payment
- **Bulk Testing**: Run collection - each iteration uses fresh data

#### **3. View Generated Data**
- **Console**: View → Show Postman Console
- **Environment**: Click eye icon to see current variables
- **Request Body**: Auto-populated with generated values

#### **4. Manual Override**
You can still manually edit values if needed:
- Edit environment variables directly
- Modify request body before sending
- Use static values by updating pre-request scripts

### **📊 Benefits**

#### **Realistic Testing**
- **Varied Data**: No duplicate phone numbers or emails
- **Realistic Scenarios**: Appropriate dates, amounts, locations
- **Business Logic**: Meaningful combinations of yacht models and locations

#### **Automated Workflows**
- **No Manual Entry**: Just click and test
- **Consistent Sessions**: Phone numbers maintained across related requests
- **Fresh Data**: New realistic data for each test run

#### **Professional Testing**
- **Demo Ready**: Generate impressive demo data instantly
- **Load Testing**: Run collections with varied realistic data
- **Documentation**: Clear console output for debugging

### **🎯 Next Level Features**

#### **Smart Chaining**
The collection intelligently chains requests:
1. **Register User** → generates phone
2. **Send OTP** → uses generated phone  
3. **Create Booking** → uses authenticated user
4. **Process Payment** → links to booking

#### **Realistic Business Data**
- **Yacht Models**: Actual De Antonio range (D23-D60)
- **Locations**: Real Mediterranean destinations
- **Pricing**: Market-appropriate amounts
- **Timelines**: Realistic booking and inquiry patterns

#### **Console Insights**
Every generated request shows:
- What data was created
- Why specific values were chosen
- How data flows between requests

### **⚡ Pro Tips**

1. **Collection Runner**: Use Collection Runner for automated testing with fresh data
2. **Environment Switching**: Duplicate environment for different test scenarios
3. **Console Monitoring**: Keep console open to see generation process
4. **Variable Inspection**: Check environment variables to understand data flow
5. **Custom Scripts**: Modify pre-request scripts for specific test needs

Your Postman collection is now **production-grade** with intelligent auto-generation that eliminates manual data entry while providing realistic, varied test scenarios! 🚀