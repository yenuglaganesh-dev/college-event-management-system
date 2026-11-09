# 🚀 Cloud Deployment Guide
### College Event Management System (CEMS) – CUTM AP

This project is configured for cloud deployment on **Render** or **Railway**. The repository includes a **multi-stage Dockerfile** that builds both the **React 18 frontend** and **Spring Boot 3 backend** into a single container that runs on any cloud host.

---

## 🌟 Option 1: Deploy on Railway (Recommended & Fastest)

Railway allows you to deploy both the **Spring Boot application** and a **managed MySQL database** in one project.

### Step 1: Create a Railway Account
1. Open [**railway.app**](https://railway.app) and sign in using your GitHub account.

### Step 2: Create a New Project & Provision MySQL
1. On your Railway dashboard, click **+ New Project**.
2. Select **Provision MySQL**. Railway will create a managed MySQL database instance in ~10 seconds.
3. Click on the newly created **MySQL** card, navigate to the **Variables** tab, and take note of the connection variables:
   - `MYSQLHOST`
   - `MYSQLPORT` (usually `3306`)
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

### Step 3: Add Your GitHub Repository
1. In the same project canvas, click **+ Create** / **+ New Service**.
2. Select **GitHub Repo** and choose `yenuglaganesh-dev/college-event-management-system`.
3. Railway automatically detects `Dockerfile` and `railway.json`.

### Step 4: Configure Environment Variables
1. Click on the web service card and go to the **Variables** tab.
2. Click **New Variable** or **Raw Editor** and add:
   ```env
   PORT=8080
   SPRING_DATASOURCE_URL=jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQLUSER}}
   SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   JWT_SECRET=CollegeEventManagementSystemSecretKey2026SecureLongKeyForHMACSHA256Signature!
   ```
   *(Railway automatically resolves `${{MySQL.XXX}}` variables from your MySQL service!)*

### Step 5: Seed the Database
1. In Railway, click on the **MySQL** service -> **Data** tab or connect using MySQL Workbench / CLI using the Public URL.
2. Run the SQL files included in this repo:
   - [`database/schema.sql`](../database/schema.sql)
   - [`seed_cutmap.sql`](../seed_cutmap.sql)
   - [`seed_all_12_categories.sql`](../seed_all_12_categories.sql)

### Step 6: Generate Public Domain
1. In your web service card, go to **Settings** -> **Networking** -> click **Generate Domain**.
2. Your website is now live with free SSL at `https://your-project.up.railway.app`!

---

## 🌐 Option 2: Deploy on Render

Render offers free hosting for web services with Docker support.

### Step 1: Setup a Free Cloud MySQL Database
Render provides PostgreSQL natively, so for MySQL you can use a free cloud MySQL provider:
- **Aiven for MySQL** ([aiven.io](https://aiven.io) – free tier)
- **Clever Cloud** ([clever-cloud.com](https://www.clever-cloud.com) – free MySQL)
- **TiDB Cloud** ([tidbcloud.com](https://tidbcloud.com) – free MySQL-compatible database)

1. Create a database called `college_event_db`.
2. Run [`database/schema.sql`](../database/schema.sql), [`seed_cutmap.sql`](../seed_cutmap.sql), and [`seed_all_12_categories.sql`](../seed_all_12_categories.sql).
3. Copy your JDBC host, port, username, and password.

### Step 2: Create a Web Service on Render
1. Go to [**dashboard.render.com**](https://dashboard.render.com) and log in.
2. Click **New +** -> **Web Service**.
3. Connect your repository: `yenuglaganesh-dev/college-event-management-system`.
4. Render will read `render.yaml` or you can configure manually:
   - **Name:** `college-event-management`
   - **Region:** Singapore / Oregon
   - **Language:** **Docker** (Render will use our root `Dockerfile`)
   - **Instance Type:** Free

### Step 3: Add Environment Variables on Render
Under **Environment Variables**, add:
| Key | Example Value |
| :--- | :--- |
| `PORT` | `10000` |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<your-cloud-db-host>:<port>/college_event_db?useSSL=true&serverTimezone=UTC` |
| `SPRING_DATASOURCE_USERNAME` | `<your-cloud-username>` |
| `SPRING_DATASOURCE_PASSWORD` | `<your-cloud-password>` |
| `JWT_SECRET` | `CollegeEventManagementSystemSecretKey2026SecureLongKeyForHMACSHA256Signature!` |

### Step 4: Deploy
1. Click **Create Web Service**.
2. Render builds the React frontend, packages the Spring Boot JAR, and serves the site at `https://college-event-management.onrender.com`.

---

## 🐳 Option 3: Run with Docker Locally or on Any VPS (AWS / DigitalOcean / Linode)

```bash
# Build the Docker image
docker build -t college-event-management .

# Run container connected to MySQL
docker run -d -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/college_event_db?useSSL=false&serverTimezone=UTC" \
  -e SPRING_DATASOURCE_USERNAME="root" \
  -e SPRING_DATASOURCE_PASSWORD="YOUR_PASSWORD" \
  college-event-management
```
Your full application will be accessible at `http://localhost:8080`.
