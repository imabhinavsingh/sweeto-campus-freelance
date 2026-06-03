# Sweeto 🎓🚀
**A Hyper-Local Campus Freelance Marketplace**

---

## 🎯 Our Vision: Why Sweeto Was Created

Landing the first freelance gig is one of the hardest challenges for aspiring student developers, designers, photographers, and writers. On global platforms like Upwork or Fiverr, beginners face fierce competition from seasoned professionals worldwide who can underbid them or leverage hundreds of existing reviews. This creates a high barrier to entry, leaving talented students without an avenue to build their portfolios, gain real-world experience, and earn pocket money.

**Sweeto** was created to solve this exact problem by restricting the marketplace to the **university campus ecosystem**. 

### The Sweeto Philosophy:
1. **Leverage Campus Trust**: By limiting user verification to verified college emails (e.g., `.edu` domains), we create a secure community of buyers and sellers who belong to the same physical campus.
2. **Empower Student Portfolios**: Local campus businesses, startups, student fests, and college clubs gain direct access to cost-effective, high-quality local talent, while student freelancers get the perfect launchpad for their professional careers.
3. **Zero-Friction Transaction Trust**: Through an integrated escrow credit system, we eliminate payment default risks common in casual student-client agreements. Clients pay upfront, and funds are locked securely until work is delivered.

---

## 🛠️ Tech Stack & Architecture

Sweeto is built on a robust, lightweight **MERN (MongoDB, Express, React, Node) stack** variant, engineered to run defensively in any environment:

* **Frontend**: React (v19), React Router DOM (v7) for page navigation, React-Bootstrap (v2) for responsive styling, and Custom HSL-tailored CSS with hardware-accelerated animations for fluid page transitions.
* **Backend**: Node.js & Express.js server providing RESTful API endpoints. Secure session handling is managed via JWT (JSON Web Tokens) and bcrypt password hashing.
* **Database (Dual-Mode Engine)**: 
  * *Primary*: **MongoDB** via Mongoose.
  * *Secondary (Automatic Fallback)*: **Local filesystem storage** utilizing structured JSON flat files (`backend/data/*.json`) when MongoDB is offline.

---

## 📂 Project Directory Structure

```text
projectIntern/
├── backend/
│   ├── data/                 # Flat-file fallback databases (users, transactions, orders, etc.)
│   ├── middleware/           # Request handlers (auth verifying JWT tokens)
│   ├── models/               # MongoDB models (User.js, Order.js)
│   ├── routes/               # API Router modules:
│   │   ├── admin.js          # Admin actions, balance adjustment, categories, stats
│   │   ├── auth.js           # Client & Freelancer authentication routines
│   │   ├── categories.js     # Taxonomy routes
│   │   ├── gigs.js           # Profile queries, updates, and explores
│   │   ├── messages.js       # Workspace chat history
│   │   ├── orders.js         # Hires, escrow holds, and completions
│   │   ├── reviews.js        # Freelancer feedback submission
│   │   └── wallet.js         # Credit deposits and logs
│   ├── utils/                # DB read/write helpers
│   ├── .env                  # Port & database connections
│   ├── nodemon.json          # Hot-reload configurations
│   ├── package.json          # Server dependencies
│   └── server.js             # API Gateway & initialization
│
└── frontend/
    ├── public/               # Favicon & assets
    ├── src/
    │   ├── assets/           # React image elements
    │   ├── components/       # Common layouts (Navbar, Footer, Services, About, Gigs)
    │   ├── context/          # AuthContext mapping state and JWT storage
    │   ├── pages/            # Views (Home, Login, Signup, Explore, Profile, Dashboard)
    │   ├── index.css         # Styling, variables, keyframe animations
    │   ├── main.jsx          # Mount wrapper
    │   └── App.jsx           # Router declarations
    ├── eslint.config.js      # Linter rules
    ├── index.html            # Core document
    ├── package.json          # UI dependencies
    └── vite.config.js        # Bundler configuration
```

---

## ⚙️ Detailed Feature & Code Walkthrough

