# Структура БД та Article Contract

## 1. Загальна інформація

У проєкті централізовано зафіксовано актуальну структуру бази даних для `User` та `Article`.

Тестові дані, надані в ТЗ, приведено до єдиного актуального контракту.

Основна мета:

- визначити єдиний `Article contract` для всієї команди;
- привести тестові дані MongoDB до актуальної структури;
- зберегти коректні зв'язки між `User` та `Article`;
- виключити використання різних назв полів у різних feature;
- забезпечити однакову структуру даних для frontend та backend;
- централізувати зміни структури БД у TL/shared core зоні.

---

## 2. Основні колекції

На поточному етапі використовуються:

```text
users
articles
```

Основний зв'язок:

```text
User
│
│ _id
│
└──────────────┐
               │ authorId
               ▼
            Article
```

Один `User` може бути автором багатьох `Article`.

Кожна `Article` належить одному `User`.

---

## 3. Зв'язок Article → User

У `Article` використовується:

```js
authorId: {
  type: Schema.Types.ObjectId,
  ref: 'User',
  required: true,
}
```

Тобто:

```text
Article.authorId → User._id
```

Для отримання інформації про автора можна використовувати Mongoose `populate()`:

```js
.populate('authorId', 'name avatarUrl')
```

Ім'я автора не повинно бути окремим джерелом істини всередині `Article`.

---

## 4. Зв'язок User → saved Articles

У `User` використовується:

```js
savedArticles: [
  {
    type: Schema.Types.ObjectId,
    ref: 'Article',
  },
];
```

Тобто:

```text
User.savedArticles[] → Article._id
```

Цей зв'язок використовується для збережених користувачем статей / bookmarks.

---

# 5. Актуальний Article Contract

Усі frontend та backend feature повинні використовувати такі поля:

```text
_id
title
description
article
imageUrl
imagePublicId
publicationDate
authorId
viewsCount
category
```

Службові Mongoose timestamps:

```text
createdAt
updatedAt
```

можуть бути присутні для документів, створених через актуальну модель.

---

## 6. Призначення полів Article

| Поле              | Тип           | Призначення             |
| ----------------- | ------------- | ----------------------- |
| `_id`             | ObjectId      | MongoDB ID статті       |
| `title`           | String        | Заголовок статті        |
| `description`     | String        | Короткий опис статті    |
| `article`         | String        | Повний текст статті     |
| `imageUrl`        | String        | URL зображення          |
| `imagePublicId`   | String / null | Cloudinary Public ID    |
| `publicationDate` | Date          | Дата публікації         |
| `authorId`        | ObjectId      | Посилання на `User._id` |
| `viewsCount`      | Number        | Кількість переглядів    |
| `category`        | String        | Категорія статті        |

---

# 7. Legacy contract → актуальний contract

Початкові тестові Article documents із ТЗ використовували старі назви полів.

Виконано централізовану міграцію:

```text
OLD                 NEW

img          →      imageUrl
desc         →      description
article      →      article
rate         →      viewsCount
ownerId      →      authorId
date         →      publicationDate
```

Для полів, яких не було у вихідних даних:

```text
imagePublicId → null
category      → "general"
```

---

# 8. Legacy-поля більше не використовуємо

У новому коді НЕ використовувати:

```text
img
desc
rate
ownerId
date
```

### ❌ Неправильно

```js
article.img;
article.desc;
article.rate;
article.ownerId;
article.date;
```

### ✅ Правильно

```js
article.imageUrl;
article.description;
article.viewsCount;
article.authorId;
article.publicationDate;
```

Це правило стосується:

- backend controllers;
- backend services;
- backend validation;
- frontend services;
- TypeScript types/interfaces;
- React components;
- Next Route Handlers;
- API response mapping.

---

# 9. `description` та `article`

Це два різні поля.

### `description`

Короткий опис статті.

Наприклад:

```text
Медитації, які допомагають відновити внутрішній спокій
```

Може використовуватися у:

- Article Card;
- списку статей;
- preview;
- search results.

### `article`

Повний текст статті.

Наприклад:

```text
У кожного з нас бувають моменти, коли тривога наче туман огортає думки...
```

Не об'єднувати `description` та `article` в одне поле.

---

# 10. Робота із зображеннями

## Legacy/test Articles

Зображення тестових статей із ТЗ знаходяться на зовнішньому сервері.

Для них:

```text
imageUrl       = існуючий URL
imagePublicId  = null
```

Приклад:

```json
{
  "imageUrl": "https://ftp.goit.study/img/harmoniq/...",
  "imagePublicId": null
}
```

## Нові Articles

