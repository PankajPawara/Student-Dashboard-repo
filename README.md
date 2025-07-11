# 🧑‍🎓 Student Dashboard - React App

A fully functional student management dashboard built using **React.js**, **Tailwind CSS**, and **ShadCN UI**. The application allows users to **add**, **edit**, **delete**, **search**, and **sort** students. It also supports **image upload and preview**, with persistent data storage using **localStorage**.

## 🚀 Features

- 📋 Add new student with full details (name, roll number, email, course, photo)
- ✏️ Edit existing student data with real-time preview
- 🗑️ Delete students with confirmation dialog
- 🔍 Search students by name, email, or course
- ⬆️ Sort students by name, course, or serial number
- 🖼️ Image upload and preview for profile pictures
- 💾 Data is saved in localStorage to persist across page refreshes

## 📸 Screenshot

![Student Dashboard Screenshot](<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/d9b4a913-b57b-4a22-bede-46d7fefee826" />
)

---

## 📁 Project Structure

```bash
StudentDashboard/
│
├── public/
├── src/
│   ├── components/
│   │   └── ui/                  # UI Components from ShadCN
│   ├── App.jsx                  # Main app logic and layout
│   ├── App.css                  # Custom styling
│   ├── main.jsx                 # Entry point
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
