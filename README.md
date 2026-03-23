# 💰 Finance Tracker

> *"financial freedom is self care"*

A modern, full-stack personal finance application designed to make money management approachable, intuitive, and actually enjoyable. Built with a focus on financial literacy and clean design.

---

## 🌐 Live Demo

**[View Deployed App](website)** 

---

## ✨ Features

### Core
- 🔐 Secure authentication with JSON Web Tokens
- 💸 Track income and expenses with custom categories
- 📊 Dashboard with real-time spending charts and metrics
- 📅 Month-by-month transaction history

### Smart Budgeting
- 🎯 Set monthly budgets per spending category
- ⚠️ Customizable budget alert thresholds (50%, 70%, 80%, 90%)
- 📉 Visual progress bars showing spending vs. limit

### Goals
- 🌱 Create savings goals with target amounts and dates
- ➕ Add funds incrementally toward each goal
- ✅ Automatic goal completion tracking

### Polish
- 🔁 Mark transactions as recurring (daily, weekly, monthly)
- 🌙 Dark mode toggle with soft charcoal theme
- 📱 Responsive layout

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite 8 | UI framework and build tool |
| @apollo/client 3 | GraphQL data fetching and caching |
| Recharts | Data visualization |
| React Router v7 | Client-side routing |
| CSS Variables | Theming and dark mode |
 
### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 4 | Server framework |
| @apollo/server 4 | GraphQL API layer |
| GraphQL 16 | Query language for the API |
| MongoDB + Mongoose 9 | Database and ODM |
| jsonwebtoken 9 | Authentication |
| bcrypt 6 | Password hashing |
| dotenv 17 | Environment variable management |
| cors 2 | Cross-origin resource sharing |
---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)

**Open the app**

Visit `http://localhost:5173`

---

## 📁 Project Structure
```
FinanceTracker/
├── client/                 
│   └── src/
│       ├── components/     
│       ├── pages/          
│       └── utils/          
└── server/                 
    ├── config/             
    ├── middleware/         
    ├── models/             
    ├── resolvers/          
    └── schemas/            
```

---

## 🔒 Security

- Passwords are hashed with bcrypt before storage
- JWT tokens expire after 7 days
- All API routes are protected — users can only access their own data
- Sensitive environment variables are never exposed to the client

---

## 🔮 Future Improvements

- CSV import from bank statements
- Email reminders for budget alerts
- Net worth tracking over time
- Mobile app version

---

## 👩‍💻 Contact

Jean Park 
E-mail: thejeanpark@gmail.com
