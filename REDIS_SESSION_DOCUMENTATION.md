# Redis Session Management Documentation

## Overview
The automation-mock-service uses Redis for caching session data, transaction data, flow status, and API expectations. Data is stored in Redis using different key patterns for different types of data.

## Data Storage Patterns

### 1. Session Cache (SessionCacheService)
**Location:** `src/services/cache-services.ts:75-131`

**Key Pattern:** Direct session ID (e.g., `session-12345`)

**Data Structure (SessionCache):** `src/types/api-session-cache.ts:3-16`
```typescript
{
  transactionIds: string[];
  flowMap: Record<string, string | undefined>;
  npType: "BAP" | "BPP";
  domain: string;
  version: string;
  subscriberId?: string;
  subscriberUrl: string;
  usecaseId: string;
  env: "STAGING" | "PRE-PRODUCTION";
  flowConfigs: Record<string, Flow>;
}
```

**Operations:**
- `checkIfSessionExists(sessionId)` - Checks if session exists in Redis
- `loadSessionThatExists(sessionId)` - Loads session data from Redis
- `savedToCache(sessionId, data)` - Saves session data to Redis

### 2. Transaction Cache (TransactionCacheService)
**Location:** `src/services/cache-services.ts:6-73`

**Key Pattern:** `${transactionId}::${subscriberUrl}`

**Data Structure (TransactionCache):** `src/types/transaction-cache.ts:8-17`
```typescript
{
  sessionId?: string;
  flowId?: string;
  latestAction: string;
  latestTimestamp: string;
  type: "default" | "manual";
  subscriberType: "BAP" | "BPP";
  messageIds: string[];
  apiList: ApiData[];  // Contains action, payloadId, messageId, response, timestamp
}
```

**Operations:**
- `tryLoadTransaction(transactionId, subscriberUrl)` - Attempts to load transaction
- `checkIfTransactionExists(transSubKey)` - Checks if transaction exists
- `loadTransactionThatExists(transSubKey)` - Loads transaction data
- `createTransactionKey(transactionId, subscriberUrl)` - Creates composite key

### 3. Mock Session Data (MockSessionData)
**Location:** `src/services/data-services.ts`

**Key Pattern:** Direct transaction ID (e.g., `transaction-uuid`)

**Data Structure (SessionData):** `src/config/mock-config/TRV14/session-types.ts:1-60`
```typescript
{
  subscriber_url: string;
  transaction_id: string;
  message_id: string;
  last_action: string;
  bap_id: string;
  bap_uri: string;
  bpp_id: string;
  bpp_uri: string;
  // ... 50+ fields for order details, fulfillments, payments, etc.
}
```

**Storage Flow:**
1. **Initial Load/Create:** `src/services/data-services.ts:105-127`
   - `loadMockSessionData(transactionID, subscriber_url)` 
   - If key doesn't exist, creates new session from default template
   - If exists, loads from Redis

2. **Save/Update:** `src/services/data-services.ts:53-78, 80-103`
   - `saveData(action, payload, errorData)` - Saves after API actions
   - `saveDataForConfig(saveData, payload, errorData)` - Saves with custom config
   - Updates session fields using JSONPath expressions from save-data config
   - Stores back to Redis with transaction ID as key

### 4. Flow Status Cache
**Location:** `src/services/mock-flow-status-service.ts`

**Key Pattern:** `FLOW_STATUS_${transactionId}::${subscriberUrl}`

**Data Structure:**
```typescript
{
  status: "SUSPENDED" | "IDLE" | "WORKING";
  timestamp: Date;
}
```

**Operations:**
- `getFlowStatusService(transactionId, subscriberUrl)` - Gets flow status
- `setFlowStatusService(transactionId, subscriberUrl, status)` - Sets flow status
- `deleteFlowStatusService(transactionId, subscriberUrl)` - Deletes flow status

### 5. API Expectations Cache
**Location:** `src/services/api-expectation-service.ts`

**Key Pattern:** Direct subscriber URL (e.g., `https://example.com/subscriber`)

**Data Structure (SubscriberCache):** `src/types/api-session-cache.ts:18-27`
```typescript
{
  activeSessions: Expectation[];
}

// Expectation structure:
{
  sessionId: string;
  flowId: string;
  expectedAction?: string;
  expireAt: string;
}
```

**Operations:**
- `createExpectationService(subscriberUrl, flowId, sessionId, expectedAction)` - Creates expectation
- `deleteExpectationService(subscriberUrl, sessionId)` - Deletes expectation

## Data Flow Summary

### Session Creation Flow:
1. New session request comes with `session_id`, `flow_id`, `transaction_id`
2. SessionCacheService loads session configuration
3. TransactionCacheService creates transaction entry with composite key
4. MockSessionData initialized from default template or loaded from cache

### Data Update Flow:
1. API action received (e.g., `/on_search`, `/on_select`)
2. Transaction data loaded via `TransactionCacheService`
3. Session data loaded via `SessionCacheService`
4. Mock session data loaded/created via `loadMockSessionData()`
5. Data updated using JSONPath expressions from save-data configs
6. Updated data saved back to Redis with transaction ID as key

### Key Redis Operations:
- **RedisService.setKey(key, value)** - Stores data in Redis
- **RedisService.getKey(key)** - Retrieves data from Redis  
- **RedisService.keyExists(key)** - Checks if key exists
- **RedisService.deleteKey(key)** - Deletes key from Redis

## Important Notes:
1. **No action_id in cache keys** - While action data is stored within cached objects, action_id is never used as part of Redis cache keys
2. **Multiple cache layers** - System uses different caching patterns for different purposes (sessions, transactions, mock data)
3. **Transaction ID is primary key** - Most mock session data is stored directly under transaction ID
4. **Composite keys for transactions** - Transaction cache uses `transactionId::subscriberUrl` pattern for uniqueness

## Utility Functions
**Location:** `src/utils/redis.ts`
- `getFromCache(key, db)` - Generic cache retrieval with JSON parsing
- `setToCache(key, value, db)` - Generic cache storage with JSON stringification