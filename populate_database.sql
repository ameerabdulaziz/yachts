-- Populate Nauttec Database with UI Data
-- Complete data insertion for all tables

-- 1. Insert Users (owners, renters, both)
INSERT INTO users (phone, email, "first_name", "last_name", role, "fuel_wallet_balance", password, "is_verified") VALUES
('+201234567890', 'mohamed.hassan@nauttec.com', 'Mohamed', 'Hassan', 'owner', 2500.00, 'securepass123', true),
('+201987654321', 'sarah.ahmed@nauttec.com', 'Sarah', 'Ahmed', 'both', 1200.00, 'userpass456', true),
('+201555123456', 'omar.ali@nauttec.com', 'Omar', 'Ali', 'renter', 800.00, 'rentpass789', true),
('+201444987654', 'fatima.mohamed@nauttec.com', 'Fatima', 'Mohamed', 'owner', 3200.00, 'ownerpass321', true),
('+201333555777', 'ahmed.ibrahim@nauttec.com', 'Ahmed', 'Ibrahim', 'both', 1800.00, 'bothpass654', true);

-- 2. Insert Ownership Opportunities (fractional ownership for each yacht)
INSERT INTO ownership_opportunities ("yacht_id", "total_shares", "available_shares", "price_per_share", "usage_days_per_year", description) VALUES
-- D29 Ownership (35K per share)
((SELECT id FROM yachts WHERE name = 'De Antonio D29' LIMIT 1), 10, 8, 35000.00, 48, 'Own a share of the compact De Antonio D29 - perfect entry point into luxury yacht ownership'),
-- D32 Ownership (48K per share)  
((SELECT id FROM yachts WHERE name = 'De Antonio D32' LIMIT 1), 10, 7, 48000.00, 48, 'Fractional ownership of the versatile De Antonio D32 with dual 300HP engines'),
-- D36 Ownership (65K per share)
((SELECT id FROM yachts WHERE name = 'De Antonio D36' LIMIT 1), 10, 5, 65000.00, 48, 'Elegant D36 fractional ownership - spacious day cruiser perfect for entertaining'),
-- D42 Ownership (89K per share)
((SELECT id FROM yachts WHERE name = 'De Antonio D42' LIMIT 1), 8, 4, 89000.00, 48, 'Premium D42 ownership shares - sport yacht with exceptional performance'),
-- D50 Ownership (150K per share)
((SELECT id FROM yachts WHERE name = 'De Antonio D50' LIMIT 1), 8, 3, 150000.00, 48, 'Luxury D50 fractional ownership - premium yacht with advanced features'),
-- D60 Ownership (175K per share)
((SELECT id FROM yachts WHERE name = 'De Antonio D60' LIMIT 1), 12, 6, 175000.00, 48, 'Flagship D60 ownership opportunity - the ultimate in luxury yacht ownership');

-- 3. Insert Bookings (active reservations)
INSERT INTO bookings ("yacht_id", "user_id", "start_date", "end_date", "guest_count", "total_price", status) VALUES
-- Mohamed Hassan booking D60 for New Year
((SELECT id FROM yachts WHERE name = 'De Antonio D60' LIMIT 1), 
 (SELECT id FROM users WHERE email = 'mohamed.hassan@nauttec.com' LIMIT 1),
 '2024-12-28 10:00:00', '2024-12-30 18:00:00', 10, 7500.00, 'confirmed'),
-- Sarah Ahmed booking D42 for Christmas
((SELECT id FROM yachts WHERE name = 'De Antonio D42' LIMIT 1),
 (SELECT id FROM users WHERE email = 'sarah.ahmed@nauttec.com' LIMIT 1), 
 '2024-12-24 09:00:00', '2024-12-26 17:00:00', 8, 5400.00, 'confirmed'),
-- Omar Ali booking D29 for weekend
((SELECT id FROM yachts WHERE name = 'De Antonio D29' LIMIT 1),
 (SELECT id FROM users WHERE email = 'omar.ali@nauttec.com' LIMIT 1),
 '2024-12-21 11:00:00', '2024-12-22 19:00:00', 6, 1800.00, 'pending'),
-- Fatima Mohamed booking D50 for special event
((SELECT id FROM yachts WHERE name = 'De Antonio D50' LIMIT 1),
 (SELECT id FROM users WHERE email = 'fatima.mohamed@nauttec.com' LIMIT 1),
 '2025-01-15 10:00:00', '2025-01-17 18:00:00', 12, 6600.00, 'confirmed');

