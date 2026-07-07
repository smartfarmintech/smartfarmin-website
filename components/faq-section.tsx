"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

const faqCategories = [
  {
    category: "General",
    faqs: [
      {
        q: "What is Rythu360?",
        a: "Rythu360 is a comprehensive agricultural technology platform by SmartFarmin Technologies that empowers every farmer with digital tools for crop management, machinery access, drone services, marketplace selling, and AI-powered recommendations.",
      },
      {
        q: "Why should I use Rythu360?",
        a: "Rythu360 simplifies farming by providing access to machinery rentals, drone services, real-time market prices, weather forecasts, AI crop monitoring, government schemes, and direct buyer connections—all in one app.",
      },
      {
        q: "Who can join Rythu360?",
        a: "Farmers, machinery operators, drone pilots, marketplace sellers, field agents, telecallers, dealers, crop buyers, and agricultural experts can all join and benefit from our platform.",
      },
      {
        q: "Is Rythu360 free?",
        a: "Farmers get free access to core features like weather, market prices, AI advisory, and government schemes. Optional premium features and services have nominal charges.",
      },
      {
        q: "Which states are supported?",
        a: "Rythu360 currently operates across major agricultural states including Maharashtra, Karnataka, Andhra Pradesh, Telangana, Tamil Nadu, and more. We are expanding to additional states regularly.",
      },
      {
        q: "Which languages are available?",
        a: "We support 12+ Indian regional languages including Hindi, Tamil, Telugu, Kannada, Marathi, Gujarati, Punjabi, Bengali, and English for complete accessibility.",
      },
      {
        q: "How do I register on Rythu360?",
        a: "Download the Rythu360 app, click 'Sign Up', enter your phone number to receive an OTP, verify it, select your role (Farmer, Operator, etc.), and complete basic profile details.",
      },
      {
        q: "What is the KYC process?",
        a: "KYC verification requires your Aadhar card details and a selfie for identity confirmation. This takes 24-48 hours. Full verification unlocks premium features like machinery booking and marketplace selling.",
      },
    ],
  },
  {
    category: "Farmers",
    faqs: [
      {
        q: "How do I register my farm?",
        a: "In the app, navigate to 'My Farms', click 'Add Farm', enter farm name, select location, add farm size, and specify primary crops. You can add multiple farms.",
      },
      {
        q: "Can I track multiple crops on one farm?",
        a: "Yes! You can track unlimited crops on each farm. For each crop, log planting date, variety, expected harvest, and receive personalized recommendations.",
      },
      {
        q: "How do I book machinery for my farm?",
        a: "Go to 'Machinery Booking', select your farm, choose equipment needed, confirm your farm size and hours/days, and get instant pricing. Booking is confirmed within 2-4 hours.",
      },
      {
        q: "How do I get weather updates for my farm?",
        a: "Enable location access in settings. The app automatically sends daily weather forecasts for your farm area including temperature, rainfall, wind speed, and humidity.",
      },
      {
        q: "What does the AI Crop Doctor provide?",
        a: "Upload a crop image, and AI Crop Doctor analyzes it for diseases, pests, or nutrient deficiencies within seconds, providing treatment recommendations and estimated costs.",
      },
      {
        q: "How do I apply for government schemes?",
        a: "Go to 'Government Schemes', browse available schemes for your state and crop type, review eligibility criteria, and apply directly through the app with required documents.",
      },
      {
        q: "What soil information can I access?",
        a: "Soil reports include pH level, fertility status, organic matter content, and nutrient levels. Upload soil test results or order tests through our partner labs.",
      },
      {
        q: "How do I use the marketplace as a farmer?",
        a: "List your produce with photos, weight, quality grade, and expected harvest date. Connect directly with verified buyers. We handle logistics and payment collection.",
      },
      {
        q: "Can I track my orders?",
        a: "Yes, in 'My Orders', you can see real-time delivery status, driver location (live GPS), estimated delivery time, and communicate directly with buyers and delivery partners.",
      },
      {
        q: "How do I get paid?",
        a: "After successful delivery and buyer confirmation, payment is transferred to your registered wallet or bank account within 24-48 hours. Zero deduction for farmers.",
      },
    ],
  },
  {
    category: "Machinery Booking",
    faqs: [
      {
        q: "What is the machinery booking workflow?",
        a: "Select machinery type, enter farm details and required hours/days, get instant pricing, confirm booking, meet the operator at scheduled time, use machinery, and rate the service post-completion.",
      },
      {
        q: "How is machinery pricing calculated?",
        a: "Pricing depends on machinery type (tractor, harvester, sprayer, etc.), hire duration (hourly/daily/seasonal), your farm size, current demand, and distance from operator's location.",
      },
      {
        q: "What are hourly, daily, and seasonal rates?",
        a: "Hourly rates apply for 1-4 hours of use. Daily rates apply for 4-12 hours in a single day. Seasonal rates offer discounts for 20+ days of continuous or spread usage.",
      },
      {
        q: "Can I cancel or reschedule a booking?",
        a: "Free cancellation up to 4 hours before scheduled time. Rescheduling is available up to 24 hours in advance. Late cancellations may incur 10-20% charges.",
      },
      {
        q: "How is the operator assigned?",
        a: "Once you confirm booking, our system automatically assigns the nearest available operator with good ratings. The operator receives a notification and confirms within 30 minutes.",
      },
      {
        q: "Is live tracking available?",
        a: "Yes! Once the operator confirms, you get real-time GPS tracking of the machinery and operator. You can communicate directly via in-app chat or phone.",
      },
      {
        q: "How do I know when the work is complete?",
        a: "The operator marks work complete in the app with photos/videos as proof. You verify completion, confirm hours worked, and rate the service before final payment.",
      },
      {
        q: "How are ratings and reviews handled?",
        a: "Both farmers and operators can rate each other on a 5-star scale with optional comments. Ratings build reputation and affect future booking eligibility.",
      },
      {
        q: "What documents do I receive?",
        a: "An automated invoice is generated showing machinery type, hours/days, rate, total cost, GST, and payment details. Available for download from 'My Orders'.",
      },
    ],
  },
  {
    category: "Drone Services",
    faqs: [
      {
        q: "What drone services are available?",
        a: "Rythu360 offers crop spraying, field mapping, pest/disease monitoring, yield prediction, and multispectral surveys using licensed drone operators.",
      },
      {
        q: "How do I book a drone service?",
        a: "Go to 'Drone Services', select your service type, mark your farm boundaries on the map, confirm acreage, choose preferred date, and get an instant quote.",
      },
      {
        q: "How is drone pricing calculated?",
        a: "Pricing is based on acreage, service type (spraying costs more than mapping), chemical/fertilizer costs, travel distance from operator's base, and current demand.",
      },
      {
        q: "What is field mapping?",
        a: "Drone creates a high-resolution orthomosaic map of your field showing topography, vegetation health (NDVI), and problem areas. Useful for precision farming and yield prediction.",
      },
      {
        q: "How does crop monitoring work?",
        a: "Drones capture multispectral images revealing crop health, nutrient deficiencies, pest hotspots, and water stress areas. Reports include recommendations for targeted interventions.",
      },
      {
        q: "Is drone spraying safe for my crops?",
        a: "Yes! All our drone operators are licensed and trained. Drones spray 80% less chemical than traditional methods, improving crop safety and environment protection.",
      },
      {
        q: "What data do I receive after a drone service?",
        a: "You get detailed reports with aerial imagery, health maps, problem areas highlighted, and expert recommendations. Downloadable PDFs are sent within 24 hours.",
      },
      {
        q: "Can I cancel a drone booking?",
        a: "Free cancellation up to 48 hours before service date. Cancellations within 48 hours may incur 25-50% charges depending on weather and operator travel.",
      },
    ],
  },
  {
    category: "Marketplace",
    faqs: [
      {
        q: "How do I sell my produce on the marketplace?",
        a: "Go to 'Sell', click 'List Produce', add photos (minimum 3), specify quantity, quality grade, price, and expected harvest date. Listings go live immediately.",
      },
      {
        q: "What quality grades are accepted?",
        a: "Premium (A-Grade), Standard (B-Grade), and Bulk (for processors). Quality guidelines vary by produce type. Clear guidelines help maintain buyer trust.",
      },
      {
        q: "Can I set my own prices?",
        a: "Yes! You have full control over pricing. Check 'Market Prices' for current rates in your district to price competitively. You can update prices anytime.",
      },
      {
        q: "How do buyers find my produce?",
        a: "Buyers search by crop type, quality grade, location, and price. Your listings appear in relevant searches. Premium sellers with good ratings get higher visibility.",
      },
      {
        q: "How do I manage orders?",
        a: "All orders appear in 'My Orders'. Confirm order details, schedule pickup/delivery with the buyer or delivery partner, track status, and get payment after delivery confirmation.",
      },
      {
        q: "What if a buyer disputes the quality?",
        a: "Report disputes in the app with photos/videos. Our quality team reviews evidence from both sides. If quality is confirmed inadequate, we issue refunds and manage return shipping.",
      },
      {
        q: "How quickly do I get paid?",
        a: "After buyer confirms delivery and quality, payment is transferred to your registered wallet or bank account within 24-48 hours. Transaction history is available anytime.",
      },
      {
        q: "Are there any seller fees?",
        a: "No transaction fees for individual farmers. Optional 'Premium Seller' program costs ₹499/month with benefits like priority listing, analytics dashboard, and customer support.",
      },
      {
        q: "Can I buy produce on the marketplace?",
        a: "Yes! Browse 'Buy' section to purchase inputs (seeds, fertilizers, pesticides) from verified dealers, or buy fresh produce from other farmers.",
      },
      {
        q: "What is the return policy?",
        a: "Buyers can request returns within 24 hours of delivery if quality doesn't match listing. Refunds are processed within 2-3 days after return verification.",
      },
    ],
  },
  {
    category: "Wallet & Payments",
    faqs: [
      {
        q: "What is the Rythu360 Wallet?",
        a: "A digital wallet to securely store money for bookings, purchases, and receiving payments from sales. Balance never expires and can be transferred to your bank anytime.",
      },
      {
        q: "How do I add money to my wallet?",
        a: "Go to 'Wallet', click 'Add Money', choose amount, and select payment method: UPI, debit card, credit card, or net banking. Money is added instantly.",
      },
      {
        q: "Which payment methods are accepted?",
        a: "We accept UPI (BHIM, Google Pay, PhonePe), debit cards, credit cards, net banking, and direct bank transfers. All payments are encrypted and PCI-DSS compliant.",
      },
      {
        q: "How do I withdraw money from my wallet?",
        a: "Go to 'Wallet', click 'Withdraw', enter amount, confirm your bank account, and submit. Withdrawal is processed within 24-48 hours to your bank account.",
      },
      {
        q: "Is there a minimum withdrawal amount?",
        a: "Minimum withdrawal is ₹100. No maximum limit. Direct bank transfers are free for all users with no processing charges.",
      },
      {
        q: "How are payments secured?",
        a: "All transactions use 256-bit SSL encryption, PCI-DSS Level 1 compliance, and Razorpay's secure gateway. Your bank details are never stored on our servers.",
      },
      {
        q: "What is a transaction invoice?",
        a: "Invoices are automatically generated for all transactions (bookings, purchases, sales). Accessible in 'Transaction History' as downloadable PDFs for GST and record-keeping.",
      },
      {
        q: "How do refunds work?",
        a: "If a booking is cancelled or order is returned, refunds are processed to your original payment method within 3-5 business days. Wallet refunds are instant.",
      },
      {
        q: "What is the daily transaction limit?",
        a: "There's no daily limit for wallet balance. For individual transactions, limits depend on your bank and payment method. Verified users have no restrictions.",
      },
    ],
  },
  {
    category: "Telecaller CRM",
    faqs: [
      {
        q: "How does the telecaller lead system work?",
        a: "Telecallers are assigned farmers based on district and language. In the CRM dashboard, they see assigned leads with contact details, farm info, and previous interactions.",
      },
      {
        q: "How are leads assigned?",
        a: "Leads are automatically assigned based on telecaller's geography, language skills, and current workload. High-performing telecallers get prioritized assignments.",
      },
      {
        q: "What is farmer onboarding?",
        a: "Telecallers guide new farmers through app features, help with profile setup, explain services, and convert them into active users through personalized support.",
      },
      {
        q: "How do I track follow-ups?",
        a: "The CRM has automated follow-up reminders. Set notes on each lead, schedule next contact date, and track conversion rates through the analytics dashboard.",
      },
      {
        q: "How are performance metrics calculated?",
        a: "Metrics include leads contacted, conversion rate, average handling time, customer satisfaction rating, and onboarded farmers. Weekly reports help identify top performers.",
      },
      {
        q: "Can I run campaigns?",
        a: "Yes! Create targeted campaigns by geography, crop type, or service. SMS and push notifications can be sent to specific farmer groups with campaign tracking.",
      },
    ],
  },
  {
    category: "Field Agents",
    faqs: [
      {
        q: "What are field agent responsibilities?",
        a: "Field agents conduct farmer surveys, verify farm details, capture GPS locations, take field photos, document soil information, and submit reports through the app.",
      },
      {
        q: "How does GPS tracking work?",
        a: "Your GPS location is automatically recorded when you clock in. Field managers can see your live location during working hours for security and performance tracking.",
      },
      {
        q: "How do I mark attendance?",
        a: "Clock in at the start of your shift and clock out at the end using the app. Location is automatically recorded. Attendance affects daily wages and bonuses.",
      },
      {
        q: "How do I submit surveys?",
        a: "Open assigned surveys in the app, fill in farm and farmer details, attach GPS location, upload field photos, and mark complete. Submissions are saved locally and sync online.",
      },
      {
        q: "Can I work offline?",
        a: "Yes! All field agent features work offline. Data syncs automatically when you reconnect to internet. This ensures uninterrupted fieldwork.",
      },
      {
        q: "What villages am I assigned to?",
        a: "Go to 'My Assignment' to see your assigned villages. Assignments are based on your location and capacity. You can request additional villages if interested.",
      },
      {
        q: "How are earnings calculated?",
        a: "Field agents earn daily wages (typically ₹600-₹800/day) plus incentives for surveys completed and farmers onboarded. Bonuses apply for high-quality data.",
      },
    ],
  },
  {
    category: "Machinery Operators",
    faqs: [
      {
        q: "How do I register as a machinery operator?",
        a: "Complete KYC with Aadhar, upload vehicle registration and insurance documents, add photos of your machinery, specify hourly/daily rates, and set service areas.",
      },
      {
        q: "What documents are required?",
        a: "Aadhar card, PAN, bank account details, vehicle registration, insurance certificate, driving license, and machinery photos. Verification takes 2-3 days.",
      },
      {
        q: "How do I set my availability?",
        a: "In the 'Availability' section, mark dates and time slots you're available. Disable dates when machinery is under maintenance or unavailable.",
      },
      {
        q: "How are bookings assigned to me?",
        a: "When a farmer books, our system matches them with the nearest available operator. You receive a notification, confirm within 30 minutes, or pass the booking.",
      },
      {
        q: "How do I track my earnings?",
        a: "Go to 'Earnings' to see daily income, monthly totals, and pending payments. Detailed breakdown shows each booking amount and deductions if any.",
      },
      {
        q: "When do I get paid?",
        a: "Payments are processed every Friday for bookings completed in the previous week. Money is transferred to your registered bank account automatically.",
      },
      {
        q: "Can I see my ratings?",
        a: "Yes! Your profile shows average rating (out of 5 stars), total reviews, and detailed feedback from farmers. High ratings increase booking frequency.",
      },
      {
        q: "How much can I earn monthly?",
        a: "₹40,000–₹2,00,000+/month depending on machinery type (tractors earn more than sprayers), utilization rate, region demand, and booking frequency. Actual earnings vary seasonally.",
      },
      {
        q: "What if a farmer cancels last-minute?",
        a: "Cancellations within 4 hours of scheduled time incur operator compensation (₹200-₹500 depending on machinery type). This protects your income.",
      },
    ],
  },
  {
    category: "Drone Operators",
    faqs: [
      {
        q: "What are the requirements to register as a drone operator?",
        a: "You need DGCA drone pilot license, aircraft airworthiness certificate, valid Aadhar, insurance (₹1 crore minimum recommended), and liability documentation.",
      },
      {
        q: "How do I verify my drone license?",
        a: "Upload your DGCA certificate during registration. Our team verifies with DGCA database. Verification takes 3-5 business days. License must be current and valid.",
      },
      {
        q: "How are drone bookings assigned?",
        a: "Farmers searching for drone services see available operators sorted by ratings, distance, and availability. You receive booking requests and can accept or decline.",
      },
      {
        q: "How is drone service pricing determined?",
        a: "You set base rates per acre. Platform applies multipliers based on service complexity, travel distance, weather, and current demand. You always earn the agreed rate.",
      },
      {
        q: "What is the earning potential for drone operators?",
        a: "₹60,000–₹3,50,000+/month depending on acreage covered monthly, spraying demand, equipment type, contracts, and region. Peak seasons (monsoon) generate higher earnings.",
      },
      {
        q: "How do I get paid?",
        a: "Payments are transferred to your wallet after each completed service. You can withdraw to bank account anytime. Weekly summaries show all transactions.",
      },
      {
        q: "Can I work multiple areas?",
        a: "Yes! You can set multiple service areas. Higher ratings and availability increase booking frequency across all regions.",
      },
      {
        q: "What happens if weather cancels my booking?",
        a: "If weather is unfavorable, either party can cancel without penalty. Safety is paramount. Rescheduling for the next suitable weather window is prioritized.",
      },
    ],
  },
  {
    category: "Fertilizer Dealers",
    faqs: [
      {
        q: "How do I register as a fertilizer dealer?",
        a: "Go to 'Become a Seller', choose 'Dealer/Retailer', complete KYC, upload shop/warehouse license, add product inventory, set pricing, and await approval (1-2 days).",
      },
      {
        q: "How do I list products?",
        a: "In 'Inventory', add product name, quantity, unit (kg/bag), price per unit, expiry date, and relevant certifications. Products go live immediately after listing.",
      },
      {
        q: "How do farmers buy from me?",
        a: "Farmers browse marketplace, search for specific fertilizers, see your profile with ratings, compare prices, and place orders. You get instant notification of new orders.",
      },
      {
        q: "How do I manage inventory?",
        a: "'Stock Management' shows current inventory, orders received, items sold, and reorder levels. Automatic alerts when stock is low to help you plan restocking.",
      },
      {
        q: "How do I handle delivery?",
        a: "You can self-deliver for nearby customers or use Rythu360's delivery network. Delivery cost is shared or can be added to product price.",
      },
      {
        q: "What are dealer earnings?",
        a: "Income depends on product sales volume, margins per product, order frequency, and customer ratings. No platform commission for dealers.",
      },
      {
        q: "Can I offer credit to regular customers?",
        a: "Yes! You can set credit terms for verified regular buyers. The platform tracks receivables and helps with payment collection through automated reminders.",
      },
    ],
  },
  {
    category: "Organic Store Sellers",
    faqs: [
      {
        q: "How do I register an organic store?",
        a: "Go to 'Sell', choose 'Organic Store', upload organic certification, complete KYC, add your products with certification details, and get approval within 24 hours.",
      },
      {
        q: "What products can I sell?",
        a: "Certified organic produce (vegetables, fruits), spices, grains, dairy, honey, and processed goods. Products must have valid organic certifications.",
      },
      {
        q: "How do I maintain organic certification status?",
        a: "Keep certifications current and upload renewal documents quarterly. Failing to maintain certification will remove store from organic category.",
      },
      {
        q: "How do I build customer trust?",
        a: "Provide detailed product descriptions, upload high-quality photos, include certification details, maintain consistent quality, and respond promptly to customer inquiries.",
      },
      {
        q: "What are typical organic store earnings?",
        a: "Income varies widely based on product range, pricing, customer loyalty, and marketing. Average stores earn ₹50,000-₹2,00,000+ monthly depending on demand.",
      },
    ],
  },
  {
    category: "Crop Buyers",
    faqs: [
      {
        q: "How do I register as a crop buyer?",
        a: "Go to 'Buy', complete business KYC with GST details, upload import/export license if applicable, add payment information, and set buying preferences.",
      },
      {
        q: "How do I find available crops?",
        a: "Use 'Browse Crops' to search by type, quality grade, location, and price. Set alerts for specific crops to get notifications when farmers list them.",
      },
      {
        q: "How do I place orders?",
        a: "View crop listings, confirm quantity needed, agree on price with the farmer, schedule pickup/delivery, and make payment through wallet or bank transfer.",
      },
      {
        q: "What quality grades are available?",
        a: "Premium (A-Grade): Perfect condition, processors: bulk available. Standard (B-Grade): Minor blemishes acceptable. All grades are verified by our team.",
      },
      {
        q: "Can I negotiate prices with farmers?",
        a: "Yes! Send offers to farmers with your proposed price and quantity. Farmers can accept, counter, or decline. Direct negotiation builds relationships.",
      },
      {
        q: "How is delivery managed?",
        a: "Choose between farmer pickup, buyer pickup, or Rythu360 delivery. All logistics are tracked with GPS and real-time updates until goods reach your facility.",
      },
      {
        q: "What if quality doesn't match listing?",
        a: "Document quality issues with photos/videos and report within 24 hours. Our quality team reviews and facilitates return or adjustment based on findings.",
      },
    ],
  },
  {
    category: "Delivery Partners",
    faqs: [
      {
        q: "How do I register as a delivery partner?",
        a: "Complete KYC with Aadhar, add vehicle details and insurance, upload driving license, and set your service areas. Verification takes 1-2 days.",
      },
      {
        q: "What vehicles can I use?",
        a: "Two-wheelers (scooters, motorcycles) for small packages, auto-rickshaws, tempo, or light commercial vehicles for bulk orders. Vehicle must be insured.",
      },
      {
        q: "How are deliveries assigned?",
        a: "You receive delivery orders based on your location and availability. Accept orders matching your capacity. Our system optimizes routes to maximize deliveries per shift.",
      },
      {
        q: "How do I track earnings?",
        a: "'Earnings' shows per-delivery rates, bonuses for on-time delivery, tips from customers, and daily/monthly totals. Detailed breakdown is available anytime.",
      },
      {
        q: "When do I get paid?",
        a: "Daily payments are processed every evening for completed deliveries. Money is added to your wallet instantly. Withdraw to bank anytime.",
      },
      {
        q: "What if a delivery is delayed?",
        a: "Track your orders in real-time. If delayed, inform the customer through in-app chat. Late delivery may result in small penalty, but emergency support is available.",
      },
    ],
  },
  {
    category: "Agriculture Experts",
    faqs: [
      {
        q: "How can agriculture experts contribute?",
        a: "Register as an expert with credentials (degree/certification in agriculture). Create advisory content, answer farmer queries, conduct workshops, and get paid for consultations.",
      },
      {
        q: "How much can I earn as an expert?",
        a: "Income comes from consultations (₹500-₹2,000 per session), content creation royalties, and workshop fees. Top experts earn ₹50,000-₹3,00,000+ monthly.",
      },
      {
        q: "Can I conduct group workshops?",
        a: "Yes! Schedule workshops on topics like crop management, soil health, or pest control. Farmers can register, and you earn fees plus content royalties.",
      },
      {
        q: "How do farmers book my consultations?",
        a: "Your profile appears in 'Expert Directory'. Farmers browse, read your credentials and reviews, and book consultations at your set rates.",
      },
    ],
  },
  {
    category: "Enterprise Customers",
    faqs: [
      {
        q: "What is the Enterprise plan?",
        a: "Custom solutions for agricultural companies offering fleet management, employee management, analytics dashboards, API integration, and dedicated account management.",
      },
      {
        q: "How is fleet management handled?",
        a: "Track all your vehicles/machinery in real-time, manage availability, assign to jobs, monitor usage, and generate reports. API integrates with your existing systems.",
      },
      {
        q: "What analytics are available?",
        a: "Comprehensive dashboards showing fleet utilization, operator performance, revenue by region, cost per service, and trends over time for data-driven decisions.",
      },
      {
        q: "Can I integrate with my systems?",
        a: "Yes! REST APIs allow integration with your CRM, accounting, or inventory systems. Dedicated API documentation and support team helps with implementation.",
      },
      {
        q: "How is pricing for enterprise plans?",
        a: "Custom pricing based on fleet size, user count, features needed, and support level. Contact enterprise@rythu360.com for quotes.",
      },
    ],
  },
  {
    category: "Government Services",
    faqs: [
      {
        q: "Which government schemes are available?",
        a: "Schemes include PM Kisan, crop insurance, subsidies on machinery, organic farming grants, and state-specific agricultural schemes. Eligibility varies by state and crop.",
      },
      {
        q: "How do I apply for schemes?",
        a: "Go to 'Government Schemes', filter by your state and crop, review eligibility criteria and required documents, and apply directly through the app with documents.",
      },
      {
        q: "What documents are needed?",
        a: "Typically: Aadhar card, land records, crop records, bank account details, and identity proof. Specific requirements vary by scheme. Detailed checklists are provided.",
      },
      {
        q: "How long is the approval process?",
        a: "Application processing takes 5-15 days depending on scheme complexity. You receive status updates via SMS and push notifications. Documents are securely stored.",
      },
      {
        q: "Can I track my scheme application?",
        a: "Yes! In 'My Applications', track status from submission to approval. You can see required documents, any requests for clarification, and expected disbursement date.",
      },
    ],
  },
  {
    category: "AI Crop Doctor",
    faqs: [
      {
        q: "How accurate is AI Crop Doctor?",
        a: "Trained on 10+ years of crop data with 85%+ accuracy. AI identifies diseases, pests, nutrient deficiencies, and provides personalized treatment recommendations.",
      },
      {
        q: "How do I use AI Crop Doctor?",
        a: "Go to 'AI Crop Doctor', take a clear photo of affected crop area in daylight, upload it, and AI analyzes within 5-10 seconds providing diagnosis and treatment options.",
      },
      {
        q: "What conditions can AI Crop Doctor detect?",
        a: "Common diseases (powdery mildew, leaf blight, rust), pests (aphids, beetles, caterpillars), nutrient deficiencies (nitrogen, phosphorus, potassium), and environmental stress.",
      },
      {
        q: "What treatment recommendations are provided?",
        a: "Recommendations include specific chemicals, dosages, application methods, cost estimates, and preventive measures. Links to marketplace for product purchases.",
      },
      {
        q: "Can I store crop history?",
        a: "Yes! All analysis results are saved in 'Crop History'. Track treatments applied, recovery status, and build a comprehensive health record for each crop.",
      },
      {
        q: "Is consultation with experts available?",
        a: "If AI is uncertain or you need expert confirmation, consult agriculture experts through in-app chat or book a video consultation at nominal cost.",
      },
    ],
  },
  {
    category: "Weather & Market Prices",
    faqs: [
      {
        q: "How accurate are weather forecasts?",
        a: "We use IMD data and advanced models for 10-day forecasts with 80%+ accuracy. Real-time weather alerts notify you of heavy rain, temperature extremes, or hail.",
      },
      {
        q: "How do I set weather alerts?",
        a: "Go to 'Settings' > 'Alerts', enable weather notifications, set thresholds (e.g., alert if rain >20mm), and choose notification timing (immediately or daily digest).",
      },
      {
        q: "How current are market prices?",
        a: "Market prices update every 2-4 hours from major agricultural markets (APMC, e-NAM, etc.). Prices reflect supply, demand, and seasonal trends.",
      },
      {
        q: "Can I compare prices across markets?",
        a: "Yes! Select your crop and see prices from nearby mandis and major markets. Identify best prices for selling and decide timing accordingly.",
      },
      {
        q: "How do I set price alerts?",
        a: "In 'Market Prices', set alerts for specific crops. Get notifications when prices rise/fall by your target percentage, helping optimize selling decisions.",
      },
      {
        q: "Is historical price data available?",
        a: "Yes! View 1-year historical trends showing seasonal patterns, peak prices, and low periods. Useful for planning crop cultivation and selling strategy.",
      },
    ],
  },
  {
    category: "Reports & Analytics",
    faqs: [
      {
        q: "What reports can I generate?",
        a: "Available reports include farm production reports, machinery utilization, marketplace sales, income statements, government scheme status, and crop health trends.",
      },
      {
        q: "Can I export reports?",
        a: "Yes! Export all reports as PDF or CSV. Reports include charts, tables, and detailed breakdowns suitable for bank loans, government submissions, or personal records.",
      },
      {
        q: "How often are reports updated?",
        a: "Data updates in real-time or daily depending on report type. Historical data is preserved, allowing comparison across months and years.",
      },
      {
        q: "Are reports useful for bank loans?",
        a: "Yes! Detailed production reports, income statements, and financial summaries are accepted by many banks for agricultural loan applications.",
      },
    ],
  },
  {
    category: "Security & Privacy",
    faqs: [
      {
        q: "How is my data secured?",
        a: "All data is encrypted with 256-bit SSL. Servers are in secure data centers with firewalls, intrusion detection, and daily backups. We comply with data protection laws.",
      },
      {
        q: "Who has access to my personal information?",
        a: "Only authorized Rythu360 staff with specific security clearance. Your data is never shared with third parties without explicit consent for specific services.",
      },
      {
        q: "How does two-factor authentication work?",
        a: "Enable 2FA in settings. Each login requires password + OTP sent to your phone. This prevents unauthorized access even if password is compromised.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes! Go to 'Settings' > 'Account', choose 'Delete Account', and confirm. Your data is deleted within 30 days. Transactions remain for audit purposes.",
      },
      {
        q: "Is my farm location private?",
        a: "Your exact farm location is visible only to you. When booking machinery or services, operators see approximate location (not exact coordinates) until they confirm.",
      },
      {
        q: "How are documents stored?",
        a: "All documents (Aadhar, certificates, invoices) are encrypted and stored securely. Access logs are maintained. Documents are never shared without your permission.",
      },
    ],
  },
  {
    category: "Support & Contact",
    faqs: [
      {
        q: "How do I contact support?",
        a: "In-app chat available 24/7 for instant support. Email: support@rythu360.com for detailed issues. Phone: Toll-free helpline during business hours (9 AM - 6 PM IST).",
      },
      {
        q: "What is the average response time?",
        a: "In-app chat: Within 5 minutes during peak hours, 30 minutes during off-peak. Email: 24-48 hours. Critical issues get priority with immediate escalation.",
      },
      {
        q: "Is multilingual support available?",
        a: "Yes! Support staff available in Hindi, Tamil, Telugu, Kannada, Marathi, Gujarati, and English. Select your language in the chat or email.",
      },
      {
        q: "How do I report a bug or issue?",
        a: "Go to 'Settings' > 'Report Issue', describe the problem with screenshots, and submit. You receive a ticket number for tracking and follow-ups.",
      },
      {
        q: "Can I suggest features?",
        a: "Absolutely! Go to 'Settings' > 'Suggest Feature', describe your idea, and vote on suggestions from other users. Popular features are prioritized for development.",
      },
      {
        q: "Is there a help center or FAQ?",
        a: "Yes! Our comprehensive help center is available in the app under 'Help'. Search for topics, browse guides, and watch video tutorials for common tasks.",
      },
    ],
  },
  {
    category: "Earnings & Income",
    faqs: [
      {
        q: "What are typical farmer earnings from marketplace sales?",
        a: "Income varies based on crop type, quality, market price, and sales volume. Farmers typically earn ₹50,000-₹5,00,000+ monthly depending on farm size and demand.",
      },
      {
        q: "Can machinery operators earn year-round?",
        a: "Yes, but earnings are seasonal. Peak season (June-Nov) offers 40-50% higher bookings. Annual average: ₹40,000–₹2,00,000+/month with proper strategy.",
      },
      {
        q: "What affects drone operator earnings?",
        a: "Acreage covered, spraying demand (monsoon peak), equipment efficiency, customer ratings, and region demand. Off-season requires marketing and customer retention focus.",
      },
      {
        q: "How much do telecallers earn?",
        a: "Telecallers earn ₹15,000–₹40,000+/month including base salary and performance incentives based on conversions, farmer onboarding, and customer satisfaction.",
      },
      {
        q: "What do field agents typically earn?",
        a: "₹18,000–₹50,000+/month with daily wages (₹600-₹800/day), survey incentives, onboarding bonuses, and attendance-based allowances.",
      },
      {
        q: "What is the earning disclaimer?",
        a: "Actual earnings vary significantly depending on service demand, location, pricing, customer ratings, platform activity, and seasonal agricultural requirements. Results are not guaranteed.",
      },
    ],
  },
]

