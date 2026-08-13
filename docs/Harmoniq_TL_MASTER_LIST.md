# Harmoniq --- TL Master List

## Централізовано реалізовано та поточний стан проєкту

Цей документ фіксує shared/core зміни, які вже централізовано
реалізовані Team Lead, правила для учасників та блоки, які ще
залишаються в роботі.

## 1. Структура monorepo

``` text
project-webcrafters-03/
├── frontend/
├── backend/
├── docs/
├── package.json
└── ...
```

Frontend і backend знаходяться в одному repository, але мають окремі
залежності та зони відповідальності.

## 2. Централізована структура Frontend

``` text
frontend/src/
├── app/
├── components/
├── lib/
├── services/
├── store/
├── types/
└── ...
```

Учасники не створюють альтернативну глобальну структуру без узгодження з
TL.

## 3. Централізована структура Backend

``` text
backend/src/
├── config/
├── middlewares/
├── models/
├── modules/
├── routes/
├── utils/
└── ...
```

Feature-модулі організовані за зонами `auth`, `articles`, `users`.

## 4. Backend переведено з TypeScript на JavaScript

Backend feature-файли централізовано переведені з `.ts` на `.js`, щоб
команда використовувала один узгоджений стек.

## 5. Express bootstrap

Централізовано підключені `pinoHttp`, `cors`, `express.json`,
`cookieParser`, `apiRouter`, `notFound`, `errorHandler`.
Feature-учасники не створюють власний Express bootstrap.

## 6. Центральний API Router

API будується від `/api`: `/api/auth/...`, `/api/articles/...`,
`/api/users/...`. Feature routers підключаються через центральний
routing layer.

## 7. Shared backend middleware

Закладені спільні `controllerWrapper`, `errorHandler`, `notFound`.
Controllers не повинні дублювати глобальний механізм обробки помилок.

## 8. MongoDB / Mongoose infrastructure

Є централізовані `User.js` та `Session.js`. User містить `name`,
`email`, `passwordHash`, `avatarUrl`, `avatarPublicId`, `savedArticles`,
`articlesAmount`.

`passwordHash` має `select: false`, тому Login використовує:

``` js
User.findOne({ email }).select('+passwordHash');
```

## 9. Session model

Session використовує:

``` text
userId
refreshTokenHash
expiresAt
```

Raw refresh token у MongoDB не зберігається.

## 10. Централізований Axios

Закладена спільна Axios infrastructure. Учасники не створюють окремі
`axios.create()` зі своїми правилами. Це важливо для auth cookies та
єдиної поведінки API-запитів.

## 11. TanStack React Query Provider

Централізовано налаштований `QueryClientProvider` через `AppProviders`:

``` tsx
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});
```

## 12. Global AppProviders

Єдина точка providers містить `QueryClientProvider`, `Toaster` та
`children`.

## 13. Global Toaster

`react-hot-toast` винесений глобально:

``` tsx
<Toaster
  position="top-right"
  toastOptions={{ duration: 4000 }}
/>
```

Feature-код використовує `toast.success()` / `toast.error()`, не додаючи
власний `<Toaster />`.

## 14. Shared UI / Layout infrastructure

Закладені загальні layout/providers/shared UI механізми. Альтернативні
глобальні providers/layout без узгодження не створюються.

## 15. Zustand auth.store

Базовий auth state:

``` ts
user: User | null;
accessToken: string | null;
isAuthenticated: boolean;
isRefreshing: boolean;
```

Actions: `setSession()`, `clearSession()`, `setRefreshing()`.

## 16. Централізована генерація JWT

Створено:

``` text
backend/src/modules/auth/shared/authTokens.js
```

Shared API:

``` js
createAccessToken(user);
createRefreshToken(user);
```

## 17. Access Token contract

``` text
payload: { userId, email }
TTL: 15m
secret: ACCESS_TOKEN_SECRET
```

## 18. Refresh Token contract

