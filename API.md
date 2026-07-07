# Rythu360 - Enterprise API Documentation

**Version:** 1.0.0  
**Last Updated:** 2024-01-25  
**API Base URL:** `https://api.rythu360.com/api`  
**Environment:** Production

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Machinery](#machinery-endpoints)
   - [Marketplace](#marketplace-endpoints)
   - [Payments](#payments-endpoints)
   - [Wallet](#wallet-endpoints)
   - [Notifications](#notifications-endpoints)
   - [User Profile](#user-profile-endpoints)
   - [CRM & Leads](#crm--leads-endpoints)
   - [Analytics](#analytics-endpoints)
7. [Webhooks](#webhooks)

---

## Overview

The Rythu360 API is a RESTful API that provides comprehensive endpoints for agricultural machinery booking, marketplace operations, wallet management, and user operations. The API is built with Next.js 16 and secured with Supabase authentication.

**Key Features:**
- Role-based access control (8 roles)
- Real-time data with Supabase Realtime
- Complete CRUD operations for all modules
- Paginated responses with metadata
- Comprehensive error handling
- Webhook support for payments and events

---

## Authentication

### JWT Token Authentication

All API endpoints (except public endpoints) require a valid JWT token in the `Authorization` header.

**Header Format:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Obtaining a Token:**
1. User registers/logs in via Supabase Auth
2. JWT token is returned in response
3. Include token in all subsequent requests

**Token Refresh:**
```bash
POST /api/auth/session
```

---

## Response Format

### Success Response

```json
{
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## Error Handling

### Standard HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Common Error Responses

```json
{
  "error": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```

```json
{
  "error": "Invalid request body",
  "details": {
    "amount": ["Amount must be positive"]
  }
}
```

---

## Rate Limiting

**Limits by Role:**
- Farmer: 1000 requests/hour
- Operator: 2000 requests/hour
- Admin: 5000 requests/hour
- Public: 100 requests/hour

**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

---

## API Endpoints

### Authentication Endpoints

#### Get Current Session
```
GET /auth/session
```

**Authentication:** Required (JWT)

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role_id": "uuid",
    "status": "active"
  }
}
```

**Status Codes:** 200, 401, 500

---

#### Refresh Session
```
POST /auth/session
```

**Authentication:** Required (JWT)

**Response:**
```json
{
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600,
    "token_type": "bearer"
  }
}
```

**Status Codes:** 200, 401, 500

---

#### Reset Password Request
```
POST /auth/reset-password
```

**Authentication:** Not Required

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset link sent to email",
  "email": "user@example.com"
}
```

**Status Codes:** 200, 400, 500

---

### Machinery Endpoints

#### List Machinery
```
GET /machinery?page=1&limit=20&category=harvester&search=John&sortBy=rating
```

**Authentication:** Not Required

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Results per page (default: 20) |
| category | string | Filter by category |
| search | string | Search by name or brand |
| sortBy | string | Sort by: created_at, rating, price |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Harvester Model X",
      "category_id": "uuid",
      "category": "Harvester",
      "brand": "ABC",
      "min_price": 5000,
      "max_price": 8000,
      "rating_avg": 4.5,
      "rating_count": 128,
      "availability": true,
      "operator_name": "John Doe",
      "operator_phone": "+91-9876543210",
      "location": "Hyderabad, Telangana"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

**Status Codes:** 200, 400, 500

---

#### Get Machinery Details
```
GET /machinery/{machineId}
```

**Authentication:** Not Required

**Response:**
```json
{
  "id": "uuid",
  "name": "Harvester Model X",
  "description": "High-capacity harvester",
  "category_id": "uuid",
  "category": "Harvester",
  "brand": "ABC",
  "model": "X-2024",
  "year": 2024,
  "capacity": "5 acres/hour",
  "min_price": 5000,
  "max_price": 8000,
  "unit": "per_acre",
  "rating_avg": 4.5,
  "rating_count": 128,
  "availability": true,
  "operator_id": "uuid",
  "operator_name": "John Doe",
  "operator_phone": "+91-9876543210",
  "location": "Hyderabad, Telangana",
  "images": [],
  "documents": [],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-25T00:00:00Z"
}
```

**Status Codes:** 200, 404, 500

---

#### Create Machinery Booking
```
POST /machinery/bookings
```

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "machine_id": "uuid",
  "start_date": "2024-02-01T09:00:00Z",
  "end_date": "2024-02-02T17:00:00Z",
  "delivery_location": "Farm Name, Village, District",
  "field_area": 5.5,
  "notes": "Urgent booking for harvesting"
}
```

**Response:**
```json
{
  "id": "uuid",
  "machine_id": "uuid",
  "farmer_id": "uuid",
  "start_date": "2024-02-01T09:00:00Z",
  "end_date": "2024-02-02T17:00:00Z",
  "delivery_location": "Farm Name, Village, District",
  "field_area": 5.5,
  "total_amount": 27500,
  "status": "pending",
  "created_at": "2024-01-25T10:00:00Z"
}
```

**Status Codes:** 201, 400, 401, 422, 500

---

#### Get Machinery Bookings
```
GET /machinery/bookings?page=1&limit=10&status=pending
```

**Authentication:** Required (JWT)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Results per page (default: 10) |
| status | string | Filter by status |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "machine_id": "uuid",
      "machine": {
        "name": "Harvester Model X",
        "brand": "ABC",
        "operator": {
          "name": "John Doe",
          "phone": "+91-9876543210",
          "location": "Hyderabad"
        }
      },
      "farmer_id": "uuid",
      "start_date": "2024-02-01T09:00:00Z",
      "end_date": "2024-02-02T17:00:00Z",
      "delivery_location": "Farm Name, Village, District",
      "field_area": 5.5,
      "total_amount": 27500,
      "status": "pending",
      "created_at": "2024-01-25T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Status Codes:** 200, 401, 500

---

#### Update Booking Status
```
PATCH /machinery/bookings/{bookingId}
```

**Authentication:** Required (JWT - Operator/Admin only)

**Request Body:**
```json
{
  "status": "approved",
  "notes": "Booking confirmed"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "approved",
  "updated_at": "2024-01-25T10:30:00Z"
}
```

**Status Codes:** 200, 400, 401, 403, 404, 500

---

#### GPS Tracking
```
POST /machinery/tracking
```

**Authentication:** Required (JWT - Operator only)

**Request Body:**
```json
{
  "booking_id": "uuid",
  "latitude": 17.3850,
  "longitude": 78.4867,
  "accuracy": 5,
  "speed": 25,
  "heading": 45
}
```

**Response:**
```json
{
  "id": "uuid",
  "booking_id": "uuid",
  "latitude": 17.3850,
  "longitude": 78.4867,
  "accuracy": 5,
  "speed": 25,
  "heading": 45,
  "timestamp": "2024-01-25T10:30:00Z"
}
```

**Status Codes:** 201, 400, 401, 500

---

### Marketplace Endpoints

#### List Products
```
GET /marketplace?page=1&limit=20&category=seeds&search=paddy&sortBy=rating
```

**Authentication:** Not Required

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Results per page (default: 20) |
| category | string | Filter by category |
| search | string | Search by name |
| sortBy | string | Sort by: created_at, rating, price |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Premium Hybrid Paddy Seeds",
      "description": "High-yielding hybrid seeds",
      "price": 850,
      "compare_at_price": 1200,
      "category_id": "uuid",
      "category": "Seeds",
      "sku": "SEEDS-001",
      "unit": "kg",
      "rating_avg": 4.5,
      "rating_count": 128,
      "seller_id": "uuid",
      "seller_name": "Green Valley Seeds",
      "seller_rating": 4.8,
      "is_featured": true,
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "pages": 25
  }
}
```

**Status Codes:** 200, 400, 500

---

#### Get Product Details
```
GET /marketplace/products/{productId}
```

**Authentication:** Not Required

**Response:**
```json
{
  "id": "uuid",
  "name": "Premium Hybrid Paddy Seeds",
  "description": "High-yielding hybrid seeds with excellent disease resistance",
  "short_description": "Best quality paddy seeds",
  "price": 850,
  "compare_at_price": 1200,
  "cost_price": null,
  "category_id": "uuid",
  "category": "Seeds",
  "sku": "SEEDS-001",
  "unit": "kg",
  "weight_grams": 500,
  "rating_avg": 4.5,
  "rating_count": 128,
  "seller_id": "uuid",
  "seller_name": "Green Valley Seeds",
  "seller_rating": 4.8,
  "seller_reviews": 2345,
  "is_featured": true,
  "tags": ["organic", "certified", "fast-growing"],
  "images": [],
  "documents": [],
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-25T00:00:00Z"
}
```

**Status Codes:** 200, 404, 500

---

#### Create Order
```
POST /marketplace/orders
```

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "product_id": "uuid",
  "quantity": 10,
  "delivery_address": "123, Farm Road, Village, District, State, PIN",
  "phone": "+91-9876543210"
}
```

**Response:**
```json
{
  "id": "uuid",
  "order_number": "ORD-2024-001",
  "product_id": "uuid",
  "buyer_id": "uuid",
  "quantity": 10,
  "unit_price": 850,
  "subtotal": 8500,
  "tax_amount": 425,
  "shipping_amount": 150,
  "total_amount": 9075,
  "order_status": "pending",
  "delivery_address": "123, Farm Road, Village, District, State, PIN",
  "phone": "+91-9876543210",
  "placed_at": "2024-01-25T10:00:00Z"
}
```

**Status Codes:** 201, 400, 401, 422, 500

---

#### Get Orders
```
GET /marketplace/orders?page=1&limit=10&status=delivered
```

**Authentication:** Required (JWT)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Results per page (default: 10) |
| status | string | Filter by status |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "order_number": "ORD-2024-001",
      "product_id": "uuid",
      "product": {
        "name": "Premium Hybrid Paddy Seeds",
        "price": 850,
        "seller": {
          "id": "uuid",
          "name": "Green Valley Seeds"
        }
      },
      "buyer_id": "uuid",
      "quantity": 10,
      "unit_price": 850,
      "subtotal": 8500,
      "tax_amount": 425,
      "shipping_amount": 150,
      "total_amount": 9075,
      "order_status": "delivered",
      "delivery_address": "123, Farm Road",
      "placed_at": "2024-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

**Status Codes:** 200, 401, 500

---

#### Add Product Review
```
POST /marketplace/reviews
```

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "product_id": "uuid",
  "rating": 5,
  "title": "Excellent quality seeds",
  "comment": "Got great yield this season. Highly recommend!"
}
```

**Response:**
```json
{
  "id": "uuid",
  "product_id": "uuid",
  "reviewer_id": "uuid",
  "rating": 5,
  "title": "Excellent quality seeds",
  "comment": "Got great yield this season. Highly recommend!",
  "helpful_count": 0,
  "unhelpful_count": 0,
  "created_at": "2024-01-25T10:00:00Z"
}
```

**Status Codes:** 201, 400, 401, 422, 500

---

#### Add to Wishlist
```
POST /marketplace/wishlist
```

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "product_id": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "added_at": "2024-01-25T10:00:00Z"
}
```

**Status Codes:** 201, 400, 401, 500

---

#### Remove from Wishlist
```
DELETE /marketplace/wishlist/{wishlistItemId}
```

**Authentication:** Required (JWT)

**Response:**
```json
{
  "message": "Item removed from wishlist"
}
```

**Status Codes:** 200, 401, 404, 500

---

### Payments Endpoints

#### Create Payment Order
```
POST /payments/create-order
```

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "amount": 5000,
  "description": "Wallet topup",
  "transaction_type": "wallet_topup",
  "reference_id": "optional-id"
}
```

**Response:**
```json
{
  "razorpay_order_id": "order_id",
  "amount": 500000,
  "currency": "INR",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "contact": "+91-9876543210"
  },
  "created_at": "2024-01-25T10:00:00Z"
}
```

**Status Codes:** 201, 400, 401, 500

---

#### Verify Payment
```
POST /payments/verify
```

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

**Response:**
```json
{
  "status": "success",
  "transaction_id": "uuid",
  "amount": 5000,
  "currency": "INR",
  "message": "Payment verified and wallet credited"
}
```

**Status Codes:** 200, 400, 401, 500

---

#### Payment Webhook
```
POST /payments/webhook
```

**Authentication:** Required (Razorpay signature verification)

**Webhook Events:**
- `payment.authorized`
- `payment.captured`
- `payment.failed`
- `payment.refunded`
- `subscription.charged`
- `invoice.paid`

**Payload Example:**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxxxx",
        "entity": "payment",
        "amount": 500000,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_xxxxx",
        "invoice_id": null,
        "international": false,
        "method": "netbanking",
        "amount_refunded": 0,
        "refund_status": null,
        "captured": true,
        "notes": {},
        "fee": 11800,
        "tax": 1800,
        "skip_notification": false,
        "created_at": 1672041600
      }
    }
  }
}
```

**Status Codes:** 200, 400, 500

---

### Wallet Endpoints

#### Get Wallet Overview
```
GET /wallet
```

**Authentication:** Required (JWT)

**Response:**
```json
{
  "user_id": "uuid",
  "wallet_id": "uuid",
  "balance": 25000,
  "currency": "INR",
  "total_credited": 50000,
  "total_debited": 25000,
  "last_transaction_date": "2024-01-25T10:00:00Z",
  "transaction_count": 42,
  "pending_balance": 0,
  "reserved_balance": 0
}
```

**Status Codes:** 200, 401, 404, 500

---

#### Get Transactions
```
GET /wallet/transactions?page=1&limit=20&type=credit&startDate=2024-01-01&endDate=2024-01-31
```

**Authentication:** Required (JWT)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Results per page (default: 20) |
| type | string | Filter by type: credit, debit |
| startDate | date | Start date (YYYY-MM-DD) |
| endDate | date | End date (YYYY-MM-DD) |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "wallet_id": "uuid",
      "amount": 5000,
      "transaction_type": "credit",
      "category": "wallet_topup",
      "description": "Wallet topup via payment",
      "reference_id": "pay_xxxxx",
      "status": "completed",
      "balance_before": 20000,
      "balance_after": 25000,
      "created_at": "2024-01-25T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "pages": 3
  }
}
```

**Status Codes:** 200, 401, 500

---

#### Create Transaction
```
POST /wallet/transactions
```

**Authentication:** Required (JWT - Admin only)

**Request Body:**
```json
{
  "amount": 5000,
  "transaction_type": "credit",
  "category": "bonus_credit",
  "description": "Seasonal bonus"
}
```

**Response:**
```json
{
  "id": "uuid",
  "wallet_id": "uuid",
  "amount": 5000,
  "transaction_type": "credit",
  "category": "bonus_credit",
  "description": "Seasonal bonus",
  "status": "completed",
  "balance_after": 30000,
  "created_at": "2024-01-25T10:00:00Z"
}
```

**Status Codes:** 201, 400, 401, 403, 500

---

### Notifications Endpoints

#### Get Notifications
```
GET /notifications?page=1&limit=20&status=all
```

**Authentication:** Required (JWT)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Results per page (default: 20) |
| status | string | Filter: all, read, unread |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Booking Confirmed",
      "message": "Your machinery booking for Jan 25 has been confirmed",
      "type": "booking_confirmed",
      "status": "unread",
      "action_url": "/bookings/uuid",
      "created_at": "2024-01-25T10:00:00Z"
    }
  ],
  "unreadCount": 5,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 127,
    "pages": 7
  }
}
```

**Status Codes:** 200, 401, 500

---

### User Profile Endpoints

#### Get Farmer Profile
```
GET /profile/farmer
```

**Authentication:** Required (JWT)

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "full_name": "Farmer Name",
  "phone": "+91-9876543210",
  "location": "Village, District, State",
  "district": "Medchal",
  "state": "Telangana",
  "latitude": 17.3850,
  "longitude": 78.4867,
  "farm_size": 10.5,
  "crops_grown": ["paddy", "cotton", "sugarcane"],
  "kyc_status": "verified",
  "kyc_documents": [
    {
      "document_type": "aadhaar",
      "document_url": "https://...",
      "verified": true
    }
  ],
  "lands": [
    {
      "id": "uuid",
      "survey_number": "123-A",
      "area_acres": 5.5,
      "location": "Village Name"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:** 200, 401, 404, 500

---

#### Update Farmer Profile
```
PUT /profile/farmer
```

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "full_name": "Updated Name",
  "phone": "+91-9876543210",
  "farm_size": 12.5,
  "crops_grown": ["paddy", "cotton"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "full_name": "Updated Name",
  "phone": "+91-9876543210",
  "farm_size": 12.5,
  "crops_grown": ["paddy", "cotton"],
  "updated_at": "2024-01-25T10:00:00Z"
}
```

**Status Codes:** 200, 400, 401, 422, 500

---

#### Get Operator Profile
```
GET /profile/operator
```

**Authentication:** Required (JWT)

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "full_name": "Operator Name",
  "phone": "+91-9876543210",
  "location": "Village, District, State",
  "experience_years": 5,
  "license_number": "DL123456",
  "license_expiry": "2025-12-31",
  "documents": [
    {
      "document_type": "driving_license",
      "document_url": "https://...",
      "verified": true
    }
  ],
  "machines_operated": ["harvester", "thrasher", "tiller"],
  "rating_avg": 4.8,
  "rating_count": 156,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:** 200, 401, 404, 500

---

### CRM & Leads Endpoints

#### Get Leads
```
GET /crm/leads?page=1&limit=20&status=new&assigned_to=uuid
```

**Authentication:** Required (JWT)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Results per page (default: 20) |
| status | string | Filter by status |
| assigned_to | string | Filter by assigned user |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "lead_id": "LEAD-001",
      "farmer_name": "John Farmer",
      "phone_number": "+91-9876543210",
      "location": "Hyderabad, Telangana",
      "interested_in": "machinery_booking",
      "status": "new",
      "assigned_to": "uuid",
      "assigned_to_name": "Telecaller Name",
      "notes": "Interested in harvester rental",
      "source": "web",
      "created_at": "2024-01-25T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

**Status Codes:** 200, 401, 500

---

### Analytics Endpoints

#### Get Dashboard Metrics
```
GET /analytics/dashboard?startDate=2024-01-01&endDate=2024-01-31
```

**Authentication:** Required (JWT - Admin/Founder)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | date | Start date (YYYY-MM-DD) |
| endDate | date | End date (YYYY-MM-DD) |

**Response:**
```json
{
  "total_users": 5234,
  "active_users_today": 456,
  "total_bookings": 1245,
  "completed_bookings": 1100,
  "pending_bookings": 145,
  "total_marketplace_orders": 2890,
  "total_revenue": 8750000,
  "total_wallet_transactions": 2341,
  "by_role": {
    "farmer": 3450,
    "operator": 890,
    "admin": 45,
    "telecaller": 67
  },
  "revenue_by_source": {
    "machinery_booking": 5000000,
    "marketplace": 3000000,
    "services": 750000
  }
}
```

**Status Codes:** 200, 401, 403, 500

---

## Webhooks

### Razorpay Webhooks

Razorpay sends events to: `https://api.rythu360.com/api/payments/webhook`

**Supported Events:**
- `payment.authorized` - Payment authorized
- `payment.captured` - Payment captured and credited
- `payment.failed` - Payment failed
- `payment.refunded` - Payment refunded
- `subscription.charged` - Subscription charged
- `invoice.paid` - Invoice paid

**Signature Verification:**
All webhooks are signed with Razorpay webhook secret. Verify signature before processing:

```javascript
const crypto = require('crypto');

function verifySignature(body, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  return expectedSignature === signature;
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.rythu360.com/api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});

// Get machinery
const { data } = await api.get('/machinery', {
  params: { page: 1, limit: 20 }
});

// Create booking
const booking = await api.post('/machinery/bookings', {
  machine_id: 'uuid',
  start_date: '2024-02-01T09:00:00Z',
  end_date: '2024-02-02T17:00:00Z',
  delivery_location: 'Farm Name',
  field_area: 5.5
});
```

### Python

```python
import requests

API_URL = 'https://api.rythu360.com/api'
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Get machinery
response = requests.get(
    f'{API_URL}/machinery',
    headers=headers,
    params={'page': 1, 'limit': 20}
)
machinery = response.json()

# Create booking
booking = requests.post(
    f'{API_URL}/machinery/bookings',
    headers=headers,
    json={
        'machine_id': 'uuid',
        'start_date': '2024-02-01T09:00:00Z',
        'end_date': '2024-02-02T17:00:00Z',
        'delivery_location': 'Farm Name',
        'field_area': 5.5
    }
)
```

---

## Best Practices

1. **Always validate input** before sending to API
2. **Use pagination** for large datasets (limit max 100)
3. **Implement exponential backoff** for rate limit errors
4. **Cache responses** when possible using ETags
5. **Use webhooks** instead of polling
6. **Log all errors** with timestamps and request IDs
7. **Keep API keys secure** - never commit to version control
8. **Test on staging** before production
9. **Monitor API health** with uptime checks
10. **Document custom integrations** for your team

---

## Support

**Documentation:** https://docs.rythu360.com  
**Status Page:** https://status.rythu360.com  
**Email Support:** api-support@rythu360.com  
**Emergency Hotline:** +91-XXXX-XXXX  
**Slack Community:** https://community.rythu360.com

---

**Last Updated:** 2024-01-25  
**API Version:** 1.0.0  
**Changelog:** See CHANGELOG.md
