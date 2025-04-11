# Smart Contract Audit Scanner

A comprehensive web application for auditing smart contracts and assessing token risks for DEX traders investing in memecoins. This tool provides detailed insights on contract vulnerabilities, security risks, and token details.

![Screenshot 2025-04-10 222917](https://github.com/user-attachments/assets/5523f01c-25c4-43f2-b67b-6a67f2dc85c0)

## Features

- **Smart Contract Scanner**: Upload or paste smart contract code to analyze for vulnerabilities
- **Contract Address Scanner**: Enter a token contract address to analyze its security, tokenomics, and market data
- **Comprehensive Analysis**: Detailed insights including:
  - Code quality assessment
  - Security risk scoring
  - Vulnerability detection with severity ratings
  - Tokenomics analysis
  - Market and trading data
  - Community and sentiment analysis
- **Visual Risk Representation**: Dynamic pie charts and visual indicators for clear risk assessment
- **Detailed Reports**: Download comprehensive audit reports for reference

![Screenshot 2025-04-10 222956](https://github.com/user-attachments/assets/cf90be44-7cd6-4d95-8359-a7ce7d0499eb)

![Screenshot 2025-04-10 223023](https://github.com/user-attachments/assets/4b0dd1cb-6509-4e8c-93e3-5966ad324bdc)

## Technology Stack

- **Frontend**: React.js / Next.js
- **Styling**: Tailwind CSS
- **Backend**: Node.js/Express
- **Database**: MongoDB
- **Blockchain Integration**: Web3.js / ethers.js
- **APIs Integration**:
  - Blockchain data providers (Alchemy, Infura, QuickNode)
  - Explorer APIs (EtherScan, BscScan, SolScan)
  - DEX aggregators (DEX Screener)
  - Security APIs (GoPlus Security API)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/RelaxOnBnb/Contract-Security-Auditor.git
   cd Contract-Security-Auditor
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Planned Enhancements

- Real-Time Contract Monitoring: Active monitoring of contracts post-audit to identify emerging threats
- Automated Alert System: Alerts about risky tokens or suspicious transactions via notifications or emails
- Risk Score History: Track changes in contract risk scores over time
- AI-Powered Analysis: Advanced vulnerability prediction using machine learning

## Security Considerations

This application implements robust security measures:

- HTTPS & TLS encryption for all API calls
- User input sanitization
- Content Security Policy (CSP)
- API key protection via backend proxy
- Rate limiting
- MongoDB security hardening

## Follow Us

- Twitter: [@RelaxOnBnb](https://x.com/RelaxOnBnb)
- Github: [RelaxOnBnb](https://github.com/RelaxOnBnb)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is provided for educational and informational purposes only. Always conduct your own research before investing in any cryptocurrency projects.