### 1. Dual-Mode Storage Fallback
* **Files**: [server.js](file:///c:/Users/abhin/Desktop/x/projectIntern/backend/server.js), [dbHelper.js](file:///c:/Users/abhin/Desktop/x/projectIntern/backend/utils/dbHelper.js)
* **Functionality**: On boot, the server attempts a mongoose connection. If the connection fails (e.g., local database is offline), it catches the error and switches to Local Storage mode (`global.isMockDB = true`). All database reads/writes are instantly rerouted to local JSON files (`users.json`, `transactions.json`, etc.) using utility helpers (`loadData`/`saveData`) which handle concurrent access and prevent data corruption.
* **Why it matters**: Guarantees the application remains fully functional for offline fests, presentations, and local environment testing without demanding a live database server.

### 2. Escrow Booking & Wallet Ledger
* **Files**: [orders.js](file:///c:/Users/abhin/Desktop/x/projectIntern/backend/routes/orders.js), [wallet.js](file:///c:/Users/abhin/Desktop/x/projectIntern/backend/routes/wallet.js), [Dashboard.jsx](file:///c:/Users/abhin/Desktop/x/projectIntern/frontend/src/pages/Dashboard.jsx)
* **Functionality**:
  * **Order Placement**: When a client hires a freelancer, the backend calculates the standard gig price and adds a flat **1% platform commission fee**.
  * **Fee Processing**: The client's wallet balance is checked. If sufficient, the backend deducts `Price + 1% Fee` from the client. The 1% fee is immediately credited to the Admin wallet as platform revenue. The core price is locked in the order’s escrow state (`status: 'pending'`).
  * **Escrow Release**: Once the freelancer completes the project and the client approves, the locked price is transferred to the freelancer's wallet balance.
  * **Ledger Entries**: Every credit movement creates a transaction ledger record (e.g., `deposit`, `hire_escrow`, `escrow_release`, `escrow_refund`, `platform_fee`) to ensure accountability.

### 3. Integrated Workspace Chat Messenger
* **Files**: [messages.js](file:///c:/Users/abhin/Desktop/x/projectIntern/backend/routes/messages.js), [Dashboard.jsx](file:///c:/Users/abhin/Desktop/x/projectIntern/frontend/src/pages/Dashboard.jsx)
* **Functionality**: Each active hire creates a unique workspace. The dashboard mounts a live chat pane filtering messages specific to the selected order ID. Client and freelancer can converse, share project requirements, and log updates directly in the workspace.

### 4. Admin Command Center & Balance Editor
* **Files**: [admin.js](file:///c:/Users/abhin/Desktop/x/projectIntern/backend/routes/admin.js), [Dashboard.jsx](file:///c:/Users/abhin/Desktop/x/projectIntern/frontend/src/pages/Dashboard.jsx)
* **Functionality**:
  * **Verify Students**: Admin reviews freelancer registrations and toggles their verification status, awarding student badging.
  * **Deactivate Accounts**: Malicious or duplicate accounts can be de-activated, locking them out of the system.
  * **Taxonomy Management**: Create or delete service categories (e.g., Web Development, Writing, Photography) which populate all search filters dynamically.
  * **Balance Adjustment**: Admin can modify any user's wallet credit balance. This creates a detailed transaction history log labelled `"Admin Balance Adjustment"`.

---

## 📖 Step-by-Step User Guide: How to Use Sweeto

To experience Sweeto, you can sign up as a Client, Freelancer, or log in as the default Platform Administrator.

### 1. Platform Administrator Guide
* **Default Credentials**: 
  * **Email**: `admin@sweeto.edu`
  * **Password**: `admin123`
* **What you can do**:
  * **Overview Panel**: View the global platform stats including total users registered, total orders booked, and platform fee revenues accumulated from the 1% flat booking charges.
  * **Manage Users**: Review the registered user database. Click **Approve** next to student freelancers to grant them a verified badge (🎓). If a user violates terms, toggle **Deactivate** to disable their account.
  * **Adjust Wallet Balances**: Click **✏️ Edit** next to any user's balance. Enter the new credit value and click save. The system will update their wallet balance and log an official ledger adjustment log.
  * **Define Categories**: Add new service taxonomy tags (e.g., "Video Editing") or delete old ones using the category input tab.

### 2. Client User Guide
* **Signup/Login**: Register a new account under the **Client** role.
* **Adding Credits**: 
  1. Go to your **Sweeto Wallet** tab in your dashboard.
  2. Enter a deposit amount (e.g., `3000`) and click **Deposit Sweeto Credits**. Your balance is instantly updated.
* **Hiring Talent**:
  1. Click **Explore Gigs** in the top navigation bar.
  2. Use the search bar or category filters to find a freelancer (e.g., Rahul Sharma).
  3. Click **View Profile** to open their gig details.
  4. Click the **Hire** button.
  5. Fill in the task specifications in the modal window. Note the checkout pricing breakdown showing: **Gig Price**, **1% Platform Fee**, and **Total Payment**.
  6. Submit the hire request. The total amount is deducted, locking the escrow portion.
* **Workspace Chat & Release**:
  1. Open your **Client Bookings** tab.
  2. Click **Open Workspace Chat** next to the pending project.
  3. Message the freelancer to coordinate the project.
  4. When the freelancer delivers the work, click **Release Escrow Payment** to complete the booking and release the locked funds to the freelancer's wallet.
  5. Provide a rating and a written review to share your hiring experience.

### 3. Freelancer User Guide
* **Signup/Login**: Register an account under the **Freelancer** role. Choose either `Current College Student` (which requires admin verification for badges) or `External Freelance Professional`.
* **Setting up your Gig Profile**:
  1. Go to the **Manage Gig Profile** tab.
  2. Add your professional title, select your category, specify your base price (e.g., `₹1500`), input your skills (comma-separated), paste your portfolio titles, and update your bio.
  3. Save the changes. Your gig is now discoverable on the global explore page.
* **Delivering Projects**:
  1. Monitor your incoming projects under the **Client Bookings** tab.
  2. Use the **Open Workspace Chat** to communicate with your client and share progress.
  3. Once the client releases the payment, your wallet balance will instantly increase by the project's base price. Check the transaction ledger history to verify.

---

## 🚀 Setup & Installation Instructions

### Prerequisites
Make sure [Node.js](https://nodejs.org/) is installed on your local system.

### Running Backend API
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the API server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`. By default, if local MongoDB is offline, the backend falls back to local JSON storage mode.*

### Running Frontend Client
1. In a new terminal window, navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the Vite hot-reload server:
   ```bash
   npm run dev
   ```
   *The client app opens automatically at `http://localhost:5173`.*
