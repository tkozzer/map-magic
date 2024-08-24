# Custom Map Application - Admin Design Document

## Overview

This document outlines the design for the admin backend of the Custom Map Application. The admin interface will provide monitoring, control, and configuration capabilities to ensure the smooth operation and management of the application. This document covers the admin API structure, endpoints, security considerations, and future-proofing for the admin features.

## Table of Contents

1. [Admin API Structure and Endpoints](#admin-api-structure-and-endpoints)
2. [Security and Authentication](#security-and-authentication)
3. [Error Handling and Logging](#error-handling-and-logging)
4. [Future Considerations](#future-considerations)
5. [Monitoring and Analytics for Admin](#monitoring-and-analytics-for-admin)
6. [Deployment on Replit](#deployment-on-replit)
7. [Diagrams and Documentation](#diagrams-and-documentation)

## Admin API Structure and Endpoints

The admin API will allow for monitoring and controlling various aspects of the Custom Map Application. Below is a detailed breakdown of each endpoint, including its purpose, request/response format, and use cases.

These admin endpoints complement the main application API. For details on the main API structure, see the [API Structure and Endpoints](backend-design-document.md#api-structure-and-endpoints) section in the Backend Design Document.

### 1. API Usage Statistics

- **Endpoint**: `GET /admin/stats/api-usage`
- **Description**: Provides detailed statistics on API usage, including the number of requests per endpoint, average response time, error rates, and rate limit hits.
- **Response**: JSON object with metrics for each endpoint, broken down by time intervals (e.g., last 24 hours, last week).
- **Use Case**: Monitor how APIs are being used, identify any bottlenecks, and ensure that rate limits are functioning as intended.

### 2. Cache Performance

- **Endpoint**: `GET /admin/stats/cache-performance`
- **Description**: Reports on cache performance, including hit/miss ratios, average time to serve cached data, and cache size.
- **Response**: JSON object with cache statistics, including metrics for each key or type of data cached.
- **Use Case**: Determine the effectiveness of the caching strategy, identify keys that are frequently missing, and adjust TTL values or caching logic if necessary.

### 3. Error Monitoring

- **Endpoint**: `GET /admin/stats/error-logs`
- **Description**: Retrieves a list of recent errors, including API failures, unhandled exceptions, and any issues with external dependencies like Wikidata.
- **Response**: JSON array of error logs, with details such as timestamp, endpoint, error message, and stack trace.
- **Use Case**: Quickly identify and diagnose issues affecting the application, with the ability to prioritize critical errors.

### 4. User Interaction Monitoring

- **Endpoint**: `GET /admin/stats/user-interactions`
- **Description**: Tracks user interactions on the site, such as the number of counties clicked, maps generated, JSON files exported, and images created.
- **Response**: JSON object with interaction metrics, broken down by user actions.
- **Use Case**: Understand how users are interacting with the application, which features are most popular, and where users may be encountering difficulties.

### 5. Rate Limiting Monitoring

- **Endpoint**: `GET /admin/stats/rate-limiting`
- **Description**: Monitors rate limiting across the application, showing how many times rate limits have been hit and which IPs or users are most affected.
- **Response**: JSON object with rate limit data, including IP addresses, endpoints affected, and timestamps.
- **Use Case**: Ensure that rate limits are correctly implemented and not overly restrictive. Identify potential abuse or need for rate limit adjustments.

### 6. System Health Check

- **Endpoint**: `GET /admin/health`
- **Description**: Provides a real-time snapshot of the system’s health, including server status, database connectivity, and external API availability.
- **Response**: JSON object indicating the status of various components (e.g., OK, WARNING, CRITICAL) and additional details if something is not functioning properly.
- **Use Case**: Quickly assess the overall health of the application and pinpoint areas that may need attention or immediate action.

### 7. Cache Management

- **Endpoint**: `POST /admin/cache/clear`
- **Description**: Clears the server cache, either entirely or for specific keys, allowing the admin to reset the cache when necessary.
- **Request Body**: Optionally specify keys or data types to clear.
- **Response**: JSON object indicating success or failure.
- **Use Case**: Manually clear outdated or incorrect cache entries, especially after a bug fix or data update.

### 8. Configuration and Control

- **Endpoint**: `GET /admin/config`
- **Description**: Retrieves the current configuration settings for the backend, including environment variables, rate limits, and caching strategies.
- **Response**: JSON object with current configuration settings.
- **Use Case**: Review the configuration settings currently in effect, ensuring they match the intended deployment.

- **Endpoint**: `POST /admin/config`
- **Description**: Allows updating certain configuration settings on the fly, such as adjusting rate limits, TTL for caches, or enabling/disabling specific features.
- **Request Body**: JSON object with the new configuration values.
- **Response**: JSON object indicating success or failure.
- **Use Case**: Make adjustments to the backend without needing to redeploy, useful for quick fixes or performance tuning.

### 9. Session and Traffic Monitoring

- **Endpoint**: `GET /admin/stats/sessions`
- **Description**: Provides information on active sessions, including IP addresses, session durations, and the number of requests made per session.
- **Response**: JSON object with session details.
- **Use Case**: Monitor current user traffic, detect any unusual patterns, and ensure the application is handling sessions effectively.

### 10. Audit Logs

- **Endpoint**: `GET /admin/audit-logs`
- **Description**: Retrieves logs of significant actions taken on the server, such as changes to configuration, cache clears, or admin actions.
- **Response**: JSON array of audit logs, with details such as action, user (if applicable), timestamp, and result.
- **Use Case**: Maintain a record of critical actions performed on the backend, useful for troubleshooting and accountability.

### 11. Admin Authentication

- **Endpoint**: `POST /admin/login`
- **Description**: Endpoint for admin authentication. Requires an admin username and password (or OAuth if implemented).
- **Request Body**: JSON object with `username` and `password`.
- **Response**: JSON object with a session token for authenticated requests.
- **Use Case**: Secure access to the admin endpoints, ensuring that only authorized users can monitor or control the application.

## Security and Authentication

### Authentication

- **Admin Login**: Admins will authenticate using a username and password via the `/admin/login` endpoint. Upon successful authentication, a session token will be issued and required for subsequent admin actions.
- **Token Management**: Tokens will have an expiration time (e.g., 1 hour) and can be refreshed. Tokens will be stored securely on the server.

### Access Control

- **Role-Based Access**: In the future, consider implementing role-based access control (RBAC) to differentiate between different levels of admin privileges (e.g., read-only vs. full control).
- **IP Whitelisting**: Optionally restrict access to admin endpoints to specific IP addresses or ranges.

### Rate Limiting

- **Admin Endpoints**: Implement rate limiting on admin endpoints to prevent abuse or brute-force attacks on the login system.

## Error Handling and Logging

### Centralized Error Handling

- **Global Error Handler**: A centralized error handler will manage errors across all admin endpoints, ensuring consistent error responses.
- **Error Codes**: Use standardized error codes to indicate the type of error (e.g., `401 Unauthorized`, `500 Internal Server Error`).

### Logging

- **Admin Actions**: All actions taken via the admin API will be logged, including the action performed, the admin user, and the timestamp.
- **Error Logs**: Errors encountered in the admin system will be logged with full details, including stack traces for debugging.

## Future Considerations

### Enhanced Monitoring

- **Real-Time Analytics**: Consider adding real-time analytics to the admin dashboard to monitor user interactions and API performance live.
- **Alerting System**: Integrate with a notification system (e.g., Slack, email) to alert admins of critical issues like high error rates or system downtime.

### Admin Dashboard

- **UI Development**: The admin endpoints will be connected to an admin dashboard, providing a graphical interface for monitoring and control. This can be built using Vue.js or another frontend framework.

### Role-Based Access Control (RBAC)

- **User Roles**: Implement roles such as `superadmin`, `admin`, and `viewer` to provide varying levels of access and control within the admin system.

## Monitoring and Analytics for Admin

### Logging

- **Request Logs**: Log all incoming admin requests, including metadata like timestamps, IP addresses, and actions performed.
- **Error Logs**: Log all errors encountered in the admin system, including stack traces for debugging purposes.

### Monitoring

- **Performance Monitoring**: Monitor the performance of admin endpoints, ensuring they respond quickly and do not become a bottleneck.
- **Security Monitoring**: Track failed login attempts and other potential security incidents in the admin system.

## Deployment on Replit

### Admin Environment

- **Project Structure**: Ensure that admin-related code and configuration are separated from the main application code, using environment variables for sensitive data like admin credentials.
- **Environment Variables**: Store admin credentials and other sensitive information securely in Replit's environment variables.

For general deployment information, refer to the [Deployment and Hosting](technology-stack.md#4-deployment-and-hosting) section in the Technology Stack document.

### Deployment Process

- **Automatic Deployment**: Replit supports automatic deployment when changes are pushed to the repository or made directly in the Replit editor.
- **Testing**: Use Replit's built-in console and logs to test and debug the admin system before and after deployment.

## Diagrams and Documentation

### Admin API Flow Diagram

- **Description**: This diagram will map out how data flows within the admin system, including authentication, data retrieval, and error handling.

### Security Model Diagram

- **Description**: Illustrates the security model for the admin system, including authentication, token management, and role-based access control.

---

**End of Document**
