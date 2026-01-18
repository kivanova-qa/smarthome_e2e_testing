# Smart Home Lights

A modern, full-stack web application for managing smart home lights with user authentication and light control features.

## 🚀 Features

### User Authentication
- **User Registration**: Create a new account with email and password
- **Email Verification**: Accounts require email verification before login
- **Secure Login**: Password-based authentication with secure session management
- **Account Deletion**: Users can permanently delete their accounts with immediate effect
- **Password Hashing**: Passwords are securely hashed using bcrypt

### Light Management
- **Add Lights**: Create new smart lights with custom names
- **Toggle Lights**: Turn lights on/off with a single click
- **Color Control**: Customize light colors using a color picker
- **Edit Names**: Rename existing lights
- **Delete Lights**: Remove lights you no longer need
- **Real-time Updates**: All changes are immediately reflected in the UI

### User Interface
- **Modern Design**: Clean, responsive interface built with Tailwind CSS
- **Dark Mode Support**: Elegant dark theme for comfortable viewing
- **Interactive Dashboard**: Intuitive cards for each light with easy controls
- **Responsive Layout**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: SvelteKit, Tailwind CSS
- **Backend**: Node.js, Express
- **Authentication**: Session-based with bcrypt
- **Data Storage**: JSON-based file system
- **Development**: Vite, Concurrently

## 📁 Project Structure

