# How to Add a Use Case

This guide provides step-by-step instructions for adding new API actions and use cases to the automation-mock-service.

## Overview

The architecture of the automation-mock-service is designed to be extensible. Each API action (like `search`, `select`, `confirm`) is implemented as a separate generator function that processes incoming requests and produces responses based on templates and session data.

## Step-by-Step Guide

To add a new API use case (e.g., `new_action`):

### 1. Directory Structure

Create the appropriate directory structure for your new action:

```
src/
└── config/
    └── TRV11/
        └── METRO/
            └── 2.0.0/
                └── new_action/
                    ├── default.yaml
                    └── save-data.yaml (optional)
```

### 2. Define Default Payload Template

Create a `default.yaml` file in the new action directory with the standard response template. This will serve as the base structure for your responses:

```yaml
# src/config/TRV11/METRO/2.0.0/new_action/default.yaml
context:
  domain: "ONDC:TRV11"
  action: "new_action"
  version: "2.0.0"
message:
  # Define your default message structure here
  order:
    id: ""
    status: "NEW"
    items: []
    # Add other fields as needed
```

### 3. Define Data Extraction Rules (Optional)

If your action needs to save data from incoming requests for use in subsequent requests, create a `save-data.yaml` file:

```yaml
# src/config/TRV11/METRO/2.0.0/new_action/save-data.yaml
# JSONPath expressions to extract data from the request
order_id: $.message.order.id
billing_info: $.message.order.billing
# Add other extraction paths as needed
```

### 4. Implement the Generator Function

Create a new file called `generator.ts` in your action directory:

```typescript
// src/config/TRV11/METRO/2.0.0/new_action/generator.ts

export async function newActionGenerator(
  existingPayload: any,
  sessionData: any
) {
  // Custom logic to modify payload based on session data
  if (!sessionData) {
    // Handle missing session data case
    return existingPayload;
  }

  // Apply session data to the payload
  if (sessionData.specific_field) {
    existingPayload.message.field = sessionData.specific_field;
  }

  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  // You can add validations here
  if (sessionData.required_field && !sessionData.required_field.value) {
    throw new Error("Required field is missing or invalid");
  }

  // Return the modified payload
  return existingPayload;
}
```

### 5. Update the API Factory

Modify the api-factory.ts file to import and include your generator function:

```typescript
// Import your new generator
import { newActionGenerator } from "./config/TRV11/METRO/2.0.0/new_action/generator";

// In the generator function's switch case, add a new case:
switch (action) {
  // ... existing cases
  case "new_action":
    return await newActionGenerator(existingPayload, sessionData);
  // ... other cases
}
```

### 6. Add the Action to the Router (if necessary)

If your action needs a new endpoint, update the relevant router file in `src/routes/`:

```typescript
// Example route addition
router.post("/new_action", actionController.handleAction("new_action"));
```

### 7. Testing Your New Action

Test your new API action using Postman, curl, or your preferred API testing tool:

1. Send a request to the endpoint (e.g., `/new_action`)
2. Check that the response structure matches your expected template
3. Verify that session data is correctly applied to the response
4. Test validation logic by sending invalid requests

## Adding Validations

There are several approaches to add validations to your use case:

### Within Generator Functions

You can add direct validation in your generator function:

```typescript
export async function confirmGenerator(existingPayload: any, sessionData: any) {
  // Validation example
  if (!sessionData.billing || Object.keys(sessionData.billing).length === 0) {
    throw new Error("Billing information is required");
  }

  // Apply data from session
  existingPayload.message.order.billing = sessionData.billing;
  return existingPayload;
}
```

### Using JSON Path for Complex Validations

For more complex validations using JSONPath:

```typescript
import { JSONPath } from "jsonpath-plus";

export async function complexValidator(payload: any, sessionData: any) {
  // Check if payment methods exist
  const paymentMethods = JSONPath({
    path: "$.message.order.payment.methods",
    json: payload,
  });

  if (!paymentMethods || paymentMethods.length === 0) {
    throw new Error("No payment methods available");
  }

  return payload;
}
```

## Best Practices

1. **Maintain Consistent Structure**: Follow the existing patterns for generators and configuration
2. **Add Comments**: Document the purpose and expected input/output of your generator
3. **Handle Edge Cases**: Include error handling for missing or invalid session data
4. **Keep Functions Focused**: Each generator should handle a single action/responsibility
5. **Test Thoroughly**: Test your new action with various inputs and edge cases

## Troubleshooting

- **Missing Default Template**: If your generator can't find the default.yaml, check your directory structure
- **Session Data Issues**: Use logging to debug what session data is available in your generator
- **Validation Errors**: Ensure your error messages are descriptive for easier debugging