export function FaqSection() {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0)
  const [openIdx, setOpenIdx] = useState<{ category: number; item: number } | null>(null)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to know about Rythu360 by SmartFarmin
          </p>
        </div>

        <div className="space-y-6">
          {faqCategories.map((categoryGroup, catIdx) => (
            <div key={catIdx} className="rounded-2xl border border-border/70 bg-card overflow-hidden">
              <button
                onClick={() => setExpandedCategory(expandedCategory === catIdx ? null : catIdx)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-bold text-lg text-foreground">{categoryGroup.category}</h3>
                <ChevronDown
                  className={`size-5 shrink-0 text-primary transition-transform duration-300 ${
                    expandedCategory === catIdx ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedCategory === catIdx && (
                <div className="border-t border-border/50 space-y-0">
                  {categoryGroup.faqs.map((faq, itemIdx) => {
                    const faqKey = { category: catIdx, item: itemIdx }
                    const isOpen = openIdx?.category === catIdx && openIdx?.item === itemIdx

                    return (
                      <div
                        key={itemIdx}
                        className={`border-b border-border/30 last:border-b-0 transition-colors ${
                          isOpen ? "bg-muted/30" : "hover:bg-muted/20"
                        }`}
                      >
                        <button
                          onClick={() => setOpenIdx(isOpen ? null : faqKey)}
                          className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-colors"
                        >
                          <h4 className="font-medium text-foreground pr-4 text-sm sm:text-base">
                            {faq.q}
                          </h4>
                          <ChevronDown
                            className={`size-4 shrink-0 text-primary transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="bg-muted/20 px-6 py-4 text-sm text-muted-foreground leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Earnings Disclaimer:</span> Actual earnings for operators, dealers, and sellers vary significantly depending on service demand, location, pricing, customer ratings, platform activity, and seasonal agricultural requirements. The figures mentioned are estimates based on platform averages and are not guarantees. Individual results may vary.
          </p>
        </div>
      </div>
    </section>
  )
}
