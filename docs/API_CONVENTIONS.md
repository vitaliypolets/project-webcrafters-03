# API_CONVENTIONS.md

# API Conventions

Цей документ визначає єдині правила роботи з HTTP-запитами та API у проєкті **Harmoniq**.

У проєкті використовується така схема:

```text
Frontend
   ↓
Next.js Route Handlers
   ↓
Express Backend
   ↓
MongoDB
```

Next.js Route Handlers працюють як proxy/BFF між frontend і окремим Express Backend.

---

## HTTP Methods

| Метод | Призначення |
|---|---|
| `GET` | Отримання даних |
| `POST` | Створення нового ресурсу |
| `PATCH` | Часткове оновлення ресурсу |
| `PUT` | Повне оновлення ресурсу, якщо це передбачено API |
| `DELETE` | Видалення ресурсу |

---

## HTTP Status Codes

У проєкті використовуємо такі основні HTTP-коди:

| Код | Назва | Використання |
|---|---|---|
| `200` | OK | Успішний `GET`, `PATCH`, `DELETE` або інша успішна операція без створення нового ресурсу |
| `201` | Created | Ресурс успішно створено через `POST` |
| `204` | No Content | Успішна операція без тіла відповіді, якщо це передбачено endpoint |
| `400` | Bad Request | Некоректний запит або неправильний формат даних |
| `401` | Unauthorized | Користувач не авторизований або токен недійсний |
| `403` | Forbidden | Користувач авторизований, але не має права виконати операцію |
| `404` | Not Found | Ресурс або endpoint не знайдено |
| `409` | Conflict | Конфлікт даних, наприклад email уже зареєстрований |
| `422` | Unprocessable Entity | Дані не пройшли валідацію, якщо такий код використовується конкретним endpoint |
| `500` | Internal Server Error | Внутрішня помилка сервера |

---

## Формат успішної відповіді

Для успішної відповіді використовуємо передбачувану структуру.

Приклад:

```json
{
  "data": {
    "id": "..."
  },
  "message": "Success"
}
```

Для списку ресурсів:

```json
{
  "data": [],
  "message": "Success"
}
```

Якщо endpoint повертає pagination-дані, структура повинна бути узгоджена для всіх endpoint такого типу.

Приклад:

```json
{
  "data": [],
  "page": 1,
  "perPage": 10,
  "totalItems": 100,
  "totalPages": 10
}
```

---

## Формат помилки

Помилки повинні повертатися у зрозумілому та стабільному форматі.

Приклад:

```json
{
  "message": "Article not found"
}
```

Для validation errors допускається детальніша структура, якщо вона використовується однаково у відповідних endpoint.

Приклад:

```json
{
  "message": "Validation failed",
  "errors": {
    "title": "Title is required"
  }
}
```

---

## Правила для Route Handlers

Next.js Route Handlers не повинні дублювати бізнес-логіку Express Backend.

Route Handler повинен:

- отримати запит від frontend;
- за потреби прочитати cookies або auth-дані;
- передати запит у Express Backend;
- передати body, query parameters та headers;
- повернути frontend статус і дані, отримані від backend;
- коректно передати помилку backend.

Route Handler не повинен самостійно реалізовувати логіку, яка належить backend.

---

## Правила для Express Backend

Express Backend відповідає за:

- бізнес-логіку;
- авторизацію;
- валідацію серверних даних;
- роботу з MongoDB через Mongoose;
- перевірку прав доступу;
- формування HTTP status code;
- формування API response.

---

## Приклад GET-запиту

```http
GET /api/articles
```

Успішна відповідь:

```http
200 OK
```

```json
{
  "data": []
}
```

---

## Приклад POST-запиту

```http
POST /api/articles
```

Успішне створення:

```http
201 Created
```

```json
{
  "data": {
    "id": "..."
  }
}
```

---

## Приклад PATCH-запиту

```http
PATCH /api/users/me
```

Успішне оновлення:

```http
200 OK
```

```json
{
  "data": {
    "id": "..."
  }
}
```

---

## Приклад DELETE-запиту

```http
DELETE /api/users/me/bookmarks/:articleId
```

Успішне видалення:

```http
200 OK
```

або:

```http
204 No Content
```

Використовуємо один погоджений варіант для конкретного endpoint і не змінюємо його без узгодження.

---

## Правила для auth endpoint

Для endpoint авторизації:

- неправильний email або пароль → `401 Unauthorized`;
- відсутній або недійсний access token → `401 Unauthorized`;
- користувач не має прав на ресурс → `403 Forbidden`;
- email уже використовується під час реєстрації → `409 Conflict`.

---

## API Contract

Перед інтеграцією frontend і backend учасники повинні погодити:

- HTTP method;
- endpoint;
- path parameters;
- query parameters;
- request body;
- response body;
- HTTP status codes;
- формат error response.

Приклад:

```text
GET /api/articles/:id

Response:
200 OK

{
  "data": Article
}

Errors:
404 Not Found
500 Internal Server Error
```

---

## Зміна API Contract

Не змінюйте погоджений API Contract без повідомлення учасників, які від нього залежать.

Якщо зміна впливає на кілька feature або shared Route Handlers, її потрібно погодити до реалізації.

---

## Головне правило

Frontend, Next.js Route Handlers і Express Backend повинні використовувати однаковий погоджений API Contract.

Статус-коди, назви полів і структура response не повинні змінюватися без погодження.