```
├── src/
│   ├── routes/              # SvelteKit routes and pages
│   │   ├── +page.svelte     # Home/Login page
│   │   ├── register/        # Registration page
│   │   ├── verify/          # Email verification page
│   │   ├── dashboard/       # User dashboard
│   │   └── api/             # API endpoints
│   │       ├── auth/        # Authentication endpoints
│   │       └── lights/      # Light management endpoints
│   ├── lib/
│   │   ├── components/      # Reusable Svelte components
│   │   └── db.js            # Database operations
│   └── hooks.server.js      # Server-side session handling
├── data/                    # JSON database files
│   ├── users.json          # User accounts
│   └── lights.json         # Light configurations
├── static/                  # Static assets
└── server/                  # Express server
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd testthisplease
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5175
- Backend API: http://localhost:3000

## 📝 Usage Guide

### Creating an Account

1. Navigate to the registration page
2. Enter your email and password
3. Confirm your password
4. Click "Sign Up"
5. Check your email or terminal for the verification link
6. Click the verification link to activate your account

### Logging In

1. Enter your registered email and password
2. Click "Sign In"
3. You'll be redirected to your dashboard

### Managing Lights

#### Adding a Light
- Click the "+ Add Light" button
- Enter a name for the light
- Click "Add"

#### Controlling Lights
- **Turn On/Off**: Click the "Turn On" or "Turn Off" button
- **Change Color**: Click the color input and select a new color
- **Edit Name**: Click the ✏️ edit button and enter a new name
- **Delete Light**: Click the 🗑️ delete button and confirm

### Deleting Your Account

1. Click the "Delete Account" button in the dashboard
2. Confirm the deletion in the dialog
3. Your account and all associated data will be permanently deleted
4. You'll be redirected to the login page

## 🔐 Security Features

- Password hashing with bcrypt
- Session-based authentication
- Protected API endpoints
- Input validation
- Email verification requirement
- Secure account deletion

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive testing instructions using Playwright.

## 📊 Database Schema

### Users (`data/users.json`)
```json
{
  "id": "unique-user-id",
  "email": "user@example.com",
  "password": "hashed-password",
  "verified": true,
  "createdAt": "ISO-timestamp"
}
```

### Lights (`data/lights.json`)
```json
{
  "userId": {
    [
      {
        "id": "light-id",
        "name": "Light Name",
        "isOn": false,
        "color": "#hex-color"
      }
    ]
  }
}
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify?token=...` - Verify email
- `POST /api/auth/delete-account` - Delete user account

### Lights
- `GET /api/lights` - Get all user lights
- `POST /api/lights/add` - Add a new light
- `PUT /api/lights/[id]` - Update a light
- `DELETE /api/lights/[id]` - Delete a light

## 🎨 UI Components

- **Button**: Styled buttons with variants
- **Card**: Container components for content
- **Input**: Form input fields
- **LightCard**: Interactive light control cards
- **Dashboard**: Main user interface
- **Login**: Authentication form
- **Register**: Registration form

## 🚨 Error Handling

The application handles various error scenarios:
- Invalid credentials
- Unverified accounts
- Duplicate email registration
- Invalid verification tokens
- Missing required fields
- Network errors

## 📱 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.



# Smart Home Lights – E2E Testing Project
Deliverable prepared by Kremena Ivanova – December 2025

## 📌 Scope Coverage & Current Status
This deliverable provides an end-to-end Playwright + TypeScript automation suite designed using a Page Object Model (POM) architecture.  
Given the time frame (≈5–7 days build window), the implementation focuses on core flows with prioritised depth and forward-planning for extensibility.

---

## ✅ Functional Areas Automated

### 📝 01-Registration
- [01.1] User Registration: Users can create new accounts with email and password
- [01.2] Email Verification: Users must verify their email before accessing the dashboard
---

### 🔐 02-Login
- [02.1] User Login: Users can login with verified credentials
- [02.2] Login with Invalid Credentials: No access with invalid password
- [02.3] Login with Invalid Credentials: No access with empty password field
- [02.4] Login with Unverified Account: Unverified users are rejected

---

### 📤 03-Terminate
- [03.1] User Logout: Users can logout and clear their session
- [03.2] Account Deletion: Users can delete their accounts (cascades to lights)

---

### 💡 04-Light Management
- [04.1] Add New Light and Delete it: Users can add new lights with custom names and Delete them
- [04.2] Toggle Light On/Off: Users can turn lights on and off
- [04.3] Change Light Color: Users can change light colors using a color picker
- [04.4] Edit Light Name: Users can edit light names inline
- [04.5] Data Persistence: All light changes persist after page refresh

---

### 🧭 05-UI/UX-Navigation- All navigation links work correctly between pages
- [05.1] Navigation: User can move between Home, Login, Dashboard and Register
- [05.2] Navigation: Error Log page back navigation works

---

### 🚨 06-UI/UX-Error Handling
- [06.1] Login with invalid password/ Logs: No access with invalid password -> Logs 401
- [06.2] Duplicate Email Registration/ Logs: Proper error for existing emails -> Logs 400
- [06.3] Empty Form Submission on Registration: Validation prevents empty submissions -> Not implemented in Logs
- [06.4] Mismatched Passwords on Registration: Password confirmation validation -> Not implemented in Logs

---


⏳ **Pending implementation:**

### 🛡 07-Access Validation
- [07.1] Session Protection: Dashboard and protected routes redirect to login when not authenticated
- [07.2] Direct Route Access: Protected routes redirect unauthenticated users
- [07.3] Network Errors: Graceful handling of API failures

---


## 🧭 Multi-Browser Execution Notes
Cross-engine execution results differ:
- **Firefox** – Full suite passing
- **WebKit** – Partially flaky (timeouts / rendering race conditions)
- **Chromium** – Repeated instability → intentionally excluded and disabled in configuration

---

## 🧱 Test Architecture & Code Structure
This solution follows Page Object Model (POM) principles to ensure modularity, maintainability, and clarity.

### 🔹 Structural Layers

#### 📌 Page Objects (`/page-objects`)
Each screen is represented as a class exposing user-level actions:
- Element locators
- Navigation helpers
- Functional actions (login, register, delete account, update light, etc.)

Tests never reference raw selectors directly – abstraction is preserved.

#### 📌 Models & Test Data (`/models`, `/test-data`)
Typed interfaces and scenario structures provide:
- Self-documenting inputs
- Isolated data setups
- Randomized test data preventing collision

#### 📌 Spec Layer (`/tests`)
- Each test generates its own unique test entity (randomized user or light name)
- Tests do not reuse data from other tests → no cross-test dependencies
- All created data is cleaned up explicitly (delete user / delete light) at the end of each scenario
- Guarantees a clean environment and prevents leftover test data affecting subsequent runs

---

## 🛠 Design Principles
- Separation of concerns
- Reuse over duplication
- Typed data flows (TypeScript interfaces + factories)
- Test stability prioritization
 
---

## 🚧 Known Gaps & Future Enhancements
- Improve GlobalSetup- Automatically initialize minimal local test data (users, lights)
- Execute and stabilize Chromium runs

---

## ✔ Summary
This project provides:
- A working end-to-end automated suite
- POM-based architecture
- Test reasoning and browser troubleshooting
- A scalable base for future automation extension

**Execution outcome:**
- Reliable in Firefox
- Partially stable in WebKit
- Chromium excluded due to instability

