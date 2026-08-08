# Практичний план роботи Team Lead

## Етап 1. Підготувати репозиторій

1. Створити GitHub-репозиторій `harmoniq`.
2. Завантажити цей starter у репозиторій.
3. Створити гілку `develop` від `main`.
4. У GitHub → Settings → Branches захистити `main`:
   - заборонити прямий push;
   - вимагати Pull Request;
   - вимагати успішний CI;
   - заборонити merge без review.
5. Видати доступ усім 13 учасникам.
6. Замінити номери учасників у `docs/OWNERSHIP_MAP.md` на їхні імена та GitHub-логіни.

## Етап 2. Перевірити локальний запуск

1. Створити env-файли з прикладів.
2. Заповнити MongoDB URL і секрети токенів.
3. Запустити `npm install`.
4. Запустити `npm run dev`.
5. Перевірити:
   - Frontend відкривається на порту 3000;
   - Backend health route відповідає на порту 3001;
   - Backend підключився до MongoDB;
   - CORS дозволяє запити з Frontend.

## Етап 3. Зафіксувати архітектуру

> Frontend працює на TypeScript (`.ts`, `.tsx`). Окремий Express Backend працює на JavaScript (`.js`). Backend `*.types.ts` не створюємо; `validation.js` залишається обов’язковою частиною серверної перевірки даних.

1. Не дозволяти створювати дублікати загальних компонентів.
2. Спільні компоненти тримати у `frontend/src/components`.
3. Код конкретної фічі тримати у `frontend/src/features/<feature>`.
4. Backend-код endpoint-а тримати у власному модулі:
   - `route.js`;
   - `controller.js`;
   - `service.js`;
   - `validation.js`.
5. Спільні моделі та middleware змінювати тільки через погодження Team Lead.
6. Зафіксувати route створення статті: `/articles/create`.

## Етап 4. Погодити API до написання сторінок

1. Заповнити `docs/API_CONTRACT.md`.
2. Для кожного route погодити:
   - метод;
   - URL;
   - public/private;
   - params/query/body;
   - формат відповіді;
   - статуси помилок.
3. Frontend-учасник не вигадує поля відповіді самостійно.
4. Backend-учасник не змінює контракт без повідомлення залежних учасників.

## Етап 5. Видати завдання

1. Кожному учаснику створити одну GitHub Issue.
2. В Issue вставити:
   - дві Frontend-фічі;
   - один Backend route;
   - папки, які дозволено змінювати;
   - критерії готовності;
   - залежності від інших учасників.
3. Гілка створюється від актуальної `develop`.
4. Назва гілки: `feat/<feature-name>`.

## Етап 6. Порядок розробки

### Хвиля 1

- Team Lead: core, env, CI, API-контракт.
- Учасники auth: Register, Login, Session.
- Учасники shared UI: Layout, Header, Article components.

### Хвиля 2

- Users, Authors, Bookmarks API.
- Articles list/details/create API.
- Frontend-сторінки підключають mock-дані лише тимчасово.

### Хвиля 3

- Інтеграція реальних запитів.
- Profile, Create Article, recommendations, Load More.

### Хвиля 4

- Адаптивність.
- SEO metadata.
- Негативні сценарії.
- Додаткові завдання лише після базової версії.

## Етап 7. Перевірка Pull Request

Перед review Team Lead перевіряє:

1. PR спрямований у `develop`.
2. Зміни не виходять за межі папок учасника.
3. Немає `.env`, `node_modules`, зайвих lock-файлів.
4. Немає `console.log`, `any` без пояснення та закоментованого коду.
5. Frontend:
   - Mobile First;
   - 320/375/768/1440 px;
   - loading/error/empty;
   - `next/image`;
   - CSS Modules;
   - metadata для сторінок.
6. Backend:
   - route/controller/service/validation;
   - валідація params/query/body;
   - правильні HTTP-статуси;
   - приватні маршрути мають `authenticate`;
   - password і токени не повертаються.
7. `npm run lint` і `npm run build` успішні.
8. Є інструкція перевірки у PR.

## Етап 8. Інтеграція

1. Merge виконувати невеликими порціями.
2. Після кожного Backend PR оновлювати API-контракт.
3. Після кожного Frontend PR перевіряти маршрути вручну.
4. Після merge auth-модулів перевірити повний сценарій:
   - register → photo → login/session → logout.
5. Після merge articles-модулів перевірити:
   - список;
   - фільтри;
   - detail;
   - create;
   - edit/delete;
   - bookmarks.

## Етап 9. Фінальна перевірка

1. Очистити базу та виконати seed.
2. Перевірити всі маршрути з `docs/ROUTES.md`.
3. Перевірити помилки 400, 401, 403, 404, 409 і 500.
4. Запустити production build.
5. Перевірити deployed Frontend і Backend.
6. Лише після цього виконати PR `develop` → `main`.
