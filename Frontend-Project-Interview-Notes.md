# Frontend Project Interview Notes

## 1. Search — Debouncing, AbortController & Stale Requests

### The Problem

When a user searches for products, they may type quickly:

p → ph → pho → phon → phone

If we call the API after every keystroke, we make many unnecessary requests:

p      → API request
ph     → API request
pho    → API request
phon   → API request
phone  → API request

There is another problem: API requests can take different amounts of time.

Example:

Request 1: "pho"   → takes 3 seconds
Request 2: "phone" → takes 1 second

The newer "phone" request may finish first.

Then the older "pho" request may finish later.

If we display every response without protection:

phone results
      ↓
pho results ❌

The old result replaces the new result.

This is called a stale response / race-condition problem.

---

## 2. What is Debouncing?

### Simple Definition

Debouncing means waiting until the user stops typing for a short period before making the API request.

For example, with approximately 400ms debounce time:

p
 ↓
ph
 ↓
pho
 ↓
phon
 ↓
phone
 ↓
User stops typing
 ↓
Wait 400ms
 ↓
API request for "phone"

Instead of making five API requests, we make one request after the user stops typing.

### Why Use Debouncing?

- Reduces unnecessary API calls
- Reduces server requests
- Improves performance
- Makes search smoother

### Interview Answer

**Q: Why did you use debouncing?**

"To avoid making an API request for every character the user types. The application waits briefly until the user stops typing and then sends the search request."

---

## 3. What is AbortController?

### Simple Definition

AbortController allows us to cancel an ongoing request.

Example:

User searches: phone
        ↓
API request starts
        ↓
User changes search to: iphone
        ↓
Old "phone" request is no longer needed
        ↓
Cancel old request
        ↓
Send "iphone" request

The browser provides AbortController, and Axios can use its signal to cancel a request.

### Simplified Example

```js
const controller = new AbortController()

axios.get('/products/search', {
  params: { q: search },
  signal: controller.signal
})