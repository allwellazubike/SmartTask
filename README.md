## 🧠 About SmartTask
SmartTask is an AI-augmented task management application designed to eliminate the friction of manual task entry. By leveraging the Groq API, the application parses natural language commands into structured database entries, automatically assigning categories, due dates, and priority metrics. 

The core feature is the **Focus Mode**, which uses a custom P-Rate algorithm `(Importance * Urgency) / TimeRemaining` to dynamically sort the user's dashboard, ensuring the most critical tasks are always pinned to the top. Wrapped in a responsive, "Minimalist Luxury" UI design system.

### ⚡ Tech Stack
* **Frontend:** React, TypeScript, Tailwind CSS, Vite, Axios, Recharts (Analytics)
* **Backend:** Node.js, Express, TypeScript, JWT Authentication
* **Database & ORM:** PostgreSQL (Neon), Prisma
* **AI Integration:** Groq API (LLM Parsing & Generation)
* **Deployment:** Pxxl App