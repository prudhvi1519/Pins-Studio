Pinterest Clone
A simple Pinterest clone built with Django. Users can upload pins, like pins, comment on pins, and search through uploaded pins.

🛠️ Technologies Used
Django: A Python web framework for building dynamic websites.

HTML/CSS/JS: Frontend technologies for styling and interactivity.

Bootstrap: CSS framework for responsive web design.

SQLite: Database for storing user and pin data.

💻 Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/prudhvi1519/Pinterest-clone.git
Navigate to the project directory:

bash
Copy
Edit
cd Pinterest-clone/pinterest_clone
Install dependencies (if using a virtual environment):

bash
Copy
Edit
pip install -r requirements.txt
Note: If you don't have a requirements.txt, install Django manually using:

bash
Copy
Edit
pip install django
Run migrations:

bash
Copy
Edit
python manage.py migrate
Run the development server:

bash
Copy
Edit
python manage.py runserver
Visit http://127.0.0.1:8000/ in your browser.

🎮 Features
User Registration and Authentication: Register, login, and manage your account.

Pin Upload: Upload images as pins with titles and descriptions.

Like Pins: Like or unlike pins.

Commenting: Leave comments on pins.

Search Pins: Search for pins by title.

User Profiles: View the profile of users who uploaded the pins.

🤖 How It Works
Models: We have models for Users, Pins, and Comments.

Views: The views handle creating, editing, and displaying pins and comments.

URL Routing: The URLs map views to user-friendly URLs.

Forms: Used for submitting pin titles, images, and comments.

👥 Contributing
Fork the repository.

Clone your fork.

Create a new branch (git checkout -b feature-name).

Make your changes and commit (git commit -am 'Add new feature').

Push to your branch (git push origin feature-name).

Create a new pull request.

⚖️ License
This project is open source and available under the MIT License.
