# Harmoniq — Frontend Layout Guide

## 1. Призначення документа

Цей документ визначає спільні правила frontend-верстки проєкту **Harmoniq**.

Мета:

- уникнути дублювання компонентів;
- використовувати єдині стилі відповідно до Figma;
- розділити shared UI та feature-specific компоненти;
- уникнути конфліктів між гілками учасників;
- забезпечити однакову адаптивність;
- спростити інтеграцію frontend у `develop`.

---

# 2. Головне правило

Перед створенням нового компонента потрібно визначити:

```text
Чи використовується цей компонент тільки у моїй feature?
```

Якщо:

```text
ТАК → створюємо у своїй feature-папці.

НІ, він повторюється у різних feature
→ перевіряємо shared UI.

Shared-компонента немає
→ узгоджуємо його створення з Team Lead.
```

Не створюємо декілька реалізацій одного й того самого спільного компонента.

---

# 3. Shared UI

Спільні UI-компоненти знаходяться у:

```text
frontend/src/components/ui/
```

Приклад структури:

```text
frontend/src/components/ui/
├── Button/
├── Container/
├── Input/
├── Textarea/
├── Select/
├── Modal/
├── Loader/
└── ...
```

Shared-компонент використовується тоді, коли однаковий UI-елемент потрібний у декількох feature.

---

# 4. Button

Якщо у проєкті вже є:

```text
frontend/src/components/ui/Button/
```

не створюємо:

```text
features/articles/create/components/Button/
features/auth/login/components/Button/
features/profile/components/Button/
```

Використовуємо спільний:

```tsx
import { Button } from '@/components/ui/Button/Button';
```

Якщо конкретній feature потрібна інша поведінка — спочатку перевіряємо, чи її можна реалізувати через `props`, `variant` або `className`.

---

# 5. Feature-specific компоненти

Компонент, який належить тільки конкретній feature, створюється у папці цієї feature.

Наприклад:

```text
frontend/src/features/articles/create/
├── components/
│   ├── AddArticleForm/
│   │   ├── AddArticleForm.tsx
│   │   └── AddArticleForm.module.css
│   │
│   └── ArticleImagePreview/
│       ├── ArticleImagePreview.tsx
│       └── ArticleImagePreview.module.css
│
├── create-article.service.ts
├── create-article.schema.ts
├── create-article.types.ts
└── index.ts
```

Такі компоненти не потрібно переносити в `components/ui`.

---

# 6. CSS Modules

Стилі конкретного компонента зберігаємо поруч із компонентом.

Правильно:

```text
ArticleDetails/
├── ArticleDetails.tsx
└── ArticleDetails.module.css
```

або:

```text
LoginForm/
├── LoginForm.tsx
└── LoginForm.module.css
```

Імпорт:

```tsx
import styles from './ArticleDetails.module.css';
```

Використання:

```tsx
<section className={styles.section}>
```

---

# 7. globals.css

Файл:

```text
frontend/src/app/globals.css
```

призначений тільки для глобальних стилів.

Тут можуть знаходитися:

- CSS reset;
- глобальні CSS variables;
- базові стилі `html`;
- базові стилі `body`;
- глобальна typography;
- загальні design tokens.

Не переносимо в `globals.css` стилі конкретної feature.

### ❌ Неправильно

```css
.articleDetailsCard {
  ...
}

.loginForm {
  ...
}

.profileAvatar {
  ...
}
```

### ✅ Правильно

Такі стилі повинні знаходитися у відповідному:

```text
*.module.css
```

---

# 8. Шрифти

Фінальні шрифти підключаються централізовано через:

```tsx
next / font;
```

У проєкті використовуються:

```text
Manrope
DM Sans
Noto Sans
```

Вони підключені через Root Layout.

Глобальні font variables:

```css
:root {
  --font-family: 'Manrope', sans-serif;
  --second-family: 'DM Sans', sans-serif;
  --third-family: 'Noto Sans', sans-serif;
}
```

Учасникам НЕ потрібно додавати:

```css
@import url('https://fonts.googleapis.com/...');
```

у свої CSS-файли.

Також не потрібно повторно підключати `next/font` у feature.

---

# 9. Кольори

Кольори, які повторюються у макеті Figma, повинні бути визначені централізовано через CSS variables.

Приклад:

```css
:root {
  --color-text-primary: ...;
  --color-text-secondary: ...;

  --color-background: ...;
  --color-background-secondary: ...;

  --color-primary: ...;
  --color-border: ...;

  --color-error: ...;
}
```

