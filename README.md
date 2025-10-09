# Mobimeter

**Mobimeter** is a tool for **qualitative location analysis** based on key location factors such as mobility, education, local supply, recreation, leisure and health.

---

## 🧩 Prerequisites

Before starting, make sure you have the following installed:

- [Docker](https://www.docker.com/)  
- [Node.js](https://nodejs.org/)  
- [pnpm](https://pnpm.io/)

---

## ⚙️ Local Setup

### 1. Install Dependencies
```bash
pnpm i
```


### 2. Create Environment Variables

Create a `.env` file in the project root and copy the contents from `.env.example`.
Unless you modify your setup, you can leave these values as is.


### 3. Start Supabase (Backend Database)

Start the local Supabase instance:
```bash
pnpx supabase start
```

You can access the database directly at: 👉 <http://127.0.0.1:54323>

To populate the database with **initial data** or to **reset** the database at a later time, run:
```bash
pnpx supabase db reset
```

To stop the Supabase instance later:
```bash
pnpx supabase stop
```


### 4. Start OpenRouteService (Routing API)
Before the first start, download OpenStreetMap data for your target region. The project will only provide routes within this area. 

For development, it is recommended to use the Bavaria extract: 👉
<https://download.geofabrik.de/europe/germany/bayern-latest.osm.pbf>

Rename the file to `data.osm.pbf` and place it in `ors/files`.

Then start the ORS Docker instance:
```bash
pnpm ors:start
```

**Note**: The first startup may take a while as routes are built and indexed.

You can check if the service is ready at: 👉 <http://localhost:8080/ors/v2/health>

To stop the container later:
```bash
pnpm ors:stop
```


### 5. Run the Frontend

To start the development server in your browser:
```bash
pnpm dev
```

Access the app at: 👉 <http://localhost:1420/>

To run it as a desktop app:
```bash
pnpm tauri dev
```

If you seeded the data in Step 3, you can log in with these credentials:
```
user: max@mustermann.de  
password: password
```

---

## 🛠️ Troubleshooting

If you experience Docker port conflicts or network issues under Windows, try resetting the Windows NAT service to bind the Docker ports correctly:

```bash
net stop winnat
# start your Docker containers here
net start winnat
```

---

## 🚀 Production Setup

**TODO**: Add production setup instructions.
