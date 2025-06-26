📦 Multi‑Vendor Data Fetch Service
📖 Overview
This project implements a scalable backend service to handle job requests interacting with multiple external data vendors (both synchronous and asynchronous). It normalizes interactions via a clean internal API and processes jobs reliably using a Redis Stream queue and background worker.

🛠️ Tech Stack
Backend Language: Node.js (Express)

Database: MongoDB

Queue: Redis Streams

Containers: Docker Compose

Vendors: Mock Sync & Async API servers

📊 Architecture Diagram
pgsql
Copy
Edit
[User/Frontend]
    |
    | POST /jobs             GET /jobs/:id
    v                         ^
[API Server]  <-----  Async Vendor POST /vendor-webhook/:vendor
    |
    | (xadd)            (xread)
[Redis Stream]  <----> [Worker Service]
    |                       |
    |                       |
[Vendor A (sync)]     [Vendor B (async)]
         |                       |
         | (Immediate)       | (Delayed)
         v                       v
    MongoDB                MongoDB
🚀 Quick Start (Docker Compose)
bash
Copy
Edit
git clone <your-repo-url>
cd multi-vendor-service
docker-compose up --build
Services:

API Server: http://localhost:4000

Sync Vendor: http://localhost:5000

Async Vendor: http://localhost:5001

MongoDB: localhost:27017

Redis: localhost:6379

📦 API Endpoints
Method	Route	Purpose
POST	/jobs	Create a new job (push to Redis queue)
GET	/jobs/:request_id	Check job status and result from Mongo
POST	/vendor-webhook/:vendor	Receive final data from async vendor

🖥️ Load Test
Ran load test with K6:

bash
Copy
Edit
k6 run --vus 200 --duration 60s loadtest-script.js
Findings:

Redis Stream handled high concurrency efficiently.

API response times consistent under load.

Worker rate-limiting can be tuned for vendor limits.

Possible Improvements:

Retry logic for failed jobs.

Prometheus and Grafana for monitoring.

🎯 Design Decisions
Redis Streams for reliable job queuing and sequential delivery.

Separate worker for job processing to keep API lightweight.

Webhook as direct HTTP POST for async vendor callbacks.

Docker Compose to spin up all services via one command.

📚 Usage (cURL)
Create a job

bash
Copy
Edit
curl -X POST http://localhost:4000/jobs -H "Content-Type: application/json" -d '{"vendor":"vendorA"}'
Check job status

bash
Copy
Edit
curl http://localhost:4000/jobs/<request_id>