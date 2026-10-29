# 🎰 CK44 iGaming & Casino Aggregator Platform (MERN Stack)

একটি সম্পূর্ণ প্রডাকশন-গ্রেড হাই-কনকারেন্সি ক্যাসিনো ও বেটিং প্ল্যাটফর্ম যা **CK44 (TCG White-label Architecture)**-এর ওপর ভিত্তি করে এবং **MERN Stack** (MongoDB, Express, React, Node.js) দিয়ে ডেভেলপ করা হয়েছে।

---

## 🏗️ আর্কিটেকচার ওভারভিউ

```
FreeFire-Battle-APK/
├── backend/                  # Node.js + Express + Mongoose (API Server)
│   ├── src/
│   │   ├── config/           # MongoDB Connection Setup
│   │   ├── controllers/      # Auth, SeamlessWallet, Payments, Games
│   │   ├── middleware/       # JWT Auth Guard
│   │   ├── models/           # User, Wallet, GameTransaction, Deposit, Withdrawal
│   │   ├── routes/           # /api/wps, /api/seamless, /api/wallet, /api/games
│   │   └── server.js         # Main Express Entry Point & Domain Route
│   ├── .env                  # Environment Variables
│   └── package.json
│
├── frontend/                 # React + Vite (Mobile-First SPA)
│   ├── src/
│   │   ├── components/       # Header, Banner, CategoryNav, GameGrid, GameModal, Modals
│   │   ├── services/         # API Service Client (Fetch / JWT)
│   │   ├── App.jsx           # Main State & View Manager
│   │   └── index.css         # Dark Green & Radiant Gold CSS Design System
│   └── package.json
│
├── ck44_full_master_plan_bangla.md       # ১১-ফেজের সম্পূর্ণ টেকনিক্যাল মাস্টার ব্লুপ্রিন্ট
├── ck44_system_architecture_documentation.md # সিস্টেম আর্কিটেকচার ও API স্পেসিফিকেশন
└── scratchpad_f2loxklj.md                # CK44 লাইভ অডিট ও সিকিউরিটি রিপোর্ট
```

---

## ⚡ মূল ফিচারসমূহ (Core Features)

1. **B2B Seamless Wallet Protocol:**
   - আন্তর্জাতিক গেম এগ্রিগেটরদের (Pragmatic Play, Spribe, JILI, PG Soft, Evolution) সাথে ৪টি কোর এন্ডপয়েন্ট:
     - `POST /api/seamless/balance` (লাইভ ব্যালেন্স চেক)
     - `POST /api/seamless/debit` (বাজি ধরার সময় পারমাণবিক টাকা কাটা)
     - `POST /api/seamless/credit` (উইনিং পেআউট ক্রেডিট)
     - `POST /api/seamless/rollback` (Idempotent রিফান্ড সিস্টেম)
2. **ডাবল-স্পেন্ডিং প্রিভেনশন (MongoDB Atomic Operations):**
   - `{ realBalance: { $gte: betAmount } }` এবং `$inc` ব্যবহার করে মাল্টি-ক্লিক বা রেস কন্ডিশনেও নেগেটিভ ব্যালেন্স হওয়া সম্পূর্ণ অসম্ভব।
   - `GameTransaction` কালেকশনে `txId` ইউনিক ইনডেক্স দিয়ে কঠোর **Idempotency** নিশ্চিত করা হয়েছে।
3. **লোকাল পেমেন্ট গেটওয়ে (MFS & ক্রিপ্টো):**
   - **বিকাশ (bKash)**, **নগদ (Nagad)**, **রকেট (Rocket)** ম্যানুয়াল ও অটোমেটেড P2P ডিপোজিট।
   - **USDT TRC20** ডিপোজিটে স্বয়ংক্রিয় ১.৫% এক্সট্রা বোনাস।
4. **উইথড্রল টার্নওভার গার্ড (Turnover / Wagering Rule):**
   - মানি লন্ডারিং রোধে ১x ডিপোজিট টার্নওভার পূরণ না হলে উইথড্রল রিকোয়েস্ট স্বয়ংক্রিয়ভাবে লক থাকে।
5. **CK44 মোবাইল-ফার্স্ট ডার্ক গ্রিন ও গোল্ড UI/UX:**
   - রেসপন্সিভ মোবাইল বটম নেভিগেশন, লাইভ উইনারদের স্ক্রলিং মারকুই টিকার, ডাইনামিক ব্যানার স্লাইডার এবং লাইভ সিমলেস গেম রানার।

---

## 🚀 কীভাবে রান করবেন (How to Run)

### ১. ব্যাকএন্ড সার্ভার চালু করা:
```bash
cd backend
npm install
npm run dev
```
> ব্যাকএন্ড ডিফল্টভাবে `http://localhost:5000`-এ চলবে।
> `.env` ফাইলে আপনার MongoDB Atlas কানেকশন স্ট্রিং দিতে পারেন (`MONGO_URI=mongodb+srv://...`)।

### ২. ফ্রন্টএন্ড ক্লায়েন্ট চালু করা:
```bash
cd frontend
npm install
npm run dev
```
> ফ্রন্টএন্ড `http://localhost:5174/` (বা 5173)-এ চালু হবে।

---

## 🧪 লাইভ টেস্ট করার উপায়
1. ফ্রন্টএন্ড ব্রাউজারে ওপেন করুন।
2. **রেজিস্ট্রেশন** বাটনে ক্লিক করে সাধারণ অ্যাকাউন্ট খুলুন অথবা **১-ক্লিকে তাৎক্ষণিক গেস্ট রেজিস্ট্রেশন** এ ক্লিক করুন (তাৎক্ষণিক ৫০০ টাকা ডেমো ব্যালেন্স পেয়ে যাবেন)।
3. **Aviator** গেমে ক্লিক করুন।
4. বাজি নির্ধারণ করে **বেট ধরুন** চাপুন — সাথে সাথে নিচে **MongoDB Double-Entry Webhook Inspector**-এ লাইভ `POST /api/seamless/debit` ও ব্যালেন্স কাটার রেসপন্স দেখতে পাবেন!
5. প্লেন ওড়ার সময় **ক্যাশআউট** বাটনে ক্লিক করলে রিয়েল-টাইমে `POST /api/seamless/credit` এর মাধ্যমে জিতে নেওয়া টাকা অ্যাকাউন্টে জমা হবে।
