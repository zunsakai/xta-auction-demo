<h1 align="center">
  <div>
    XTA Auction
  </div>
</h1>

<!-- TOC depthFrom:1 depthTo:3 -->
- [Requirements](#1-requirements)
    - [Frontend Feature: Real-time Crypto Price Chart](#11-frontend-feature-real-time-crypto-price-chart)
    - [Backend Feature: Asset Auction](#12-backend-feature-asset-auction)
- [Setup](#2-setup)
- [Demo](#3-demo)
<!-- /TOC -->

# 1. Requirements

## General Description
You need to build a web application with two main features. One feature focuses on the frontend (ReactJS), and the other focuses on the backend (Node.js). Each feature should be clearly separated but integrated into a single overall application.

---

## 1.1 Frontend Feature: Real-time Crypto Price Chart

Build an interface to display real-time candlestick charts for the BTC/USDT and ETH/USDT pairs. Use data from the Binance API (REST API for historical data, WebSocket for real-time price updates).

### Reference Binance APIs:
- **API for historical candlestick data**:
  [Binance Kline/Candlestick REST API](https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data)
- **WebSocket for real-time price updates**:
  [Binance Symbol Price Ticker WebSocket](https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams)

### Specific Requirements:
- The chart should be in candlestick format, with each candle representing a 1-minute interval (`1m`).
- Real-time data updates (real-time price, new candles).
- You can use supporting libraries like **TradingView**, **ChartJS**, or others as you see fit.

---

## 1.2. Backend Feature: Asset Auction

### Registration & Login APIs
- Users register using an email and password.
- Users log in using their email and password.
- Skip OTP/email verification for both registration and login (no email verification during registration, and login only requires a correct password).

### Auction API
- Only logged-in users can participate in the auction.
- Auction details:
    - Starting price: **50,000,000 VND**
    - Minimum bid increment: **5,000,000 VND**
    - Auction duration: **3 minutes**

### Auction Rules:
- Bid price must be ≥ starting price and ≥ current price + minimum bid increment.
- No limit on the number of bids per user.

### Required APIs:
- API for registration and login.
- API to get current auction information (starting price, current price, time remaining).
- API to place a new bid.
- API to retrieve auction history.

### Simple Auction Frontend Interface:
Display the following information:
- Starting price
- Bid increment
- Current price
- Time remaining
- Auction history (timestamp, partially masked user email, bid amount)

Allow users to place bids through the frontend.

---

# 2. Setup

### Start database
```shell
docker compose up -d
```

### Start backend
```shell
cd server
npm install
npm run start
```

### Start frontend
```shell
cd frontend
npm install
npm run start
```

# 3. Demo

<div align="center">
  <img src="https://raw.githubusercontent.com/zunsakai/xta-auction-demo/refs/heads/main/example/auction.png" />
</div>
<div align="center">
  <img src="https://raw.githubusercontent.com/zunsakai/xta-auction-demo/refs/heads/main/example/live-chart.png" />
</div>
