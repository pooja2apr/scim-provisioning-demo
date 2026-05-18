# SCIM Provisioning Demo

## 1. Project Overview

This project demonstrates a SCIM-based provisioning system using Node.js, MongoDB, and Express.

It includes:

- SCIM User APIs
- SCIM Group APIs
- SCIM Client Simulation
- Provisioning and Deprovisioning Flows

---

## 2. Architecture

```text
SCIM Client ---> SCIM Server ---> MongoDB

## 3. Features
-Create Users
-Fetch Users
-Update Users
-Delete Users
-Group Management

## 4. Technologies
-Node.js
-Express.js
-MongoDB
-Axios
-Mongoose

 ## 5. API Endpoints
| Method | Endpoint   |
| ------ | ---------- |
| POST   | /Users     |
| GET    | /Users     |
| PATCH  | /Users/:id |
| DELETE | /Users/:id |
| POST   | /Groups    |
| GET    | /Groups    |

