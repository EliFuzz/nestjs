# NestJS DDD Project

A NestJS application following Domain-Driven Design (DDD) principles with a feature-based folder structure.

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm
- Docker (for database)

### Installation

1. Install dependencies:

```bash
pnpm i
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Init container:

```bash
docker-compose up -d
```

4. Start the development server:

```bash
pnpm start:dev
```