-- 4. Insert Share Listings (marketplace offerings)
INSERT INTO share_listings ("yacht_id", "seller_id", "shares_count", "price_per_share", "total_value", status, "listing_date") VALUES
-- Mohamed selling 1 D60 share
((SELECT id FROM yachts WHERE name = 'De Antonio D60' LIMIT 1),
 (SELECT id FROM users WHERE email = 'mohamed.hassan@nauttec.com' LIMIT 1),
 1, 180000.00, 180000.00, 'active', NOW()),
-- Sarah selling 2 D32 shares
((SELECT id FROM yachts WHERE name = 'De Antonio D32' LIMIT 1),
 (SELECT id FROM users WHERE email = 'sarah.ahmed@nauttec.com' LIMIT 1),
 2, 50000.00, 100000.00, 'active', NOW()),
-- Ahmed selling 1 D42 share
((SELECT id FROM yachts WHERE name = 'De Antonio D42' LIMIT 1),
 (SELECT id FROM users WHERE email = 'ahmed.ibrahim@nauttec.com' LIMIT 1),
 1, 92000.00, 92000.00, 'active', NOW());

-- 5. Insert Fuel Wallet Transactions
INSERT INTO fuel_wallet_transactions ("user_id", amount, "transaction_type", description) VALUES
-- Top-ups
((SELECT id FROM users WHERE email = 'mohamed.hassan@nauttec.com' LIMIT 1), 500.00, 'top_up', 'Fuel wallet top-up via credit card'),
((SELECT id FROM users WHERE email = 'sarah.ahmed@nauttec.com' LIMIT 1), 300.00, 'top_up', 'Fuel wallet top-up via bank transfer'),
-- Usage
((SELECT id FROM users WHERE email = 'mohamed.hassan@nauttec.com' LIMIT 1), -150.00, 'usage', 'D60 fuel consumption - 3 day charter'),
((SELECT id FROM users WHERE email = 'sarah.ahmed@nauttec.com' LIMIT 1), -80.00, 'usage', 'D42 fuel consumption - weekend trip');

-- 6. Insert Messages (communication threads)
INSERT INTO messages ("sender_id", "receiver_id", subject, content, "is_read") VALUES
-- Owner to renter communication
((SELECT id FROM users WHERE email = 'mohamed.hassan@nauttec.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'omar.ali@nauttec.com' LIMIT 1),
 'Welcome to D29 Charter',
 'Hi Omar! Thank you for booking our D29. Here are some important details for your upcoming trip. The yacht is fully fueled and ready. Weather looks perfect for Saturday!',
 false),
-- Nauttec admin to user
((SELECT id FROM users WHERE email = 'ahmed.ibrahim@nauttec.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'fatima.mohamed@nauttec.com' LIMIT 1), 
 'Share Purchase Confirmation',
 'Congratulations! Your D50 share purchase has been approved. You now own 2 shares (1/4 ownership). Your usage allocation is 48 days per year.',
 true);

-- Update yacht ratings based on bookings
UPDATE yachts SET 
  rating = CASE 
    WHEN name = 'De Antonio D60' THEN 4.8
    WHEN name = 'De Antonio D50' THEN 4.9  
    WHEN name = 'De Antonio D42' THEN 4.7
    WHEN name = 'De Antonio D36' THEN 4.6
    WHEN name = 'De Antonio D32' THEN 4.5
    WHEN name = 'De Antonio D29' THEN 4.3
    ELSE rating
  END,
  review_count = CASE
    WHEN name = 'De Antonio D60' THEN 89
    WHEN name = 'De Antonio D50' THEN 67
    WHEN name = 'De Antonio D42' THEN 54
    WHEN name = 'De Antonio D36' THEN 43
    WHEN name = 'De Antonio D32' THEN 31
    WHEN name = 'De Antonio D29' THEN 28
    ELSE review_count
  END;

-- Set yacht owners (assign some yachts to users)
UPDATE yachts SET owner_id = (SELECT id FROM users WHERE email = 'mohamed.hassan@nauttec.com' LIMIT 1) 
WHERE name IN ('De Antonio D60', 'De Antonio D50');

UPDATE yachts SET owner_id = (SELECT id FROM users WHERE email = 'fatima.mohamed@nauttec.com' LIMIT 1)
WHERE name IN ('De Antonio D42', 'De Antonio D32');

-- Show final counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Yachts' as table_name, COUNT(*) as count FROM yachts  
UNION ALL
SELECT 'Bookings' as table_name, COUNT(*) as count FROM bookings
UNION ALL
SELECT 'Ownership Opportunities' as table_name, COUNT(*) as count FROM ownership_opportunities
UNION ALL
SELECT 'Share Listings' as table_name, COUNT(*) as count FROM share_listings
UNION ALL
SELECT 'Fuel Transactions' as table_name, COUNT(*) as count FROM fuel_wallet_transactions
UNION ALL
SELECT 'Messages' as table_name, COUNT(*) as count FROM messages;