Для нових статей, де зображення завантажується через Cloudinary:

```text
imageUrl       = Cloudinary URL
imagePublicId  = Cloudinary Public ID
```

`imagePublicId` потрібний для подальшого керування файлом у Cloudinary.

Не створювати штучний `imagePublicId` для legacy-зображень.

---

# 11. User Contract

Актуальна структура користувача включає:

```text
_id
name
email
passwordHash
avatarUrl
avatarPublicId
savedArticles
articlesAmount
```

Тестові користувачі з файлів ТЗ не мали `email` та `passwordHash`.

Під час централізованого seed для них створюються технічні дані.

Технічний email має формат:

```text
<userId>@seed.harmoniq.local
```

Наприклад:

```text
6881563901add19ee16fcff2@seed.harmoniq.local
```

Seed-users не призначені для звичайної авторизації користувача.

---

# 12. `articlesAmount`

Поле:

```text
User.articlesAmount
```

містить кількість статей конкретного користувача.

Джерелом істини є фактичні Article documents:

```text
Article.authorId === User._id
```

Під час seed значення `articlesAmount` перераховується автоматично.

Старе значення `articlesAmount` із вихідного JSON не переноситься без перевірки.

---

# 13. Seed тестової БД

Централізований seed знаходиться:

```text
backend/src/seed/seed.js
```

Вихідні дані:

```text
docs/harmoniq.users.json
docs/harmoniq.articles.json
```

Команда запуску з папки `backend`:

```bash
npm run seed
```

Seed виконує:

1. читання `harmoniq.users.json`;
2. читання `harmoniq.articles.json`;
3. перевірку зв'язків `ownerId → User._id`;
4. трансформацію legacy Article contract;
5. upsert тестових Users;
6. upsert тестових Articles;
7. перерахунок `articlesAmount`;
8. видалення legacy-полів;
9. перевірку результату міграції.

---

# 14. Результат останньої міграції

Після виконання seed отримано:

```text
Users: 81
Articles: 200
Broken author references: 0
Articles with legacy fields: 0
```

Отже:

```text
Users                     81   ✅
Articles                 200   ✅
Article → User links           ✅
Broken author references   0   ✅
Legacy Article documents   0   ✅
```

---

# 15. ⚠️ Важливо: запуск seed

`npm run seed` НЕ є звичайною командою для перевірки backend.

Seed виконує запис у MongoDB та змінює тестові дані.

Якщо команда використовує спільну MongoDB, учасникам не потрібно самостійно запускати:

```bash
npm run seed
```

для звичайної перевірки своїх feature.

Повторний запуск seed виконується централізовано Team Lead, якщо змінюються:

- структура БД;
- Mongoose models;
- canonical data contract;
- вихідні JSON-дані;
- правила міграції.

Для звичайної перевірки endpoint-ів використовуються вже підготовлені тестові дані MongoDB.

---

# 16. Заборонені операції зі спільною БД

Без узгодження з Team Lead НЕ виконувати:

```js
deleteMany({});
drop();
dropDatabase();
```

Також не потрібно:

- створювати власний seed для `users` або `articles`;
- виконувати власну міграцію цих колекцій;
- масово змінювати тестові документи;
- змінювати структуру `Article`;
- повертати legacy-поля.

Якщо для feature потрібні додаткові тестові дані — узгодити це з Team Lead.

---

# 17. Важливо для Article feature

Після потрапляння актуального contract у `develop` учасники, які працюють з Articles, повинні синхронізувати свої гілки:

```bash
git fetch origin
git merge origin/develop
```

Після цього перевірити:

```text
controllers
services
validation
frontend services
TypeScript types/interfaces
components
Next Route Handlers
```

на використання актуального Article contract.

Особливо це стосується:

```text
Article List
Article Details
Article Create
Article Manage
User Articles
Bookmarks
Profile / My Articles
```

---

# 18. Ownership

Структура БД, Mongoose models та canonical Article contract є частиною:

```text
TL / shared core
```

Учасникам НЕ потрібно самостійно змінювати `Article` schema під потреби власного endpoint.

Якщо для feature потрібне:

- нове поле;
- зміна типу поля;
- зміна relation;
- зміна назви поля;
- зміна validation на рівні model;
- зміна seed;
- міграція існуючих документів;

це спочатку узгоджується з Team Lead.

---

# 19. Головне правило

Для всього проєкту існує один canonical Article contract:

```text
_id
title
description
article
imageUrl
imagePublicId
publicationDate
authorId
viewsCount
category
```

Усі frontend та backend feature повинні працювати саме з цим контрактом.

Не створюємо окремі версії Article contract для різних feature.
