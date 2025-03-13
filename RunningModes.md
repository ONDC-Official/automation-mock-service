# Running Modes

This document describes the different modes in which the automation-mock-service can be run, along with prerequisites and setup instructions for each mode.

## Overview

The service supports three primary running modes:

1. **Standalone Mode**: For initial development without external dependencies
2. **Local Development Mode**: With Redis integration for more complex testing
3. **Production Mode**: Fully containerized for deployment environments

## Prerequisites

### General Prerequisites

Regardless of which mode you choose, you'll need:

- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **Git**: For cloning the repository

### Mode-Specific Prerequisites

| Mode       | Prerequisites                                        |
| ---------- | ---------------------------------------------------- |
| Standalone | None (everything is in-memory)                       |
| Local      | Docker, Docker Compose                               |
| Production | Docker, Docker Compose, Access to container registry |

## 1. Standalone Mode

### Prerequisites

- Node.js (v16+)
- npm (v7+)

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd automation-mock-service
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the service:**
   ```bash
   npm run dev
   ```

The service will start on the port specified in your environment variables (default is 3000).

### Configuration

In standalone mode, the service:

- Uses in-memory storage for session data
- Requires no external services
- Reads configuration from local files

Create a `.env` file in the root directory with the following minimal configuration:

```
PORT=3000
API_SERVICE_LAYER=standalone
```

## 2. Local Development Mode

### Prerequisites

- Node.js (v16+)
- npm (v7+)
- Docker
- Docker Compose

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd automation-mock-service
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start Redis using Docker Compose:**

   ```bash
   cd redis
   docker-compose up -d
   cd ..
   ```

4. **Configure the service:**
   Create a `.env` file in the root directory:

   ```
   REDIS_USERNAME=default
   REDIS_HOST=localhost
   REDIS_PASSWORD=password
   REDIS_PORT=6379
   PORT=3000
   API_SERVICE_LAYER=local
   ```

5. **Start the service:**
   ```bash
   npm run dev
   ```

### Verification

To verify Redis connection:

1. Check the service logs for successful Redis connection
2. Use a Redis client to connect to the local Redis instance: `redis-cli -h localhost -p 6379`

## 3. Production Mode

### Prerequisites

- Docker
- Docker Compose
- Access to container registry (if you plan to push images)
- GitHub Actions (for CI/CD deployment)

### Setup Instructions

#### Local Testing of Production Mode

1. **Build the Docker image:**

   ```bash
   docker build -t automation-mock-service:latest .
   ```

2. **Create Docker Compose file for production:**
   Create or edit `docker-compose.prod.yml` with:

   ```yaml
   version: "3"
   services:
     redis:
       image: redis:latest
       command: redis-server --requirepass ${REDIS_PASSWORD}
       ports:
         - "${REDIS_PORT}:6379"
       environment:
         - REDIS_PASSWORD=${REDIS_PASSWORD}
       volumes:
         - redis-data:/data

     automation-mock-service:
       image: automation-mock-service:latest
       ports:
         - "${PORT}:3000"
       environment:
         - REDIS_USERNAME=${REDIS_USERNAME}
         - REDIS_HOST=redis
         - REDIS_PASSWORD=${REDIS_PASSWORD}
         - REDIS_PORT=6379
         - PORT=3000
         - API_SERVICE_LAYER=production
       depends_on:
         - redis

   volumes:
     redis-data:
   ```

3. **Set environment variables and run:**

   ```bash
   export REDIS_USERNAME=default
   export REDIS_PASSWORD=strong-password
   export REDIS_PORT=6379
   export PORT=3000

   docker-compose -f docker-compose.prod.yml up -d
   ```

### GitHub Actions Deployment

The repository includes GitHub Actions workflows for automated deployment. The workflow:

1. Builds the Docker image
2. Pushes it to the container registry
3. Deploys the service to your environment

To use GitHub Actions:

1. Configure secrets in your GitHub repository:

   - `REGISTRY_URL`: Container registry URL
   - `REGISTRY_USERNAME`: Registry username
   - `REGISTRY_PASSWORD`: Registry password
   - `REDIS_USERNAME`: Redis username for production
   - `REDIS_HOST`: Redis host for production
   - `REDIS_PASSWORD`: Redis password for production
   - `REDIS_PORT`: Redis port for production

2. Adjust the workflow file (`.github/workflows/deploy.yml`) if necessary

3. Push changes to trigger deployment (depending on your branch configuration)

## Environment Variables Reference

| Variable            | Description    | Default      | Required in Mode  |
| ------------------- | -------------- | ------------ | ----------------- |
| `PORT`              | Service port   | `3000`       | All               |
| `API_SERVICE_LAYER` | Running mode   | `standalone` | All               |
| `REDIS_USERNAME`    | Redis username | -            | Local, Production |
| `REDIS_HOST`        | Redis hostname | `localhost`  | Local, Production |
| `REDIS_PASSWORD`    | Redis password | -            | Local, Production |
| `REDIS_PORT`        | Redis port     | `6379`       | Local, Production |

## Troubleshooting

### Standalone Mode Issues

- **Port Already in Use**: Change the `PORT` in your `.env` file
- **Typescript Errors**: Run `npm run build` to check for compilation errors

### Local Mode Issues

- **Redis Connection Error**:
  - Check if Redis container is running: `docker ps`
  - Verify Redis credentials in `.env` file
  - Check network connectivity to Redis container

### Production Mode Issues

- **Docker Build Fails**: Check Dockerfile for errors
- **Service Not Starting**: Check logs with `docker logs <container-id>`
- **Redis Connection Issues**:
  - Verify Redis service is running
  - Check network connectivity between containers
  - Validate environment variables are correctly passed to containers
