# financial-web

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Sass](https://img.shields.io/badge/Sass-1.99-CC6699?style=flat-square&logo=sass)

Frontend for the personal financial control application. Consumes the local API to display the income/expense dashboard, manage imported bank accounts, and categorize transactions.

---

## About

The decision to use **Next.js** goes beyond popularity — the App Router allows pages to be server components by default, and the directory-based routing makes the project straightforward to expand. **TypeScript** is used throughout to ensure the data contracts between frontend and backend are explicit and verified at development time.

Styling uses **Sass** without utility frameworks like Tailwind. This was intentional to maintain full control over the design system, with CSS variables and a "blueprint" aesthetic that gives the product a consistent identity.

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| **Node.js** | 20 |
| **npm** | Included with Node |

> Make sure the backend (`financial-api`) is running at `http://localhost:8080` before starting the frontend.

---

## Environment Setup

Create (or verify) the `.env.local` file at the root of the `web/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

> Variables prefixed with `NEXT_PUBLIC_` are embedded in the client bundle at build time. To point to a remote backend in production, simply change this value.

---

## Installation and Running

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Project Structure

```
src/
|-- app/                        <- Pages (Next.js App Router)
|   |-- page.tsx                <- Main dashboard (income, expenses, balance)
|   |-- accounts/
|   |   `-- page.tsx            <- Bank account management
|   `-- transactions/
|       `-- page.tsx            <- Transaction list by period
|
|-- components/                 <- Reusable UI components
|   |-- Header.tsx              <- Main navigation with privacy toggle
|   |-- Summary.tsx             <- Financial summary cards
|   |-- AccountList.tsx         <- Account list with sync button
|   |-- TransactionList.tsx     <- Transaction table with category selector
|   |-- CategorySelector.tsx    <- Dropdown for transaction categorization
|   |-- CategoryManagerModal.tsx <- Modal for category CRUD
|   |-- PeriodFilter.tsx        <- Period selector (month/year)
|   `-- DashboardFilters.tsx    <- Dashboard filters by category
|
|-- contexts/
|   `-- PrivacyContext.tsx      <- Global context to hide monetary values
|
|-- services/
|   `-- apiServices.ts          <- Abstraction layer for API calls
|
|-- lib/
|   `-- api.ts                  <- Centralized HTTP client (fetch wrapper)
|
`-- types/
    `-- index.ts                <- TypeScript interfaces (Account, Transaction, Category...)
```

---

## How the Frontend Communicates with the API

All API communication goes through two central files, preventing request logic from spreading across components.

### `lib/api.ts` — The HTTP client

A wrapper over the native `fetch` that handles HTTP errors, sets default headers, and reads the base URL from the environment:

```typescript
// Simplified example of what the client does
const response = await fetch(`${NEXT_PUBLIC_API_URL}${endpoint}`, options);
if (!response.ok) throw new Error(`HTTP ${response.status}`);
return response.json();
```

### `services/apiServices.ts` — The data services

Exports an `apiService` object with a method for each application operation. Any component that needs data imports from here — never calls fetch directly:

```typescript
apiService.getAccounts()
apiService.importAccounts(itemId)
apiService.syncAccount(pluggyAccountId)
apiService.getTransactions(startDate, endDate)
apiService.updateTransactionCategory(transactionId, categoryId)
apiService.getDashboardSummary(startDate, endDate)
apiService.getCategories()
apiService.createCategory(category)
apiService.updateCategory(id, category)
apiService.deleteCategory(id)
```

---

## Features

| Screen | Feature |
|---|---|
| **Dashboard** | Income, expense and balance summary for the period. Filters by category and month. |
| **Accounts** | Import accounts from a Pluggy Item ID. Trigger transaction sync per account. |
| **Transactions** | Period-based listing with manual categorization for each transaction. |
| **Privacy** | Global toggle (in the header) to hide all monetary values in the interface. |