``` text
payload: { userId }
TTL: 30d
secret: REFRESH_TOKEN_SECRET
```

## 19. Централізоване створення Session

Створено:

``` text
backend/src/modules/auth/shared/authSession.js
```

Shared API:

``` js
createAuthSession(userId, refreshToken);
```

## 20. Що робить createAuthSession()

Функція робить `bcrypt.hash(refreshToken, 10)`, формує
`refreshTokenHash`, задає `expiresAt` на 30 днів і виконує:

``` js
Session.create({
  userId,
  refreshTokenHash,
  expiresAt,
});
```

## 21. session.service.js переведений на shared auth

JWT:

``` js
const newAccessToken = createAccessToken(user);
const newRefreshToken = createRefreshToken(user);
```

Session:

``` js
const newSession = await createAuthSession(user._id, newRefreshToken);
```

## 22. Session validation збережена

`bcrypt.compare(refreshToken, session.refreshTokenHash)` залишається в
Session service. У shared винесена саме повторювана логіка створення.

## 23. Session rotation

``` text
refreshToken cookie + sessionId cookie
↓
Session lookup
↓
bcrypt.compare()
↓
User lookup
↓
delete old Session
↓
createAccessToken() + createRefreshToken()
↓
createAuthSession()
↓
new refreshToken + new sessionId + new accessToken
```

## 24. Cookies contract

``` text
refreshToken → httpOnly cookie
sessionId → httpOnly cookie
```

Параметри: `httpOnly: true`, `secure` у production, `sameSite: strict`,
expiration 30 днів.

## 25. Access token не зберігається в cookie

Backend повертає access token у JSON, frontend тримає його в
`auth.store`. Refresh token та sessionId передаються через httpOnly
cookies.

## 26. Login contract

``` text
email + password
↓
User.findOne({ email }).select('+passwordHash')
↓
bcrypt.compare()
↓
createAccessToken()
createRefreshToken()
↓
createAuthSession()
↓
cookies + JSON response
```

## 27. Login response contract

``` json
{
  "data": {
    "user": {
      "_id": "USER_ID",
      "name": "User Name",
      "email": "user@example.com",
      "avatarUrl": null,
      "articlesAmount": 0
    },
    "accessToken": "JWT_ACCESS_TOKEN"
  },
  "message": "Successfully logged in!"
}
```

## 28. Що Login не повертає

Не повертаються `passwordHash`, `avatarPublicId`, `refreshToken`,
`sessionId`.

## 29. Що Login не реалізує повторно

Не дублюємо `jwt.sign()`, `bcrypt.hash(refreshToken)`,
`Session.create()`. Використовуємо `createAccessToken()`,
`createRefreshToken()`, `createAuthSession()`.

## 30. Session contract

Refresh endpoint отримує `refreshToken` та `sessionId` із cookies і
повертає:

``` json
{
  "data": {
    "accessToken": "NEW_ACCESS_TOKEN"
  },
  "message": "Successfully refreshed a session!"
}
```

## 31. Logout contract

За `sessionId` видаляється Session та очищаються `refreshToken` і
`sessionId`. Access token cookie не є частиною узгодженої архітектури.

## 32. Register має використовувати shared auth

Register також не повинен дублювати JWT generation, refresh-token
hashing або `Session.create()`.

``` text
Register ─┐
Login ────┼── authTokens.js + authSession.js
Session ──┘
```

## 33. Shared auth --- TL-owned

`backend/src/modules/auth/shared/` є shared/TL infrastructure. Учасники
використовують готовий API, але не змінюють контракт без узгодження.

## 34. Синхронізація feature-гілок з develop

``` bash
git fetch origin
git merge origin/develop
```

Якщо є незакомічені зміни --- спочатку WIP commit або `git stash`.

## 35. Git workflow

``` text
feature branch → PR → Review → develop
```

TL shared changes:

``` text
chore/project-setup → PR → develop
```

## 36. Роль main

`develop` є integration branch під час активної розробки. `main`
використовується для стабільної/релізної версії.

