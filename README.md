# **Daily Verse App**

A motivational web app that displays a daily Bible verse with a scenic background image. The app ensures the verse and background remain consistent throughout the day and updates automatically the next day.

---

## **Features**
- **Daily Bible Verse**: Displays a new verse each day fetched from a custom API.
- **Dynamic Backgrounds**: Shows a random scenic image using the Pexels API.
- **Local Storage Optimization**: Stores data locally for consistency throughout the day.
- **Automatic Daily Refresh**: Updates verse and image automatically at midnight.
- **Responsive Design**: Works seamlessly on desktop and mobile.

---

## **Technologies Used**
- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: Custom Bible Verse API, Pexels API

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/daily-verse-app.git
cd daily-verse-app
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Create a `.env` File**
Add the following keys to your `.env` file:
```env
VITE_BACKEND_URL=http://your-backend-url
VITE_PEXELS_API_KEY=your-pexels-api-key
```

### **4. Start the App**
```bash
npm run dev
```

---

## **How It Works**
1. Fetches the daily Bible verse from the custom backend API.
2. Retrieves a scenic background image from the Pexels API.
3. Uses `localStorage` to store the verse and background for the day.
4. Automatically refreshes the content at midnight for the next day.

---

## **Attribution**
- Background images provided by [Pexels](https://www.pexels.com/).
- Bible verses sourced from a custom database.

---

## **Contributing**
Feel free to fork this repository and submit pull requests for improvements or new features.