Якщо колір уже визначений глобально:

### ❌ Не робимо

```css
.button {
  background: #123456;
}
```

### ✅ Використовуємо

```css
.button {
  background: var(--color-primary);
}
```

Точні значення кольорів повинні відповідати Figma.

---

# 10. Container

Якщо сторінки у Figma мають однакову максимальну ширину та горизонтальні відступи, використовується один shared `Container`.

Наприклад:

```text
frontend/src/components/ui/Container/
```

Не потрібно кожному учаснику створювати:

```css
.container {
  max-width: ...;
  margin: 0 auto;
  padding: ...;
}
```

у своїй feature, якщо такий Container уже є.

---

# 11. Header

Header є спільним компонентом застосунку.

Зона:

```text
frontend/src/components/Header/
```

Приклад структури:

```text
Header/
├── Header.tsx
├── Header.module.css
├── Navigation/
└── BurgerMenu/
```

Не створюємо окремий Header для кожної сторінки.

---

# 12. SVG icons

У проєкті використовується shared SVG sprite:

```text
frontend/public/icons/sprite.svg
```

Не потрібно копіювати однакові SVG у кожну feature.

Використання:

```tsx
<svg width="24" height="24" aria-hidden="true">
  <use href="/icons/sprite.svg#icon-name" />
</svg>
```

Перед додаванням нового SVG перевірити, чи потрібна іконка вже є у:

```text
frontend/public/icons/sprite.svg
```

---

# 13. Default Avatar

У проєкті використовується одна централізована заглушка аватара:

```text
frontend/public/images/default-avatar.png
```

Shared helper:

```text
frontend/src/utils/getAvatarSrc.ts
```

Використання:

```ts
import { getAvatarSrc } from '@/utils/getAvatarSrc';
```

Наприклад:

```tsx
<Image src={getAvatarSrc(user.avatarUrl)} alt={user.name || 'User avatar'} width={40} height={40} />
```

Логіка:

```text
avatarUrl існує
        ↓
реальний avatar

avatarUrl === null
        ↓
default-avatar.png
```

Не створюємо окремі avatar placeholders у різних feature.

---

# 14. Зображення

Для зображень у Next.js переважно використовуємо:

```tsx
import Image from 'next/image';
```

Наприклад:

```tsx
<Image src={article.imageUrl} alt={article.title} width={400} height={300} />
```

Не використовуємо `<img>` без необхідності.

---

# 15. Верстка відповідно до Figma

Кожен учасник відповідає за відповідність своєї feature макету Figma.

Перевіряємо:

```text
розміри
відступи
кольори
шрифти
font-weight
border-radius
іконки
зображення
розташування елементів
responsive layout
hover/focus states
```

Не потрібно приблизно відтворювати макет, якщо точні значення доступні у Figma.

---

# 16. Responsive

Feature повинна коректно працювати на основних розмірах макета.

Орієнтуємося насамперед на breakpoints, визначені дизайном проєкту.

Перевіряємо щонайменше:

```text
Mobile
Tablet
Desktop
```

Не вважаємо feature готовою, якщо вона працює тільки на desktop.

---

# 17. Не створюємо власну дизайн-систему у feature

### ❌ Не потрібно

Кожному учаснику самостійно створювати:

```text
свої кольори
свої шрифти
свій Button
свій Loader
свій Modal
свій Container
свій SVG sprite
свій default avatar
```

якщо відповідний shared ресурс уже існує.

---

# 18. Коли можна створювати компонент у своїй feature

Наприклад:

```text
ArticleDetails
ArticleAuthor
ArticleImagePreview
AddArticleForm
LoginForm
RegisterForm
ProfileInfo
MyArticlesTab
BookmarksTab
```

Якщо компонент потрібний тільки цій feature — він залишається у feature.

---

# 19. Коли компонент повинен бути shared

Наприклад:

```text
Button
Container
Loader
базовий Modal
повторюваний Input
повторюваний Select
загальні icons
default avatar
```

Якщо один і той самий компонент потрібний декільком feature — він є кандидатом на shared.

Перед перенесенням або створенням shared-компонента узгодити це з Team Lead.

---

# 20. Ownership

Кожен учасник працює переважно у своїй frontend-зоні.

Не потрібно без узгодження редагувати feature іншого учасника.

Наприклад:

```text
Учасник A
features/articles/create/

Учасник B
features/articles/details/
```

