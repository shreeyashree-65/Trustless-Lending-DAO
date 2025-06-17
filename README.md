# 💸 Trustless Lending DAO

A decentralized application that enables users to request, fund, and track peer-to-peer loans without intermediaries. Built using **React**, **TailwindCSS**, and **Solidity** smart contracts deployed on Ethereum-compatible blockchains.

---

## 🚀 Features

- 🔗 **Wallet Connection**: Connect using MetaMask or any browser-compatible Ethereum wallet.
- 📥 **Request a Loan**: Borrowers can request loans by specifying amount, repayment, and duration.
- 💰 **Fund a Loan**: Lenders can fund loan requests by sending ETH.
- 📊 **Loan Stats**: Track the total number of loans created on-chain.
- 🎯 **Role-Based Filters**: View all loans or filter based on your role (Borrower / Lender).
- 📜 **Loan History Toggle**: Switch between active loans and completed/expired ones.
- 🏷 **Status Badges**: Visually distinguish between `Pending`, `Funded`, `Repaid`, and `Expired` loans.
  

---

## 🛠 Tech Stack

- **Frontend**: React, TailwindCSS, ShadCN UI
- **Smart Contracts**: Solidity + Hardhat
- **Blockchain Interaction**: Ethers.js
- **Wallet Support**: MetaMask (via window.ethereum)

---

## 📦 Project Structure

```bash
.
├── public/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── Button.jsx
│   │       └── Card.jsx
│   ├── constants.js
│   ├── App.jsx
│   └── index.js
├── smart_contracts/
│   └── LendingDAO.sol
└── README.md
