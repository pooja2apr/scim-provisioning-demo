1️ Project Overview
This project demonstrates a SCIM-based provisioning system using Node.js, MongoDB, and Express.
It includes:
- SCIM User APIs
- SCIM Group APIs
- SCIM Client simulation
- Provisioning and deprovisioning flows
2️ Architecture
-  SCIM Client ---> SCIM Server ---> MongoDB
3️ Features
- Create Users
- Fetch Users
- Update Users
- Delete Users
- Group Management
 4️ Technologies
  Node.js
  Express.js
  MongoDB
  Mongoose
  Axios
  5️ API Endpoints
| Method | Endpoint     |
| ------ | ------------ |
| POST   | `/Users`     |
| GET    | `/Users`     |
| PATCH  | `/Users/:id` |
| DELETE | `/Users/:id` |
| POST   | `/Groups`    |
| GET    | `/Groups`    |

  
