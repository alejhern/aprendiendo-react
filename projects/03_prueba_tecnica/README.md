# 🐱 Cat Facts Application

## 📌 Purpose and Scope

The **Cat Facts Application** is a beginner-level React project located in `projects/03_prueba_tecnica/`. It demonstrates fundamental React patterns such as:

* Asynchronous data fetching
* Custom Hooks
* Service layer architecture
* Reactive data flow via `useEffect`
* End-to-end testing with Playwright

The application fetches **random cat facts** from an external API and displays them alongside **dynamically generated cat images** that overlay the first three words of the fact.

> 🔎 For more advanced async patterns (e.g. debouncing and search), see *Movie Search Application*. For cross-project patterns, see *Common Patterns and Best Practices*.

---

## 🧰 Technology Stack

| Technology           | Version | Purpose                    |
| -------------------- | ------- | -------------------------- |
| React                | 19.2.3  | UI framework               |
| Vite                 | 7.2.4   | Build tool & dev server    |
| @vitejs/plugin-react | 5.1.2   | React integration for Vite |
| Playwright           | 1.58.0  | End-to-end testing         |
| Node Fetch / Axios   | latest  | API requests               |

📂 **Source:** `projects/03_prueba_tecnica/package.json`

---

## 🛠 API Services

The application uses **two API services**:

### 1. Cat Facts API

* **Endpoint:** `https://catfact.ninja/fact`
* **Purpose:** Fetch a random cat fact as JSON
* **Response:** `{ fact: string }`
* **Service:** `src/services/facts.js`
* **Usage:** `useCatFact` hook fetches the fact on mount and on button click

Example usage in the hook:

```javascript
async function getRandomCatFact() {
  const res = await fetch('https://catfact.ninja/fact');
  if (!res.ok) throw new Error('Failed to fetch fact');
  const data = await res.json();
  return data.fact;
}
```

### 2. Cat Image API

* **Endpoint Template:** `https://cataas.com/cat/says/#firstPart#?size=50&color=red&json=true`
* **Purpose:** Generate a cat image with overlaid text
* **Response:** `{ url: string }` → path to image
* **Service:** `src/services/getImage.js`
* **Usage:** `useCatImage` hook constructs the URL from first three words of the fact and fetches the image URL

Example usage in the hook:

```javascript
async function getImageUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch image');
  const data = await res.json();
  return `https://cataas.com${data.url}`;
}
```

### API Flow Summary

```
useCatFact → fetch fact → setFact
    ↓
useCatImage → build URL → fetch image URL → setImageUrl
    ↓
UI re-renders (p + img)
```

---

## ⚙️ Playwright Configuration (Vanilla Framework)

The project uses **Playwright** for E2E testing, configured with the **Vanilla framework**, a minimal framework-agnostic setup.

### Configuration Highlights

* **testDir**: `./tests` → location of test files
* **fullyParallel**: `true` → tests run in parallel for speed
* **retries**: `2` on CI, `0` locally → retry failed tests only in CI
* **workers**: `1` on CI, default locally → control parallel execution
* **reporter**: `html` → generate readable HTML report
* **use**: `{}` → default Playwright settings; no framework-specific setup required

### Why Vanilla Framework

* **No opinionated structure**: Vanilla runs tests without coupling to React, Vue, or Angular
* **Direct DOM access**: Playwright interacts with the browser as a real user
* **Simplicity**: Ideal for small or beginner-level projects
* **Reusability**: Tests can be ported to other frontends without rewriting logic

📂 **Source:** `playwright.config.cjs`

---

## 🛠 Steps to Configure Playwright (Vanilla) with Vite

1. **Install dependencies**

```bash
npm install --save-dev @playwright/test
```

2. **Initialize Playwright**

```bash
npx playwright install
```

This downloads browser binaries (Chromium, Firefox, WebKit).

3. **Create test directory**

```bash
mkdir tests
```

4. **Add a sample test**
   Create `tests/example.spec.js` with basic DOM checks using Vanilla selectors:

```javascript
import { test, expect } from '@playwright/test';

test('Load App and check elements', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const fact = page.locator('p');
  const image = page.locator('img');
  await expect(fact).toBeVisible();
  await expect(image).toBeVisible();
});
```

5. **Configure Playwright**
   Create `playwright.config.cjs`:

```javascript
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {}
});
```

6. **Run the Vite development server**

```bash
npm run dev
```

7. **Run Playwright tests**

```bash
npx playwright test
```

> All tests use **Vanilla framework**, meaning no additional adapters are needed for React or Vite.

---

### Example Test Flow

```
Load App
  ↓
Check if fact paragraph exists
  ↓
Check if image is visible and URL contains cataas.com
  ↓
Click 'New Fact' button
  ↓
Check if fact and image URL updated correctly
```

---

### Benefits

* Tests **actual user interactions** end-to-end
* Minimal setup, easy to understand for beginners
* Framework-agnostic: works with any front-end framework
* Demonstrates **reactive data flow, API integration, and user interactions**

---

The rest of the architecture, hooks, and service layers remain the same, focusing on **reactive state updates**, **API fetching**, and **integration between hooks and services**.
