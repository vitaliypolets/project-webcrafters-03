# API Contract

Базова адреса: `/api`

## Формат успішної відповіді

```json
{
  "data": {},
  "message": "Success"
}
```

## Формат помилки

```json
{
  "status": 400,
  "message": "Validation error",
  "details": {}
}
```

## Auth

| Method | Route | Access | Owner |
|---|---|---|---|
| POST | `/auth/register` | Public | №2 |
| POST | `/auth/login` | Public | №3 |
| POST | `/auth/session` | Refresh token | №4 |
| DELETE | `/auth/session` | Private | №4 |

## Users

| Method | Route | Access | Owner |
|---|---|---|---|
| GET/PATCH | `/users/me` | Private | №5 |
| GET | `/users` | Public | №6 |
| GET | `/users/:userId` | Public | №7 |
| GET | `/users/:userId/articles` | Public | №8 |
| GET/POST/DELETE | `/users/me/bookmarks` | Private | №9 |

## Articles

| Method | Route | Access | Owner |
|---|---|---|---|
| GET | `/articles/:articleId` | Public | №10 |
| GET | `/articles` | Public | №11 |
| PATCH/DELETE | `/articles/:articleId` | Private | №12 |
| POST | `/articles` | Private | №13 |

## Правила

- Усі приватні endpoint-и використовують `authenticate`.
- Неправильний MongoDB id повертає 400.
- Відсутній ресурс повертає 404.
- Спроба змінити чужу статтю повертає 403.
- Повторний email або повторна закладка повертає 409 або узгоджену idempotent-відповідь.
- Пагінація повертає `page`, `perPage`, `totalItems`, `totalPages`, `hasNextPage`.
