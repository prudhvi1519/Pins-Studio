# Pins Studio

A simple Pinterest clone built with Django.  
**Users can upload pins, like pins, comment on pins, and search through uploaded pins**.

---

## 🛠️ Technologies Used

- **Django**: A Python web framework for building dynamic websites.
- **HTML/CSS/JS**: Frontend technologies for styling and interactivity.
- **Bootstrap**: CSS framework for responsive web design.
- **SQLite**: Database for storing user and pin data.

---

## 🎮 Features

- **User Registration and Authentication:** Register, login, and manage your account.
- **Pin Upload:** Upload images as pins with titles and descriptions.
- **Like Pins:** Like or unlike pins.
- **Commenting:** Leave comments on pins.
- **Search Pins:** Search for pins by title.
- **User Profiles:** View the profile of users who uploaded the pins.

---

## 💻 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prudhvi1519/Pinterest-clone.git
   ```

3. Navigate to the project directory:
   ```bash
   cd "Pinterest Clone"
   ```

5. Install dependencies (if using a virtual environment):
   ```bash
   pip install -r requirements.txt
   ```

   **Note:** If you don't have a requirements.txt, install Django manually using:
         `pip install django`

7. Run migrations:
   ```bash
   python manage.py migrate
   ```

9. Run the development server:
   ```bash
   python manage.py runserver
   ```

11. Visit `http://127.0.0.1:8000/` in your browser.

---

## 🤖 How It Works

1. **Models:** We have models for Users, Pins, and Comments.
2. **Views:** The views handle creating, editing, and displaying pins and comments.
3. **URL Routing:** The URLs map views to user-friendly URLs.
4. **Forms:** Used for submitting pin titles, images, and comments.

---

## 👥 Contributing

1. Fork the repository.
2. Clone your fork.
3. Create a new branch (`git checkout -b feature-name`).
4. Make your changes and commit (`git commit -am 'Add new feature'`).
5. Push to your branch (`git push origin feature-name`).
6. Create a new pull request.

---

## 📜 License
This project is open-source and available under the MIT License.
