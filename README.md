# YouApp Backend Technical Challenge

This is a comprehensive backend implementation for "YouApp" using **NestJS, MongoDB, Node.js, RabbitMQ, and Socket.io**. 

It demonstrates a strong understanding of layered architecture, RESTful API design, Data Structures (Linked-List Queue), Object-Oriented Programming (OOP), Event-Driven Architecture (Microservices), and Backend Best Practices.

## 🚀 Technologies Used
*   **Framework:** NestJS (Node.js)
*   **Database:** MongoDB & Mongoose
*   **Message Broker:** RabbitMQ
*   **Real-time:** Socket.io
*   **Authentication:** JWT (JSON Web Tokens) & Passport & bcrypt
*   **Containerization:** Docker & Docker Compose
*   **Documentation:** Swagger UI

## ✨ Features & Capabilities

1.  **Authentication & Security (JWT)**
    *   Secure User Registration (`/api/register`) with bcrypt password hashing.
    *   Login (`/api/login`) returning a secure JWT token for route protection.
    *   Global Exception Filter to ensure predictable API error responses.

2.  **Profile Management (Business Logic)**
    *   Create, Get, and Update profiles (`/api/createProfile`, `/api/getProfile`, `/api/updateProfile`).
    *   **Automated Calculation:** Automatically computes a user's **Zodiac** and **Horoscope** based strictly on their provided `birthday`.

3.  **Chat System (Data Structures & OOP)**
    *   **Custom Data Structure:** Messages are processed using a custom-built **Queue** implemented via a **Linked List** (`MessageNode` and `MessageQueue` classes in `src/chat/data-structures/message-queue.ts`). This demonstrates advanced OOP concepts before saving to the database.
    *   **REST API:** Send and View messages between users (`/api/sendMessage` & `/api/viewMessages`).
    *   **Real-Time WebSockets:** A dedicated `@WebSocketGateway` allows clients to connect and send/receive messages instantly.

4.  **Microservices & Event-Driven Architecture (NoSQL)**
    *   **RabbitMQ Publisher:** Whenever a message is saved to MongoDB, an event (`message.created`) is published to the RabbitMQ broker.
    *   **Hybrid Application Consumer:** The NestJS app also acts as a microservice consumer, listening for `message.created` events and simulating a real-time Notification Service (logging the notification receipt).

## 🐳 Running with Docker (Recommended)

To run the entire stack (API, MongoDB, RabbitMQ) automatically:

1. Ensure Docker Desktop is running.
2. In the root directory, run:
```bash
docker compose up -d
```
3. The API will be available at `http://localhost:3000`.

## 💻 Running Locally (Development Mode)

1. Ensure you have MongoDB and RabbitMQ running (locally or via Cloud/Atlas).
2. Install dependencies:
```bash
npm install
```
3. Copy `.env` file configuration and update credentials if necessary:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/youapp
JWT_SECRET=super-secret-key
RABBITMQ_URL=amqp://localhost:5672
```
4. Start the application:
```bash
npm run start:dev
```

## 📖 API Documentation (Swagger)

Interactive API documentation is automatically generated using Swagger.

1. Start the application.
2. Navigate to: **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**
3. Use the **Authorize** button at the top to inject your JWT token and test protected endpoints directly from your browser.

## 🧪 Unit Tests

Basic unit tests are included for the core services to demonstrate testing proficiency using Jest.

To run the tests:
```bash
npm run test
```
