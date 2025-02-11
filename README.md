# Translation API using Express.js & Groq AI

This is a simple translation API built with **Node.js, Express.js, and Groq AI**, which provides English-to-Arabic translations. It first attempts to fetch translations using **Google Translate** and falls back to **Groq AI** if necessary.

---

## 🚀 Features
- Translate text between languages using **Google Translate**.
- Fallback to **Groq AI** if Google Translate fails or does not contain Arabic characters.
- Fast and lightweight API with **GET** and **POST** endpoints.
- Uses **environment variables** for API keys and configurations.

---

## 🛠️ Installation

### 1️⃣ Clone the repository
```sh
git clone https://github.com/sasanthgensys/AutoTranslateService.git
cd AutoTranslateService
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Create a `.env` file
Create a `.env` file in the project root and add:
```sh
PORT=3555
API_KEY=your-groq-api-key
```
Replace `your-groq-api-key` with your actual **Groq API Key**.

### 4️⃣ Run the server
Start the server with:
```sh
node index.js
```
or, if using `nodemon` for automatic restarts:
```sh
npm run dev
```

---

## 📌 API Endpoints

### 🔹 **GET /translate**
**Translate text using Google Translate (fallback to Groq AI if needed)**

#### Example Request:
```http
GET /translate?sl=en&tl=ar&query=hello
```
#### Example Response:
```json
"مرحبا"
```

---

### 🔹 **POST /translate**
**Send text via `POST` request for translation**

#### Example Request:
```http
POST /translate
Content-Type: application/json
{
  "sl": "en",
  "tl": "ar",
  "query": "hello"
}
```
#### Example Response:
```json
"مرحبا"
```

---

### 🔹 **GET /translate-delay**
**Translate text with a 2-second delay (simulating longer processing time)**

#### Example Request:
```http
GET /translate-delay?sl=en&tl=ar&query=hello
```

---

### 🔹 **POST /translate-delay**
**Same as `POST /translate` but with a 2-second delay**

#### Example Request:
```http
POST /translate-delay
Content-Type: application/json
{
  "sl": "en",
  "tl": "ar",
  "query": "hello"
}
```

---

## 📜 License
This project is **open-source**. You can modify and use it freely.