Учасник A не змінює:

```text
features/articles/details/
```

лише тому, що йому потрібна схожа логіка.

Якщо потрібна спільна функціональність — узгоджуємо shared-рішення.

---

# 21. Shared / TL зона

До shared/core зони відносимо речі, зміна яких може вплинути одразу на декількох учасників.

Наприклад:

```text
frontend/src/app/layout.tsx
frontend/src/app/globals.css

frontend/src/components/ui/

frontend/public/icons/sprite.svg
frontend/public/images/

frontend/src/utils/
```

Зміни у таких місцях бажано узгоджувати з Team Lead.

---

# 22. Next.js Pages

Файли у:

```text
frontend/src/app/
```

повинні переважно збирати сторінку з готових feature/components.

Не потрібно переносити всю бізнес-логіку безпосередньо у:

```text
page.tsx
```

Наприклад:

```tsx
import { AddArticleForm } from '@/features/articles/create';

export default function CreateArticlePage() {
  return (
    <main>
      <AddArticleForm />
    </main>
  );
}
```

Feature-логіка залишається у:

```text
frontend/src/features/
```

---

# 23. Стани UI

Під час реалізації frontend потрібно враховувати не тільки основний стан сторінки.

Перевіряємо:

```text
loading
success
empty
error
disabled
hover
focus
```

Якщо feature працює з API, повинні бути передбачені відповідні стани, якщо вони потрібні за дизайном/сценарієм.

---

# 24. Дані

Не вставляємо тестові Article/User дані безпосередньо в JSX, якщо feature вже повинна працювати з API.

### ❌ Не потрібно

```tsx
const article = {
  title: 'Test article',
  author: 'Test User',
};
```

як фінальне рішення.

### ✅ Потрібно

```text
Frontend
   ↓
service
   ↓
Next Route Handler
   ↓
Backend API
   ↓
MongoDB
```

Mocks допускаються лише як тимчасовий етап розробки.

---

# 25. Article Contract

Frontend повинен використовувати актуальний canonical Article contract:

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

Не використовуємо legacy-поля:

```text
img
desc
rate
ownerId
date
```

---

# 26. Перед створенням нового компонента

Перед тим як створити компонент, перевірити:

```text
1. Чи є такий компонент у components/ui?

2. Чи є аналогічний shared component?

3. Чи є потрібна SVG у sprite.svg?

4. Чи визначений потрібний колір глобально?

5. Чи визначений потрібний font глобально?

6. Чи належить компонент тільки моїй feature?

7. Чи не редагую я ownership-зону іншого учасника?
```

---

# 27. Перед PR

Перед створенням Pull Request перевірити свою feature у браузері.

Обов'язково:

```bash
npm run lint
npm run build
```

Також перевірити:

```text
Desktop              ✅
Tablet               ✅
Mobile               ✅
Figma                ✅
API integration      ✅
Loading state        ✅
Error state          ✅
Console errors       ✅
```

Якщо feature залежить від останніх змін `develop`, перед фінальною перевіркою синхронізувати свою гілку:

```bash
git fetch origin
git merge origin/develop
```

Після merge повторно:

```bash
npm run lint
npm run build
```

---

# 28. Критерій готовності frontend feature

Feature не вважається готовою тільки тому, що JSX/CSS написані.

Feature готова, коли:

```text
Верстка відповідає Figma             ✅
Desktop працює                       ✅
Tablet працює                        ✅
Mobile працює                        ✅
Shared components використані        ✅
API підключений                       ✅
Реальні дані відображаються           ✅
Loading/error/empty оброблені          ✅
Навігація працює                      ✅
Console без критичних помилок         ✅
npm run lint                          ✅
npm run build                         ✅
PR створений                          ✅
```

---

# 29. Головне правило команди

```text
Feature-specific
      ↓
frontend/src/features/<feature>/

Shared / reusable
      ↓
frontend/src/components/ui/

Global styles
      ↓
frontend/src/app/globals.css

Shared SVG
      ↓
frontend/public/icons/sprite.svg

Shared images
      ↓
frontend/public/images/

Shared helpers
      ↓
frontend/src/utils/
```

Не дублюємо те, що вже існує.

Не змінюємо shared/core файли без необхідності.

Не редагуємо ownership-зону іншого учасника без узгодження.

Якщо бачимо у Figma повторюваний елемент, якого ще немає у shared — повідомляємо Team Lead і приймаємо одне спільне рішення для всієї команди.
