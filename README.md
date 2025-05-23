
# Medina Platform – Full Stack Dockerized App

This is a full-stack web application built with:

- **Frontend**: React (Vite)
- **Backend**: Express.js (Node.js)
- **Database**: MySQL
- **Containerized with**: Docker & Docker Compose

---

## 📚 Table of Contents

- [📦 Software Requirements](#-software-requirements)
- [💻 Hardware Requirements](#-hardware-requirements)
- [🧩 Prerequisites](#-prerequisites)
- [🧱 Option 1: Run Using Docker Compose Directly (No Scripts)](#-option-1-run-using-docker-compose-directly-no-scripts)
  - [🛠️ Step 1: Build and Start All Services](#️-step-1-build-and-start-all-services)
  - [🔍 Detailed Breakdown of What Happens](#-detailed-breakdown-of-what-happens)
  - [📥 Step 2: Import the SQL Schema](#-step-2-import-the-sql-schema)
  - [✅ Verifying the Tables Were Created](#-verifying-the-tables-were-created)
- [🛠️ Option 2: Run Using Scripts (Linux/macOS or Windows)](#️-option-2-run-using-scripts-linuxmacos-or-windows)
- [▶️ Starting the App (After Setup)](#️-starting-the-app-after-setup)
- [⏹️ Stopping the App](#-stopping-the-app)
- [💣 Full Teardown (Clean Everything)](#-full-teardown-clean-everything)
- [🌐 Accessing the App](#-accessing-the-app)


## 🚀 Getting Started

This project supports both **Linux/macOS** and **Windows (cmd)** environments.

## 📦 Software Requirements

- **Operating System**: Linux, macOS, or Windows 10/11 (with WSL2 recommended)
- **Docker**: version 20.10+  
- **Docker Compose**: version 1.29+ or v2 plugin  
- **Node.js** (only if running frontend/backend outside Docker): version 18+
- **MySQL Client** (optional): for connecting to the database manually

## 💻 Hardware Requirements

- **CPU**: Dual-core or higher
- **RAM**: Minimum 4 GB (8 GB recommended for Docker smooth performance)
- **Disk Space**: At least 1 GB free for images and volumes


### 🧩 Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)
- Git Bash or Command Prompt (Windows)


## 🧱 Option 1: Run Using Docker Compose Directly (No Scripts)

To run the project using **pure Docker Compose commands** (without the setup/start scripts), follow these instructions:

### 🔨 Step 1: Build and Start All Services

```bash
docker-compose up --build -d
```

This command uses your `docker-compose.yml` to orchestrate your **multi-container application**, which includes the **frontend**, **backend**, and **MySQL** services.


## 🔍 Detailed Breakdown of What Happens

### 🧱 1. **Build Docker Images**

For services with a `build:` directive (e.g. `frontend` and `backend`), Docker Compose:

* Reads the `Dockerfile` in the specified directory (`./frontend` and `./backend`)
* Installs dependencies (`npm install`, etc.)
* Builds the app (e.g. `npm run build` in the frontend)
* Prepares the container image

✅ The `--build` flag **forces a rebuild**, ensuring the image is up to date.

---

### 🐳 2. **Start Containers**

Docker Compose will:

* Create containers for:

  * `db` (MySQL)
  * `backend` (Express API)
  * `frontend` (React client)
* Use **defined environment variables** (like DB passwords and port settings)
* Establish a **private Docker network** where containers communicate by service name

For example:

* The backend connects to the DB at `DB_HOST=db`
* The frontend sends API requests to `VITE_API_URL=http://localhost:5000`

---

### 🔗 3. **Mount Code with Bind Volumes**

Your compose file uses bind mounts like:

```yaml
volumes:
  - ./backend:/app
```

This means:

* The **host folder (your source code)** is directly **mounted into the container**.
* Changes you make on your machine (e.g. editing `.js`, `.tsx`, or `.env`) reflect instantly inside the container.
* Ideal for **development with hot-reload**.

---

### 🌐 4. **Expose and Map Ports**

Your compose file also defines:

```yaml
ports:
  - "5000:5000"   # backend
  - "5173:5173"   # frontend
  - "3306:3306"   # MySQL
```

This makes the services accessible from your browser or other apps on your host machine:

* `http://localhost:5173` → React frontend
* `http://localhost:5000` → Express backend API
* `localhost:3306` → MySQL (use MySQL clients like DBeaver or MySQL Workbench)


---

### 📥 Step 2: Import the SQL Schema

This step must be done **once**, right after the first build. It imports the schema into the `medina` database using the `medina.linux.sql` file.

Run:

```bash
docker exec -i medina-db-1 mysql -u root -p22022006 medina < ./backend/medina.linux.sql
```

> 📌 This assumes:
>
> * The MySQL service container is named `medina-db-1` (use `docker ps` to verify).
> * The SQL file path is correct relative to where you run the command.
> * MySQL is already running (wait a few seconds after starting if needed).

---

### ✅ Verifying the Tables Were Created

To check if your tables were imported correctly:

```bash
docker exec -it medina-db-1 mysql -u root -p
# Inside MySQL shell:
USE medina;
SHOW TABLES;
```

You should see tables like `utilisateurs`, `fiches`, `notifications`, etc.

---

## 🛠️ Option 2: Run Using Scripts (Linux/macOS or Windows)

This will:

- Build all Docker images
- Start the database, backend, and frontend
- Wait for MySQL to be ready
- Import the database schema from `medina.linux.sql`

### 🛠️ Step 1: Run Setup Script

### ✅ Linux/macOS
```bash
chmod +x ./setup.sh && ./setup.sh
```

### ✅ Windows

```cmd
setup.bat
```

---

## ▶️ Starting the App (After Setup)

### ✅ Linux/macOS

```bash
chmod +x ./start.sh && ./start.sh
```

### ✅ Windows

```cmd
start.bat
```

---

## ⏹️ Stopping the App

This stops the containers but keeps volumes and data.

### ✅ Linux/macOS

```bash
chmod +x ./stop.sh && ./stop.sh
```

### ✅ Windows

```cmd
stop.bat
```

---

## 💣 Full Teardown (Clean Everything)

This will:

* Stop and remove containers
* Remove built images
* Delete the database volume (`db_data`)
* Use this if you want to **reset everything**

### ✅ Linux/macOS

```bash
chmod +x ./teardown.sh && ./teardown.sh
```

### ✅ Windows

```cmd
teardown.bat
```

---


## 🌐 Accessing the App

* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)
* **MySQL**: Host: `localhost`, Port: `3306`, User: `root`, Password: `22022006`


