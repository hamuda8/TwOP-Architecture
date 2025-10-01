<img src="./public/assets/images/logo.svg" alt="top architecture's logo" width="150" /><br />

# TwOP Architecture

TwOP Architecture is a **vanilla-first, minimalist, and highly organized architecture** for building modern web applications using **VanillaJS**, **NodeJS**, and optionally **ExpressJS**. It emphasizes **separation of concerns**, maintainability, and simplicity, while still supporting optional libraries, schemas, and GraphQL if desired.

---

## **What is TwOP?**

**TwOP = Two Origins Principle**
- **Two \{P\}s:** **Private** (backend) and **Public** (frontend)  
- Every project using TwOP strictly separates **backend code** from **frontend code**.  
- Encourages **clarity, modularity, and scalability** without relying on heavy frameworks.  

---

## **Key Principles**

1. **Vanilla-First**:  
   - Use minimal libraries only if absolutely necessary.  
   - Official drivers and libraries of the services or database being used, as well as ExpressJS are supported, but unofficial libraries are discouraged.

2. **Clear Separation of Concerns**:  
   - **Private (backend)** contains services, routes, optional models, and helpers.  
   - **Public (frontend)** contains static files: scripts (JavaScript), markup (HTML), styles (CSS), and assets.  

3. **Optional Models & Schemas**:  
   - Schemas are not required.  
   - Optional if your database supports them or if you want to enforce structure.  

4. **Flexible Frontend & Backend**:  
   - Frontend generates views via vanilla JS or static HTML.  
   - Backend focuses on data handling and business logic.  
   - Supports REST or GraphQL (optional). 
   - Supports the dotenv library, where the .env file should always be stored in the /private directory.

---

## **Project Structure**

```
ProjectRoot/
├── private/               # Backend folder
│   ├── models/            # Optional data schemas
│   ├── routes/            # Route handlers
│   ├── services/          # Logic functions
│   └── helpers.js         # Utility functions (if any)
├── public/                # Frontend folder
│   ├── assets/            # Assets used
│   ├── markup/            # HTML files
│   ├── scripts/           # JavaScript files
│   └── styles/            # Contains all the CSS files
├── app.js                 # Backend entry point
├── LICENSE
├── package.json
└── README.md
```

## Liscense
This project is fully open source under the MIT License.