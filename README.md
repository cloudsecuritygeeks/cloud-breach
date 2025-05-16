# Cloud Breach: AWS Security Strategy Game 🎮

Cloud Breach is an engaging turn-based strategy game that simulates the ongoing battle between cloud security professionals (Blue Team) and cyber attackers (Red Team) in an AWS environment. Players can experience both sides of cloud security, learning about real AWS services and common attack patterns while having fun!

## 🎯 Game Overview

In Cloud Breach, players take turns playing cards and rolling dice to either attack (Red Team) or defend (Blue Team) various AWS services and infrastructure components. The game combines strategy, resource management, and a bit of luck to create an engaging learning experience about cloud security.

![Game Board](screenshots/game-board.png)

### 🎲 Game Mechanics

- **Turn-based Strategy**: Players alternate between Red Team (attackers) and Blue Team (defenders)
- **Resource Management**: Each card has a cost and requires strategic planning to play
- **Dice Rolling**: Success of actions is determined by dice rolls against card thresholds
- **Multiple Zones**: Different AWS services and infrastructure components to attack or defend

## 🛠️ Features

- Modern, dark-themed UI built with Material-UI
- Real AWS service-based gameplay mechanics
- Interactive game board with different security zones
- Dynamic card system with various attack and defense options
- Dice rolling simulation
- Score tracking and game state management

## 🎴 Cards

Each card represents a specific attack or defense action in the AWS environment. Cards include details about their cost, effect, and success requirements.

![Card Detail](screenshots/card-detail.png)

### Red Team Cards
- EC2 Password Data Theft
- Secrets Manager Batch Retrieval
- CloudTrail Deletion
- S3 Lifecycle Impairment
- DNS Query Logs Deletion
- Organization Escape
- EC2 User Data Execution
- SSM Command Execution
- Security Group Backdoor
- S3 Ransomware Attack

### Blue Team Cards
- GuardDuty Enhancement
- CloudTrail Immutability
- IAM Access Analyzer
- Organization SCP
- SSM Session Monitoring
- S3 Versioning
- EC2 Instance Connect
- DNS Firewall

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cloud-breach.git
cd cloud-breach
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) to play the game

## 🛡️ Game Rules

1. Players take turns, starting with the Red Team
2. On your turn:
   - Draw cards if needed
   - Play one card (pay the cost)
   - Roll dice to determine success
   - Apply card effects if successful
3. Game continues until one team achieves their victory condition

## 🔧 Technologies Used

- React
- TypeScript
- Material-UI
- Zustand (State Management)
- Framer Motion (Animations)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
