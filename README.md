# 📊 Financial Data Calendar

An interactive financial data visualization tool that displays historical market data—volatility, liquidity, and performance—across **Daily**, **Weekly**, and **Monthly** views. Built with React, it provides an intuitive calendar interface backed by real Binance OHLCV data.

## 🧠 Features

- 📅 Custom calendar with Daily, Weekly, and Monthly views
- 🔍 Visual overlays for:
  - **Volatility** (color-coded)
  - **Liquidity** (dotted, striped, gradient overlays)
  - **Performance** (arrows with % change)
- 📈 Real-time historical data via Binance API
- 📦 Export data as CSV or PDF
- ⌨️ Keyboard navigation support (← ↑ ↓ →, Enter, Esc)
- 📱 Responsive design
- 🧮 Dashboard panel with moving averages (MA) and relative strength index (RSI)

---

## 🛠️ Technologies Used

- **React** (with functional components and hooks)
- **CSS** for styling (no Tailwind or external UI libraries)
- **Day.js** for date management
- **Axios** for API requests
- **Material UI Tooltip** (for info overlays)
- **jsPDF** + **json2csv** (for export functions)
- **Binance OHLCV API** (1d interval)
- **Vite** (or similar for fast development/build)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/financial-data-calendar.git
cd financial-data-calendar
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

---

## 📦 Build for Production

```bash
npm run build
```
The production-ready files will be generated in the dist/ folder.