## 37. TL документація

``` text
docs/FILE_TREE.txt
docs/OWNERSHIP_MAP.md
docs/Harmoniq_TEAM_LEAD_GUIDE.md
docs/TEAM_LEAD_PLAN.md
docs/TECHNOLOGY_STACK.md
```

## 38. Ownership

Кожен учасник працює у своїй feature-зоні, а shared/core infrastructure
контролюється TL. До shared/core належать Axios, Providers, Toaster,
authTokens, authSession, global layout, shared UI.

## 39. Review / PR workflow

`Review / PR` означає:

``` text
feature завершена
↓
PR
↓
TL review
↓
lint/build
↓
Approve
↓
Merge у develop
```

## 40. TL checklist для PR

``` text
✓ тільки файли ownership учасника
✓ немає випадкових shared/core змін
✓ ТЗ виконане
✓ imports/exports коректні
✓ немає дублювання shared logic
✓ немає невирішених конфліктів
✓ lint PASS
✓ build PASS
```

## 41. Блокери #8.2 ProfilePage

Для завершення потрібні Session restore, protected route mechanism,
`GET /api/users/me` та current-user response contract.

## 42. Прямий блокер --- Session

Потрібно завершити `#4.4 Express Backend — Session`, що дасть
backend-частину відновлення access token.

## 43. Прямий блокер --- /users/me

Потрібно реалізувати `GET /api/users/me`: `meRouter`, controller,
service, auth, response contract та прибрати `501`.

## 44. Protected route --- shared/TL задача

Потрібен один canonical mechanism для private routes, зокрема
`/profile`. ProfilePage не повинна створювати власну незалежну
auth-перевірку.

## 45. Current-user flow

Цільова схема:

``` text
App start
↓
session restore
↓
accessToken
↓
GET /api/users/me
↓
User
↓
auth.store
↓
private UI
```

## 46. Що вже готове

``` text
✅ project structure
✅ frontend/backend separation
✅ backend JS migration
✅ Express bootstrap
✅ Mongo/Mongoose base
✅ shared middleware base
✅ Axios base
✅ React Query Provider
✅ global AppProviders
✅ global Toaster
✅ shared UI/layout base
✅ auth.store base
✅ User model
✅ Session model
✅ JWT contract
✅ authTokens.js
✅ authSession.js
✅ Session refresh service integration with shared auth
✅ Login contract
✅ Session contract
✅ auth cookie contract
✅ ownership rules
✅ Git/PR workflow
```

## 47. Що ще не готове / у роботі

``` text
⏳ #3 Login — feature реалізація/Review
⏳ #4 Session — feature завершення/Review
⏳ Register integration з shared auth — перевірити
⏳ GET /api/users/me
⏳ meRouter integration
⏳ current-user response contract
⏳ frontend session restore
⏳ canonical protected-route mechanism
⏳ ProfilePage real current-user integration
⏳ #8.2 повне завершення
```

## Підсумкова архітектура

``` text
                         DEVELOP
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
       FRONTEND          BACKEND             DOCS
          │                 │
    AppProviders          Express
       │    │               │
       │    └─ Toaster      ├─ Models
       │                    │   ├─ User
       └─ QueryClient       │   └─ Session
                            │
                          modules
                            │
                           auth
                            │
              ┌─────────────┼─────────────┐
              │             │             │
           Register       Login        Session
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                         shared
                     ┌──────┴──────┐
                     │             │
                authTokens.js  authSession.js
```

## Наступний централізований блок

``` text
Session
↓
SESSION RESTORE
↓
auth.store
↓
GET /users/me
↓
CURRENT USER
↓
PROTECTED ROUTES
↓
/profile
↓
#8.2 ProfilePage UNBLOCKED
```

**Призначення документа:** актуальний TL master-list --- що вже
централізовано реалізовано, які правила обов'язкові для
feature-учасників і які shared-залежності ще потрібно закрити.
