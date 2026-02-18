# Strombericht - Electricity Load Profile Analysis

[![Website](https://img.shields.io/badge/Visit-strombericht.de-blue?style=flat-square)](https://strombericht.de)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Material UI](https://img.shields.io/badge/MUI-6-blue?style=flat-square&logo=mui)](https://mui.com/)

**Strombericht** is a professional web application designed for the deep analysis of electricity load profiles (Lastgang). It provides energy managers, industrials, and curious homeowners with immediate insights into their power consumption patterns.

## 🚀 Key Features

- **Interactive Analysis**: Upload CSV or Excel files containing 15-minute interval power data.
- **Visual Insights**: Dynamic charts powered by Recharts, offering Line and Area views with optional energy accumulation overlays.
- **Comprehensive Stats**: Track average, peak, and minimum power (kW), as well as total energy consumption over any selected period (Year, Month, Week, Day).
- **Market Analysis**: Deep integration with SMARD (Bundesnetzagentur) API to fetch and analyze German wholesale electricity prices, providing insights into Day-Ahead pricing trends.
- **Energy News**: Integrated RSS feeds from leading German energy news sources to stay informed on market changes, diesel prices, and infrastructure updates.
- **Peak Shaving Analysis**: A unique interactive tool to identify potential savings.
- **API Guarding**: Robust request limiting mechanism (1000 requests limit) for external feeds to ensure efficient and responsible API usage.
- **Premium UI**: Modern dark/light mode interface built with Material UI for a sleek, responsive experience.

## 📊 Peak Shaving & Threshold Analysis

One of the core features of Strombericht is the **Interactive Peak Line**. Users can set a custom threshold (Peak Line) directly on the chart or via a slider to analyze:

*   **Energy Above Limit**: Calculate the exact amount of energy (kWh/MWh) consumed when power exceeds the set threshold.
*   **Base Energy**: Measure the underlying consumption behavior below the peak limit.
*   **Time Above Limit**: Automatically determine the duration (in hours) spent in the "Peak Zone."
*   **Saving Potential**: Instantly see the percentage of peak load that could be reduced by implementing shaving strategies.

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌐 Live Version
Visit [strombericht.de](https://strombericht.de) to check out the live version of the application and explore more energy-related tools and insights.

---
*Built with ❤️ for energy efficiency.*
