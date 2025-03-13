# Configuration Management

This document describes how configuration is managed in the automation-mock-service, including both service-level configuration and use case-specific configuration.

## Configuration Overview

The automation-mock-service uses a layered configuration approach:

1. **Service Configuration**: Environment variables and startup parameters that control how the service runs
2. **Use Case Configuration**: YAML templates and other files that define the behavior of specific API actions

## Service Configuration

### Environment Variables

Service configuration primarily uses environment variables which can be set in a `.env` file or provided directly to the environment:

| Variable            | Description                                           | Default      | Required                    |
| ------------------- | ----------------------------------------------------- | ------------ | --------------------------- |
| `PORT`              | Port on which the service listens                     | `3000`       | No                          |
| `API_SERVICE_LAYER` | Running mode (`standalone`, `local`, or `production`) | `standalone` | Yes                         |
| `REDIS_USERNAME`    | Redis username                                        | -            | Yes (in local/production)   |
| `REDIS_HOST`        | Redis hostname                                        | `localhost`  | Yes (in local/production)   |
| `REDIS_PASSWORD`    | Redis password                                        | -            | Yes (in local/production)   |
| `REDIS_PORT`        | Redis port                                            | `6379`       | Yes (in local/production)   |
| `LOG_LEVEL`         | Logging level (error, warn, info, debug)              | `info`       | No                          |
| `LOG_TO_FILE`       | Whether to write logs to file                         | `false`      | No                          |
| `LOG_FILE_PATH`     | Path for log files                                    | `logs/`      | No (if LOG_TO_FILE is true) |

### Sample `.env` File

```
# Basic Service Configuration
PORT=3000
API_SERVICE_LAYER=local

# Redis Configuration (required for local and production modes)
REDIS_USERNAME=default
REDIS_HOST=localhost
REDIS_PASSWORD=password
REDIS_PORT=6379

# Logging Configuration
LOG_LEVEL=info
LOG_TO_FILE=true
LOG_FILE_PATH=logs/
```

### Configuration Loading Process

1. The service first loads environment variables from the `.env` file (if present)
2. It then applies any environment variables directly set in the environment (overriding those from the `.env` file)
3. Finally, it applies defaults for any missing values

## Use Case Configuration

Use case configuration defines the behavior of specific API actions (search, select, confirm, etc.) and is stored in YAML files organized by domain and version.

### Directory Structure

Use case configuration follows this directory structure:

```
src/
└── config/
    └── TRV11/                     # Domain (e.g., Travel)
        └── METRO/                 # Sub-domain
            └── 2.0.0/             # Version
                ├── search/        # Action
                │   ├── default.yaml       # Default response template
                │   └── save-data.yaml     # Data extraction rules
                ├── select/
                │   ├── default.yaml
                │   └── save-data.yaml
                ├── confirm/
                │   ├── default.yaml
                │   └── save-data.yaml
                └── ... (other actions)
```

### Default Response Templates (`default.yaml`)

Each action has a `default.yaml` file that defines the structure of the response. For example:

```yaml
# src/config/TRV11/METRO/2.0.0/confirm/default.yaml
context:
  domain: "ONDC:TRV11"
  action: "confirm"
  version: "2.0.0"
message:
  order:
    id: ""
    status: "CONFIRMED"
    items: []
    billing: {}
    payment:
      status: "PAID"
      type: "ON-ORDER"
```

These templates provide the base structure that will be customized at runtime with session data.

### Data Extraction Rules (`save-data.yaml`)

The `save-data.yaml` files define which data should be extracted from incoming requests and saved to the session for use in subsequent requests:

```yaml
# src/config/TRV11/METRO/2.0.0/confirm/save-data.yaml
order_id: $.message.order.id
billing_info: $.message.order.billing
payment_method: $.message.order.payment.type
items: $.message.order.items
```

These use JSONPath expressions to extract values from the request payload.

## Configuration Loading and Precedence

The service follows this precedence when constructing responses:

1. Load the base template from the appropriate `default.yaml` file
2. Merge it with any relevant session data (from previous requests)
3. Apply any custom logic in the specific generator function
4. Return the final response

## Advanced Configuration

### Custom Response Templates

You can create custom templates for specific scenarios by adding additional YAML files:

```
src/config/TRV11/METRO/2.0.0/confirm/
├── default.yaml       # Default template
├── error.yaml         # Error response template
└── special-case.yaml  # Template for special cases
```

Then reference these in your generator functions:

```typescript
// Load special case template instead of default
const templatePath = specialCondition
  ? "TRV11/METRO/2.0.0/confirm/special-case.yaml"
  : "TRV11/METRO/2.0.0/confirm/default.yaml";
```

### Conditional Logic

You can implement conditional logic in your generator functions to modify responses based on request parameters:

```typescript
export async function confirmGenerator(existingPayload: any, sessionData: any) {
  // Apply special discounts based on order value
  if (sessionData.orderValue > 1000) {
    existingPayload.message.order.quote.breakup.push({
      title: "Bulk Discount",
      price: {
        currency: "INR",
        value: "-100",
      },
    });

    // Recalculate total
    const total = existingPayload.message.order.quote.price.value;
    existingPayload.message.order.quote.price.value = String(
      Number(total) - 100
    );
  }

  return existingPayload;
}
```

## Configuration Management Best Practices

1. **Keep Defaults Generic**: Default templates should represent the most common case
2. **Version Control**: All configuration files should be in version control
3. **Environment-Specific Config**: Use environment variables for environment-specific values
4. **Documentation**: Comment your YAML files, especially for complex structures
5. **Validation**: Add validation for required fields both in templates and generator functions
