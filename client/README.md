# Stock Trading App - Frontend

React + Vite frontend for the Stock Trading App.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend server running on http://localhost:5000

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
/client/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   ├── layout/          # Layout components
│   │   ├── stocks/          # Stock-related components
│   │   └── watchlists/      # Watchlist components
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
```

## 🎨 Features

- **Dashboard**: Overview with statistics and quick actions
- **Stocks Page**: View, filter, and manage stocks
- **Watchlists**: Create and manage stock watchlists
- **CSV Export**: Download filtered stock data
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Dependencies

- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool

## 🎯 Usage

### Viewing Stocks

1. Navigate to "Stocks" page
2. Use filters to narrow down stocks
3. Click "Refetch" to update individual stock data
4. Download filtered results as CSV

### Managing Watchlists

1. Go to "Watchlists" page
2. Click "Create Watchlist"
3. Enter name and stock symbols (comma-separated)
4. Refetch all stocks in a watchlist with one click

### Filters

Available filters:
- Trend (Uptrend, Downtrend, Neutral)
- R:R Ratio (Min/Max)
- Price Range (Min/Max)

## 🚀 Building for Production

```bash
npm run build
```

Build files will be in `/dist` directory.

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🎨 Customization

### Styling

Global styles are in `src/styles/`:
- `globals.css` - Base styles
- `variables.css` - CSS variables
- Component-specific styles are colocated

### Colors

Edit `src/utils/constants.js` to change trend colors:

```javascript
export const TREND_COLORS = {
  Uptrend: '#28a745',
  Downtrend: '#dc3545',
  Neutral: '#6c757d',
};
```

## 🐛 Troubleshooting

**API Connection Error:**
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env file

**Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📄 License

MIT