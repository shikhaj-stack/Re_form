# RE-FORM // Industrial Waste to Wealth ♻️🏭

[![Next.js](https://img.shields.io/badge/Next.js-14.2.18-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

An enterprise B2B circular economy platform transforming heavy industrial manufacturing byproducts (foundry silica sand, fly ash, post-industrial polymers, glass cullet, and metallurgical slag) into high-value functional commodities, certified construction pavers, and architectural composites.

---

## 🌟 Platform Highlights

- 🧠 **Algorithmic Waste Assessment Engine**: Computes material recoverability percentage, contamination risks, and maps to proprietary circular conversion pathways.
- ⚡ **Proprietary Conversion Matrix**: Multi-stage industrial transformation routes (e.g. *Foundry Sand + Suitable Polymer -> IS 15658 Certified Pavers*).
- ⛓️ **Append-Only Provenance Ledger**: SHA-256 cryptographic material tracking tracing raw byproduct extraction through batch synthesis to final commercial product.
- 🛒 **B2B Circular Marketplace**: Transparent byproduct exchange facilitating allocation, procurement bidding, and demand matchmaking between factories and processors.
- 💰 **ROI & Economic Valuation Engine**: Quantifies cost avoidance, gross revenue, processing OPEX, and net margin recovery.
- 🌿 **Comparative Life-Cycle Analysis (LCA)**: Quantifies avoided landfill tonnage, net CO2e offsets, and virgin aggregate preservation.
- 🛡️ **Secure Admin & Analytics Command Node**: Role-based access control (`ADMIN` privilege), interactive verification governance, 7 accessible Recharts data visualizers, and immutable audit logging.

---

## 🏗️ System Architecture & Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Database & ORM**: [Prisma](https://www.prisma.io/) with SQLite (Development) / PostgreSQL (Production)
- **Styling & Design System**: Tailwind CSS, Framer Motion, Lucide Icons, Glassmorphism, Dark Tech Theme
- **Data Visualizations**: Recharts
- **Security & RBAC**: JWT HTTP-only Cookies, Argon/Bcrypt Hashing, Role-Based Access Control (`FACTORY`, `PROCESSOR`, `ADMIN`), Rate Limiting, Sanitized Audit Trail

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18.17.0
- npm >= 9.0.0

### 1. Clone the Repository
```bash
git clone https://github.com/shikhaj-stack/Re_form.git
cd Re_form
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="super-secret-jwt-key-min-32-chars-reform-b2b-secure-local"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
RATE_LIMIT_MAX_REQUESTS="60"
RATE_LIMIT_WINDOW_MS="60000"
```

### 4. Initialize & Seed Database
```bash
# Push database schema
npx prisma db push

# Populate conversion pathways, demo organizations, and provenance batches
npm run prisma:seed
```

### 5. Launch Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo User Accounts

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@reform.eco` | `Admin1234!` | Full Admin Command Node (`/admin`) |
| **Factory Owner** | `factory@demofoundry.com` | `Demo1234!` | Waste Stream Registration & Batch Tracker |
| **Processor Facility** | `processor@ecomat.com` | `Demo1234!` | Marketplace Procurement & Processing Unit |

---

## 📁 Repository Structure

```
RE_FORM/
├── app/                        # Next.js App Router Pages & API Endpoints
│   ├── (auth)/                 # Login & Registration views
│   ├── admin/                  # Secure Admin Command Node & Analytics
│   ├── api/                    # Backend Route Handlers & RBAC APIs
│   ├── assessment/             # Algorithmic Waste Assessment Tool
│   ├── calculator/             # Dynamic ROI & Economic Engine
│   ├── conversion/             # Conversion Matrix & Pathway Explorer
│   ├── impact/                 # Environmental LCA Telemetry
│   ├── journey/                # 3-Minute Interactive Demo Journey
│   ├── marketplace/            # B2B Byproduct Exchange
│   ├── process/                # Visual Stage Process Flow Graph
│   ├── product/                # RE-FORM Paver Specifications & IS 15658 Cert
│   ├── tracking/               # Provenance Ledger & Batch Tracking
│   └── layout.tsx              # Root Layout & Global Glassmorphic Backgrounds
├── components/                 # Reusable UI & Layout Components
│   ├── admin/                  # Recharts Analytics Grid
│   ├── conversion/             # Pathway Matrix Components
│   ├── layout/                 # Global Navbar & Footer
│   └── ui/                     # Badges, Buttons, Cards, Inputs, Metrics
├── lib/                        # Core Business Logic & Infrastructure
│   ├── auth/                   # JWT Session, Cookie Management & RBAC
│   ├── calculations/           # LCA & Economic Recovery Calculators
│   ├── db/                     # Prisma Client & Database Error Wrappers
│   ├── security/               # Rate Limiting & API Error Handlers
│   ├── services/               # Entity Service Layer & Audit Logging
│   └── validation/             # Zod Schemas
├── prisma/                     # Database Schema & Seed Data
│   ├── schema.prisma           # Relational Models
│   └── seed.ts                 # Multi-Tenant Seed Script
└── types/                      # TypeScript Global Type Definitions
```

---

## 🔒 Security & RBAC Architecture

- **Strict Route Protection**: Protected APIs verify role claims before executing mutations (`requireRole(["ADMIN"])`, `assertOwnership`).
- **Zero-Credential Leakage**: Passwords, hashes, and authorization tokens are stripped at the ORM layer.
- **Rate Limiting**: Sliding memory-store limiter guarding authentication and mutation endpoints.
- **Immutable Audit Logging**: Every critical lifecycle transition, verification toggle, or marketplace moderation writes an immutable audit record with actor ID, IP address, and sanitized metadata.

---

## 📄 License
This project is licensed under the MIT License.
