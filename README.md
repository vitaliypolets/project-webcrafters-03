
# project-webcrafters-03

Командний Fullstack-проєкт **Harmoniq**.

## Архітектура

Один monorepo:

```text
project-webcrafters-03/
├── frontend/   # Next.js
├── backend/    # Node.js + Express
├── docs/
└── .github/
```

## Початок роботи

```bash
npm install
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
npm run dev
```

## Головні документи

- `docs/OWNERSHIP_MAP.md` — маршрути, Frontend-папки, Next Route Handlers і Backend-папки кожного учасника.
- `docs/API_CONTRACT.md` — узгоджений формат API.
- `docs/TEAM_LEAD_PLAN.md` — порядок роботи Team Lead.
- `docs/DEFINITION_OF_DONE.md` — критерії готовності.

## Git flow

Учасники створюють feature-гілки від `develop` і відкривають Pull Request у `develop`. Прямі push у `main` та `develop` заборонені.
