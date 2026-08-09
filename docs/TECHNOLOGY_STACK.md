# Стек технологій — Harmoniq

| Категорія | Технології |
|---|---|
| **Frontend** | HTML5, CSS3, TypeScript, React, Next.js 15 (App Router) |
| **Frontend API layer** | Next.js Route Handlers (`route.ts`) як proxy/BFF |
| **Backend** | Node.js, Express, JavaScript (ES6+), MongoDB, Mongoose |
| **Робота з API** | REST API, Axios |
| **Авторизація** | JWT, Bcrypt, cookies/session flow згідно API contract |
| **Валідація Frontend** | Formik + Yup згідно ТЗ |
| **Валідація Backend** | Runtime validation у `*.validation.js`; Mongoose schema validation |
| **Стилізація** | CSS Modules, modern-normalize, Mobile First |
| **Інструменти** | Git, GitHub, npm, ESLint, Prettier, Visual Studio Code |
| **Дизайн** | Figma |

## Зафіксоване правило

- Frontend: `.ts` та `.tsx`.
- Next.js Route Handlers належать до frontend/Next.js шару і залишаються `route.ts`.
- Окремий Express Backend: тільки `.js`.
- На Express Backend не створюємо `*.types.ts`.
- `*.validation.js` — це не TypeScript-типізація; це серверна перевірка даних під час виконання.
- Не додаємо TypeScript у Backend без окремого погодження Team Lead і ментора.

## Архітектура запитів

```text
Frontend (Next.js + TypeScript)
        ↓
Next.js Route Handlers / BFF (route.ts)
        ↓
Express Backend (Node.js + JavaScript)
        ↓
MongoDB / Mongoose
```
