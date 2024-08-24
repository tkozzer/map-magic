# Custom Map Application - Backend Design Document

## Overview

This document outlines the backend design for the Custom Map Application, which will be deployed on Replit. The application is a browser-based tool that allows users to interact with a map of the United States, selecting and coloring counties. Users can also retrieve data about counties from Wikidata. This document covers the API structure, caching strategy, scalability considerations, security, and future-proofing, with a specific focus on deployment in the Replit environment.

## Table of Contents

1. [API Structure and Endpoints](#api-structure-and-endpoints)
2. [Caching Strategy](#caching-strategy)
3. [Rate Limiting](#rate-limiting)
4. [Scalability on Replit](#scalability-on-replit)
5. [Security](#security)
6. [Error Handling](#error-handling)
7. [Future Considerations](#future-considerations)
8. [Monitoring and Analytics](#monitoring-and-analytics)
9. [Deployment on Replit](#deployment-on-replit)
10. [Diagrams and Documentation](#diagrams-and-documentation)

## API Structure and Endpoints

The backend will serve the frontend (a Vue application) by providing county data from Wikidata and handling requests for exporting map states. All APIs will use JSON as the data format.

For more details on the frontend technology stack, see the [Frontend Frameworks and Libraries](technology-stack.md#2-frontend-frameworks-and-libraries) section in the Technology Stack document.

### Endpoints

- **GET /map/counties**
  - **Description**: Serve the initial map data for all counties. This will likely be static data stored on the server.
  - **Response**: JSON object containing all U.S. counties with their geographical data (coordinates, etc.).

- **GET /county/:id**
  - **Description**: Fetch data for a specific county. Check the server cache first. If the data is not cached, retrieve it from Wikidata and then cache it.
  - **Response**: JSON object containing county information:
    - Name
    - Population
    - Coordinates
    - Area
    - Country
    - Official Website
    - Capital
    - OSM Relation URL
    - Wikipedia Link

- **GET /cache/status**
  - **Description**: Provide information on the status of the server cache. Useful for monitoring and debugging.
  - **Response**: JSON object detailing cache status (e.g., hit/miss rates, memory usage).

- **POST /export/json**
  - **Description**: Accept requests to generate a JSON file of the current map state. Users can specify which fields to include in the JSON.
  - **Request Body**: JSON object with user-selected fields.
  - **Response**: A downloadable JSON file containing the selected map data.

- **POST /export/image**
  - **Description**: Accept requests to generate an image of the current map state. Users can specify settings such as image type and quality.
  - **Request Body**: JSON object with image settings (e.g., type, quality).
  - **Response**: A downloadable image file of the map.

## Caching Strategy

To minimize latency and reduce load on the Wikidata API, a caching strategy will be implemented on the server.

For specifics on the chosen caching solution, refer to the [Caching Solution](technology-stack.md#3-backend-frameworks-and-tools) section in the Technology Stack document.

### Server-Side Caching

- **In-Memory Cache**: Use a caching mechanism like Redis or application memory (considering Replit's environment limitations) to store recently retrieved county data.
- **Cache Invalidation**: Implement a simple Time-To-Live (TTL) based invalidation strategy to keep the cache updated. This ensures that the data remains relatively fresh without overwhelming the cache storage.
- **Cache Keys**: Use the county's unique identifier as the cache key.

### Frontend Caching

- **Browser Caching**: The frontend will also cache county data to ensure a fast and responsive user experience. This cache will be checked before making any requests to the backend.

## Rate Limiting

To prevent abuse, rate limiting will be implemented on all API endpoints.

### Implementation

- **Express-Rate-Limit**: Utilize `express-rate-limit` to set a maximum number of requests per minute/hour for each IP address.
- **Rate Limits**:
  - **GET /county/:id**: 100 requests per minute per IP.
  - **POST /export/json** and **POST /export/image**: 10 requests per minute per IP.

## Scalability on Replit

Given the possibility of thousands of concurrent users, the backend will be designed to scale within Replit's environment.

### Horizontal Scaling

- **Replit Instances**: Replit projects (Repls) can be scaled by running multiple instances. Load balancing can be achieved through Replit's built-in load management or by distributing the workload across multiple Repls.
- **Stateless Design**: The backend will be designed to be stateless, allowing easy replication across multiple Replit instances.

### Vertical Scaling

- **Resource Allocation**: While Replit has resource limits, consider upgrading the Replit plan to allocate more CPU and memory resources as needed to handle higher loads.

## Security

Although no sensitive user data is involved, basic security practices will be followed.

For detailed information on admin-specific security measures, see the [Security and Authentication](admin-design-document.md#security-and-authentication) section in the Admin Design Document.
### HTTPS

- **SSL/TLS**: Replit automatically provides HTTPS for Repls. Ensure all API endpoints are accessed via HTTPS to protect data in transit.

### API Keys

- ~~**Wikidata API Key Protection**: Ensure that API keys used to access the Wikidata API are stored securely and not exposed in the frontend code.~~

### Abuse Prevention

- **Rate Limiting**: As mentioned above, rate limiting will be implemented to prevent abuse.
- **IP Blocking**: Implement IP blocking for repeated offenders who exceed rate limits.

## Error Handling

Robust error handling will be implemented to manage interactions with the Wikidata API and other potential failures.

### Wikidata API Errors

- **Retry Logic**: Implement retry logic with exponential backoff for failed requests to the Wikidata API.
- **Fallback Mechanism**: If the Wikidata API is down or unresponsive, return a user-friendly error message and log the incident.

### General Error Handling

- **Global Error Handler**: Implement a global error handler in the Express application to catch and manage all unhandled errors.
- **User Feedback**: Provide clear and concise error messages to the frontend to ensure the user is aware of any issues.

## Future Considerations

### User Accounts and Authentication

- **Modular Architecture**: The backend will be designed to easily integrate user accounts and authentication in future versions.
- **OAuth Integration**: Potential future support for OAuth providers like Google, GitHub, or Twitter.

### AI Features

- **Microservices**: Consider using a microservices architecture to handle AI-related features, allowing independent scaling and development.

## Monitoring and Analytics

### Logging

- **Request Logs**: Log all incoming requests, including metadata like timestamps, IP addresses, and response times.
- **Error Logs**: Log all errors, with stack traces for debugging purposes.

### Monitoring

- **Performance Monitoring**: Replit provides basic monitoring tools, but for more advanced monitoring, consider integrating third-party services like New Relic or Datadog.
- **Cache Monitoring**: Monitor cache performance, including hit/miss rates and memory usage.

## Deployment on Replit

### Setting Up the Environment

- **Project Structure**: Organize your Repl with directories for the backend code, static files (if any), and configuration files. Use a `.replit` file to define the entry point of the application.
- **Environment Variables**: Store sensitive information such as API keys in Replit's environment variables.
- **Port Configuration**: Ensure that the Express server listens on the port provided by Replit (`process.env.PORT`).

### Deployment Process

- **Automatic Deployment**: Replit supports automatic deployment when changes are pushed to the repository or made directly in the Replit editor.
- **Testing**: Use Replit's built-in console and logs to test and debug the application before and after deployment.
- **Scaling**: Consider Replit's paid plans for increased performance and the ability to run multiple instances of your Repl.

## Diagrams and Documentation

### API Flow Diagram

- **Description**: This diagram will map out how data flows between the client, backend, and Wikidata API, including caching logic.

### Entity-Relationship Diagram (ERD)

- **Description**: If necessary, illustrate the relationships between different types of data being managed (e.g., counties, their properties, etc.).

### Architecture Diagram

- **Description**: This diagram will detail the overall architecture, including Replit-specific deployment considerations, load balancing, caching, and server scaling.

---

**End of Document**
