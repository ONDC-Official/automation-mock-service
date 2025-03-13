# Low Level Design Document for automation-mock-service

## 1. Overview

The automation-mock-service is a specialized Node.js service designed to simulate ONDC (Open Network for Digital Commerce) API interactions for the domains listed here (doclink). It allows developers to test and validate their implementations against the ONDC specifications without requiring actual network participants. The service supports:

- Feature 1

This document details the internal architecture, sequence flows, and guidelines for extending the system.

## 2. Architecture Overview

The service is structured around these key modules:

- **HTTP Server:** An Express-based server (as seen in `ngrok.ts` for development and main server in `/src`) that exposes endpoints for API interaction.
- **API Router & Controllers:** Routes requests based on action identifiers defined in `api-factory.ts` (search, select, init, confirm, cancel, etc.).
- **Context Generator:** Creates standardized Beckn contexts using the `createContext` function in `create-context.ts`, which generates required UUIDs and timestamps.
- **Action Generator Module:** Implemented in `api-factory.ts`, which maps action identifiers to their specific generator functions.
- **Configuration Loader:** Loads default payloads from YAML files organized in domain-specific directories (`src/config/TRV11/METRO/2.0.0/`).
- **Logging:** Uses Winston and its daily rotate features (referenced in package dependencies).
- **Cache / Storage:** Supports both in-memory caching and Redis integration (via the `ondc-automation-cache-lib` dependency).
- **Deployment Scripts:** Docker, docker-compose configurations, and GitHub Actions workflows for CI/CD.

### Component Block Diagram

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│ API Request │────►│ Express      │────►│ API Factory      │
└─────────────┘     │ HTTP Server  │     │ (api-factory.ts) │
                    └──────────────┘     └────────┬─────────┘
                                                  │
                         ┌────────────────────────┼────────────────────────┐
                         │                        │                        │
                         ▼                        ▼                        ▼
                  ┌─────────────┐         ┌─────────────┐          ┌─────────────┐
                  │ Generator 1 │         │ Generator 2 │    ...   │ Generator N │
                  │ (search)    │         │ (confirm)   │          │ (cancel)    │
                  └──────┬──────┘         └──────┬──────┘          └──────┬──────┘
                         │                       │                        │
                         └───────────────────────┼────────────────────────┘
                                                 │
                                                 ▼
                                      ┌─────────────────────┐
                                      │ Configuration Loader│
                                      │ (YAML Templates)    │
                                      └─────────┬───────────┘
                                                │
                                                ▼
                                      ┌─────────────────────┐
                                      │ Session Manager     │
                                      │ (Redis/Memory)      │
                                      └─────────────────────┘
