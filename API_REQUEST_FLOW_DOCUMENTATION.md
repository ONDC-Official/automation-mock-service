# API Request Flow Documentation

## How Mock Service Handles Incoming Requests from API Service

### 1. Entry Point
**Route:** `POST /mock/{domain}/manual/:action`  
**File:** `src/routes/manual.ts:30-60`

When a request arrives from the API service (e.g., `/on_search`, `/on_select`), it enters through the manual router.

### 2. Request Processing Pipeline

The request goes through a series of middleware functions in this order:

#### A. **OpenTelemetry Tracing** (`otelTracing`)
- Extracts tracing information from request headers
- Creates spans for observability

#### B. **Set Flow and Transaction ID** (`setFlowAndTransactionId`)
**File:** `src/controllers/flowController.ts:29-117`

1. Extracts `transaction_id` from request body context
2. Computes subscriber URL from context
3. Loads transaction data using `TransactionCacheService`:
   - Key: `${transactionId}::${subscriberUrl}`
4. Retrieves flow ID from transaction data
5. Loads session data using `SessionCacheService`
6. Fetches flow configuration
7. Attaches all data to request object for next middleware

#### C. **Validate and Save Incoming** (`ValidateAndSaveIncoming`)
**File:** `src/services/state-action-service.ts:11-118`

1. **Load Flow Status:** Gets current flow status (IDLE/WORKING/SUSPENDED)
2. **Generate Flow Complete Status:** Maps transaction history with flow steps
3. **Match Request:** Creates unique key from request:
   - Pattern: `${action}::${message_id}::${timestamp}`
   - Compares with stored payloads to find matching step
4. **Validate Request:**
   - Gets mock action object for the matched step
   - Runs validation using action-specific validator
   - If validation fails:
     - Sends ACK response immediately
     - Generates error response and sends back to API service
5. **Save Data:**
   - Uses action-specific save-data configuration
   - Updates session data using JSONPath expressions
   - Stores updated data in Redis with transaction ID as key

#### D. **Act Upon Flow** (`ActUponFlow`)
**File:** `src/controllers/flowController.ts:292-517`

This is the core logic that decides what to do with the validated request:

1. **Check Flow Status:**
   - If SUSPENDED: Returns "Flow is suspended"
   - If WORKING: Returns "Flow already in progress"

2. **Get Next Action Metadata:**
   - Determines what should happen next based on flow configuration
   - Returns status: LISTENING, RESPONDING, or INPUT-REQUIRED

3. **Handle Different States:**

   **LISTENING State:**
   - Mock service waits for next action from API service
   - Creates expectation if needed
   - Returns acknowledgment

   **INPUT-REQUIRED State:**
   - Checks if user inputs are provided
   - If not provided: Returns required input fields
   - If provided: Proceeds to RESPONDING

   **RESPONDING State:**
   - Generates mock response for the next action
   - Process:
     1. Sets flow status to WORKING
     2. Loads mock session data
     3. Calls `generateMockResponse()` with:
        - session_id
        - session data
        - action_id
        - user inputs (if any)
     4. Updates response with any JSON path changes
     5. Saves response data using save-data config
     6. Sends response to API service

### 3. Mock Response Generation
**File:** `src/config/mock-config/index.ts:20-39`

1. Calls version-specific factory (`createMockResponse`)
2. Factory loads action-specific generator class
3. Generator creates response based on:
   - Current session data
   - Business logic
   - User inputs
4. Updates timestamp to current time
5. Returns generated mock response

### 4. Sending Response Back
**File:** `src/utils/request-utils.ts:5-26`

The `sendToApiService` function:
1. Constructs URL: `${API_SERVICE_URL}/${domain}/${version}/mock/${action}`
2. Sends POST request with:
   - Generated mock response body
   - Query parameters (subscriber_url, flow_id, session_id)
3. API service then forwards this to the actual subscriber

### 5. Final Response to Original Request

After all middleware completes:
- Returns ACK response (200 OK) to original request
- Mock response is sent asynchronously via `sendToApiService`

## Flow Diagram

```
API Service Request
       ↓
[Manual Router: POST /:action]
       ↓
[Load Transaction & Session Data]
       ↓
[Validate Request & Match with Flow]
       ↓
[Save Incoming Data to Redis]
       ↓
[Determine Next Action]
       ↓
    ┌──────────────┬───────────────┬─────────────────┐
    ↓              ↓               ↓                 ↓
[LISTENING]   [INPUT-REQUIRED]  [RESPONDING]    [COMPLETE]
    ↓              ↓               ↓                 ↓
[Create       [Return Form]   [Generate Mock]   [No Action]
Expectation]                      ↓
                              [Send to API Service]
                                  ↓
                              [API Service forwards
                               to Subscriber]
```

## Key Components

### Transaction Tracking
- Each request is part of a transaction flow
- Transaction key: `${transaction_id}::${subscriber_url}`
- Tracks all actions in sequence with timestamps

### Session Data Management
- Mock session data stored with transaction ID as key
- Contains all order details, fulfillments, payments, etc.
- Updated after each action using JSONPath mappings

### Flow State Machine
- Manages progression through predefined flow steps
- States: IDLE → WORKING → IDLE (or SUSPENDED)
- Ensures proper sequencing of mock responses

### Action Validation
- Each action has specific validation rules
- Validates request structure and business logic
- Returns errors if validation fails

### Mock Response Generation
- Action-specific generator classes
- Uses current session state to generate contextual responses
- Supports user inputs for dynamic responses