<div align="center">
  <img src="./public/vanilla/assets/images/logo.svg" alt="TwOP Architecture Logo" width="150" />
  <h1>TwOP Architecture</h1>
  <p><b>The Two Origins Pattern</b></p>
  <p>A universal, strictly-decoupled architectural standard for building highly secure, minimalist web applications.</p>
</div>

---

## 🏗️ What is TwOP?

**TwOP (Two Origins Pattern)** is a strict architectural philosophy that physically and logically separates a web application into two distinct, uncompromising boundaries:

1. **The Private Origin (Backend):** Handles all business logic, database connections, authentication, and secure API routing. *It never generates or renders user interfaces (No SSR).*
2. **The Public Origin (Frontend):** A standalone presentation layer comprised entirely of static, compiled, or "dumb" assets (HTML, CSS, JS, WASM). *It possesses zero secure processing power and only communicates via the API.*

By enforcing this strict boundary, TwOP eliminates monolithic coupling, prevents logic bleed, and guarantees that your backend can securely serve web apps, mobile apps, and third-party integrations simultaneously without rewriting code.

---

## 🚀 The CLI Tool (create-twop-app)

TwOP is no longer just a boilerplate—it is a dynamic generator. You can instantly scaffold a perfectly decoupled TwOP project using your favorite modern frameworks.

### Generate a new project:
```bash
# Run the generator locally
node cli.js
```

The CLI will prompt you to assemble your architecture from our highly optimized parts bin.

### 📦 Supported Private Origins (Backends)
- **Node.js (Vanilla)** - Zero dependencies, pure native `http`.
- **Node.js (Express)** - The industry standard, pre-configured for TwOP.
- **Node.js (Fastify)** - High-performance async routing.
- **Python (FastAPI)** - Modern, fast, API-first Python.
- **Python (Flask)** - Lightweight and battle-tested.
- **Go (Native)** - Blazing fast, compiled standard library Go.
- **Go (Fiber)** - Express-style routing for Go.
- **Rust (Axum)** - Safe, concurrent, and incredibly fast.

### 🎨 Supported Public Origins (Frontends)
*Note: TwOP strictly forbids SSR meta-frameworks (Next.js, Nuxt.js) that violate the Two Origins boundary.*
- **Vanilla JS** - Pure HTML, CSS, and JS (Class-based).
- **Vue 3 + Vite** - Lightweight and progressive SPA.
- **React + Vite** - The component-driven industry standard.
- **Svelte + Vite** - Compiled, no-virtual-DOM performance.
- **SolidJS + Vite** - Fine-grained reactivity.
- **Alpine + Tailwind** - Zero-build-step declarative markup.

---

## 📐 The Directory Standard

No matter which frameworks you choose, the generated output will always strictly follow the TwOP directory standard:

```text
my-twop-app/
├── package.json / go.mod / requirements.txt  # Backend dependencies
├── app.js / main.go / main.py                # Backend Entry Point
├── private/                                  # SECURE LOGIC
│   ├── routes/                               # API Endpoint definitions
│   ├── services/                             # Heavy business logic
│   ├── tools/                                # Internal utility scripts
│   └── helpers/                              # Reusable backend functions
└── public/                                   # STATIC PRESENTATION
    ├── index.html                            # Frontend Entry Point
    ├── package.json / vite.config.js         # Frontend dependencies (if Vite)
    ├── src/                                  # Frontend component logic
    └── assets/                               # Static images, styles, uploads
```

---

## 🤝 The Developer Contract

To maintain the TwOP standard, developers must agree to the following rules when modifying the generated code:

1. **The Serving Rule:** The Private Origin must always serve the `public/` directory statically.
2. **The SPA Fallback:** If a requested route is not found in the `/api`, the Private Origin must fall back to serving `public/index.html` so client-side routers (Vue Router, React Router) function correctly.
3. **The Proxy Rule (Dev):** During development, frontend build tools (like Vite) must proxy all `/api` requests to the Private Origin's local port to avoid CORS issues.
4. **No Logic Bleed:** Never place API keys, database credentials, or secure processing algorithms inside the `public/` directory.

## 📄 License
This project is fully open source under the MIT License.