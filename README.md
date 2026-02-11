# DevVault

### [🌐 View Live Demo](https://dev-vault-web.vercel.app/)
**DevVault** is a high-performance, enterprise-ready code snippet orchestrator. It bridges the gap between secure, private storage and global knowledge sharing—delivered through a precision-engineered, glassmorphic interface.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/-TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## ✨ Core Value Propositions

* 🔐 **Granular Access Control**: Seamless JWT-backed authentication. Toggle between **Private Vaults** for sensitive logic and **Public Discovery** for community contributions.
* 🚀 **PrismLight Syntax Engine**: Zero-latency highlighting for 17+ languages (Rust, Go, TS, etc.), optimized for minimal main-thread blocking.
* 📄 **High-Density Data Handling**: Backend-orchestrated infinite scroll and paginated streams designed for thousands of entries without performance degradation.
* ⌨️ **The "SmartTextarea" Editor**: A developer-centric editing experience featuring native Tab-interceptors and automated **Unsaved Change Protection**.
* 📊 **Productivity Analytics**: Real-time dashboarding to visualize language distribution and quick-access pinned snippets.
* 🌓 **Future-Proof Stack**: Leveraging **React 19** and **Next.js 16** for near-zero Cumulative Layout Shift (CLS) and native-level performance.

---

## 🛠️ Tech Stack & Tooling

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js) | App Router & Server Components |
| **State** | ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=react-query&logoColor=white) | Server-state synchronization |
| **Styling** | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=flat-square&logo=tailwind-css) | JIT Glassmorphism & UI Consistency |
| **Validation** | ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod) | Schema-driven data integrity |
| **Components** | **Shadcn UI** | Accessible Radix-based primitives |

---

## 🏗️ Domain-Driven Architecture

DevVault follows a **Feature-Based Modular Architecture**. All core logic is encapsulated within the `features/` directory to ensure high maintainability and prevent logic leakage across domains.

```text
src/
├── app/              # Next.js App Router (Routes & Layouts)
├── components/       # Shared UI Atoms (Buttons, Inputs)
├── features/         # Domain-Specific Logic
│   ├── auth/         # JWT Login, Logout, Middleware
│   ├── snippets/     # Vault Grid, Editor, Syntax Logic
│   └── profile/      # Analytics, User Settings
├── hooks/            # Global custom hooks
└── lib/              # Shared utility functions & Axios config
```
- Architecture Tip: By co-locating hooks, services, and schemas within their respective feature folders, I ensure that the system remains scalable as more complex snippet management tools are added.