```

## 3. Sequence Diagram

A typical request flow for an action (e.g., "confirm") follows this sequence:

1. Client sends an HTTP request with an action identifier (e.g., `/confirm`).
2. The API Router identifies the action and routes it to the appropriate handler.
3. The Context Generator creates a context object with transaction IDs and timestamps.
4. The configuration loader reads a default payload template from `TRV11/METRO/2.0.0/confirm/default.yaml`.
5. The Action Generator invokes the specific generator function (`confirmGenerator`) to customize the payload with session data.
6. The generator merges session data (like billing information, selected items, provider_id) with the default template.
7. The response is logged and returned to the client.
8. Relevant data is saved to the session store as specified in the `save-data.yaml` file.

## mention depends on

## 4. Feature List

- **Running Modes:**

  - **Standalone:** Source code execution with in-memory caching; no external dependencies.
  - **Local:** Integration with Redis for session persistence (using docker-compose in the `/redis` directory).
  - **Deploy:** Production-ready containerized deployment via GitHub Actions workflow.

- **Action Handling (doclink):**  
  Supports complete transaction lifecycle with these specific API actions:

  - Search (`search1`, `search2`)
  - Select (`select`)
  - Init (`init`)
  - Confirm (`confirm`, `on_confirm`, `on_confirm_delayed`)
  - Status (`status_active`, `status_tech_cancel`, `on_status_active`, `on_status_complete`)
  - Cancel (`cancel_soft`, `cancel_hard`, `on_cancel_soft`, `on_cancel_hard`)

- **Customizable Payloads:**  
  Default messages defined in YAML files with specific structures for each action, organized in domain/version-specific directories.

- **Configuration Management(split into service config and usecase config):**  
  Uses environment variables (`.env`), YAML payload definitions, and a centralized factory to map actions to generators.

- **Logging:**  
  Configured with Winston and winston-daily-rotate-file for comprehensive request/response logging.

- **Docker Integration:**  
  Complete Docker setup with multi-stage builds, docker-compose configuration, and GitHub Actions deployment workflow.

## 5. How to Add a Use Case (Create new md for this)

To add a new API use case (e.g., `new_action`):

1. **Define Action Default Payload:**

   - Create a directory structure: `src/config/TRV11/METRO/2.0.0/new_action/`
   - Add a `default.yaml` with the standard response template
   - Optionally add a `save-data.yaml` to define which fields to extract and save

2. **Implement the Generator Function:**

   - Create `generator.ts` in the action directory:
     ```typescript
     export async function newActionGenerator(
       existingPayload: any,
       sessionData: any
     ) {
       // Custom logic to modify payload based on session data
       if (sessionData.specific_field) {
         existingPayload.message.field = sessionData.specific_field;
       }
       return existingPayload;
     }
     ```

3. **Update the API Factory:**

   - Modify `api-factory.ts` to import and include your generator:

     ```typescript
     import { newActionGenerator } from "./new_action/generator";

     // In the Generator switch case:
     case "new_action":
       return await newActionGenerator(existingPayload, sessionData);
     ```

4. **Test the New Action:**
   - Use Postman or curl to test the new endpoint
   - Verify session data is correctly applied and saved

## 6. How to Add Validations

There are several approaches to add validations:

- **Within Generator Functions:**

  ```typescript
  export async function confirmGenerator(
    existingPayload: any,
    sessionData: any
  ) {
    // Validation example
    if (!sessionData.billing || Object.keys(sessionData.billing).length === 0) {
      throw new Error("Billing information is required");
    }

    // Apply data from session
    existingPayload.message.order.billing = sessionData.billing;
    return existingPayload;
  }
  ```

- **Using JSON Path for Validations:**
  The service supports JSONPath for complex validations, as seen in the `default-selection.json` file which defines test conditions for each action.

## 7. Config Required and Config Management

- **Environment Variables (`.env`):**
  Required variables include:

  ```
  REDIS_USERNAME=<username>
  REDIS_HOST=<host>
  REDIS_PASSWORD=<password>
  REDIS_PORT=<port>
  PORT=<service_port>
  API_SERVICE_LAYER=<layer_name>
  ```

- **Default Payloads:**
  YAML files organized under domain-specific directories: `src/config/TRV11/METRO/2.0.0/`

- **Data Extraction:**
  `save-data.yaml` files specify which fields to extract from requests using JSONPath notation.

- **Version Control:**
  All configuration files are stored in the repository and can be overridden with environment-specific values.

## 8. Supported Running Modes (create new md for this and also requirements to run in different modes)

The service supports three primary running modes:

1. **Standalone Mode:**

   - Uses in-memory storage with no external dependencies
   - Simple startup: `npm run dev`
   - All configurations loaded from local files
   - Perfect for initial development and testing

2. **Local Development Mode:**

   - Integrates with Redis for session persistence
   - Uses Docker Compose: `docker-compose up` (from the `/redis` directory)
   - Configurations from `.env` files and local YAML templates
   - Ideal for integration testing with more complex scenarios

3. **Production Mode:**
   - Fully containerized with Docker
   - Deployed via GitHub Actions workflow
   - Environment variables injected from CI/CD secrets
   - Custom Redis configuration for production use

## 9. Logging and Monitoring

- **Winston Logging:**

  - Logs requests, responses, and errors with configurable levels
  - Daily rotation to prevent log files from growing too large
  - Can output to console during development and files in production

- **Debug Mode:**

  - Detailed logging of payload transformations and session data
  - Helps trace request flow and identify issues

- **Deployment Logging:**
  - The GitHub Actions workflow includes verification steps and log output
  - Application monitoring and logging will be available via tools like Grafana, Dozzel and others in deployment mode.

## 10. API Contract (remove)

The service follows the Beckn Protocol with specific adaptations for ONDC:

- **Context Structure:**

  ```json
  {
    "action": "search",
    "bap_id": "bap_id_not_set",
    "bap_uri": "bap_uri_not_set",
    "domain": "ONDC:TRV11",
    "location": {
      "city": { "code": "std:011" },
      "country": { "code": "IND" }
    },
    "message_id": "<uuid>",
    "timestamp": "<iso-timestamp>",
    "transaction_id": "<uuid>",
    "ttl": "PT30S",
    "version": "2.0.0"
  }
  ```

- **Action-Specific Payloads:**
  Each action has its own message structure defined in the corresponding YAML files.

## 11. Conclusion

The automation-mock-service provides a comprehensive simulation environment for ONDC API interactions in the travel domain. With its modular architecture, customizable payloads, and multiple running modes, it enables developers to test and validate their implementations against the Beckn Protocol specifications without requiring actual network participants.

The system is designed for extensibility, allowing new actions and validations to be added with minimal code changes. The configuration-driven approach ensures that the service can adapt to evolving requirements and protocol changes.
