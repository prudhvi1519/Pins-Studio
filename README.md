# Pins Studio

A social media platform for sharing and discovering creative pins, built with Django and Bootstrap.  
**Users** can **upload images, search for pins, like, comment, and manage their profiles in a responsive, user-friendly interface.**

---

## 🛠️ Technologies Used

- **Django**: Python web framework for backend logic and authentication.
- **Bootstrap 5.3.3**: For responsive UI design and components.
- **HTML/CSS/JavaScript**: Custom frontend styling (`customPinsStudio.css`) and interactivity (`infinite_scroll.js`).
- **Masonry.js & ImagesLoaded**: For grid layout and infinite scrolling of pins.
- **SQLite**: Default database for development (configurable for `PostgreSQL/MySQL`).
- **Django Static Files**: Custom CSS, JavaScript, and favicon for frontend assets.
- **Unsplash API**: Fetches 150 pins via a custom management command (`fetch_unsplash_pins.py`).

---

## 🎮 Features

- **Pin Upload**: Upload images with titles and descriptions via `PinForm`.
- **Search Pins**: Keyword-based search to filter pins by title.
- **Like & Comment**: Interact with pins through like buttons and comment forms.
- **User Profiles**: View/edit profile details (bio, picture) and delete uploaded pins.
- **Authentication**: Secure signup, login, logout, and password change using Django’s auth system.
- **Responsive Design**: Mobile-friendly layout with a hamburger menu for navigation (<991px).
- **Dynamic Navbar**:
   - Conditional links: Shows "Profile" and "Logout" for authenticated users, "Sign Up" and "Login" for guests.
   - Mobile toggler: Pressing effect on click, aligned to the right edge, hidden on login/signup pages in mobile view.
   - Brand animation: Dynamic scale and rotation on hover and click for the "Pins Studio" logo.
- **Infinite Scrolling**: Loads more pins dynamically using `infinite_scroll.js` with Masonry layout.
- **Admin Panel**: Configurable via `admin.py` with a superuser creation command (`create_superuser.py`).

---

## 💻 Installation

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/prudhvi1519/pins-studio.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd pins-studio
   ```

3. **Create and activate a virtual environment**:
   ```bahs
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   >  If `requirements.txt` is unavailable, install core dependencies:  
      >  ```bash
        pip install django python-decouple
        ```
5. **Set up environment variables**: Create a `.env` file in the `pins-studio` directory with:
   ```bash
   UNSPLASH_ACCESS_KEY=your_unsplash_key
   DATABASE_URL=your_database_url
   ```

6. **Run migrations** to set up the database:
   ```bash
   python manage.py migrate
   ```

7. **Create a superuser** (optional, for admin access):
   ```bash
   python manage.py create_superuser
   ```

8. **Fetch Unsplash pins** (optional, to populate initial data):
   ```bash
   python manage.py fetch_unsplash_pins
   ```

9. **Run the development server**:
   ```bash
   python manage.py runserver
   ```

10. **Access the application**: Open your browser and visit:  
   ```bash
   http://127.0.0.1:8000/
   ```

---


## 📂 Project Structure
      pins_studio/  
      ├── .env                                # Environment variables (UNSPLASH_ACCESS_KEY, DATABASE_URL)  
      ├── manage.py                           # Django management script  
      ├── pins/                               # Main app directory  
      │   ├── admin.py                        # Admin panel configurations  
      │   ├── apps.py                         # App configuration  
      │   ├── forms.py                        # Forms (SignUpForm, PinForm, CommentForm, ProfileForm)  
      │   ├── models.py                       # Models (Pin, Pin_likes, Comment, Profile)  
      │   ├── tests.py                        # Unit tests  
      │   ├── urls.py                         # App-level URL routing  
      │   ├── views.py                        # Views (home, load_more_pins, like_pin, etc.)  
      │   ├── management/                     # Custom management commands  
      │   │   └── commands/  
      │   │       ├── create_superuser.py     # Command to create superuser  
      │   │       ├── fetch_unsplash_pins.py  # Command to fetch 150 Unsplash pins  
      │   ├── static/pins/                    # Static files  
      │   │   ├── css/  
      │   │   │   └── customPinsStudio.css    # Custom CSS (navbar, pins, buttons)  
      │   │   ├── js/  
      │   │   │   ├── infinite_scroll.js      # Infinite scrolling with Masonry  
      │   │   │   └── bootstrap.bundle.min.js  
      │   │   └── favicon.ico                 # Favicon  
      │   ├── templates/pins/                 # HTML templates  
      │   │   ├── base.html                   # Base template with navbar  
      │   │   ├── home.html                   # Home page with pins and search  
      │   │   ├── pin_card.html               # Pin card component  
      │   │   ├── login.html                  # Login page  
      │   │   ├── signup.html                 # Signup page  
      │   │   ├── profile.html                # User profile page  
      │   │   ├── change_password.html        # Password change page  
      │   │   ├── edit_comment.html           # Edit comment page  
      │   │   ├── upload_pin.html             # Pin upload page  
      ├── pins_studio/                        # Project settings  
      │   ├── asgi.py                         # ASGI configuration  
      │   ├── settings.py                     # Django settings  
      │   ├── urls.py                         # Project-level URL routing  
      │   ├── wsgi.py                         # WSGI configuration  
      ├── requirements.txt                    # Python dependencies  
      ├── .gitignore                          # Git ignore file  
      └── README.md                           # Project documentation  

---

## 🤖 How It Works
### Frontend:  

- **Templates**: Built with Bootstrap 5.3.3 and extended via `base.html` for consistent layout (navbar, footer).  
- **Navbar**: Includes a responsive toggler for mobile screens (<991px) with a pressing effect, right-aligned, and hidden on login/signup pages. The brand ("Pins Studio") has dynamic hover and click animations.  
- **Infinite Scrolling**: Uses `infinite_scroll.js` with Masonry.js for a dynamic pin grid that loads more pins on scroll.  
- **Styling**: Custom styles in `customPinsStudio.css` for buttons, cards, and navbar effects (e.g., gradient buttons, hover animations).  

#### Example navbar HTML (base.html):  
```bash
<nav class="navbar">  
    <div class="navbar-row">  
        <a class="navbar-brand brand-effect" href="{% url 'home' %}">Pins Studio</a>  
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">  
            <span class="navbar-toggler-icon"></span>  
        </button>  
        <div class="navbar-collapse" id="navbarNav">  
            <ul class="navbar-nav">  
                {% if user.is_authenticated %}  
                    <li class="nav-item"><a class="nav-link nav-link-effect" href="{% url 'profile' %}">{{ user.username }}</a></li>  
                    <li class="nav-item"><a class="nav-link nav-link-effect" href="{% url 'logout' %}">Logout</a></li>  
                {% else %}  
                    <li class="nav-item"><a class="nav-link nav-link-effect" href="{% url 'signup' %}">Sign Up</a></li>  
                    <li class="nav-item"><a class="nav-link nav-link-effect" href="{% url 'login' %}">Login</a></li>  
                {% endif %}  
            </ul>  
        </div>  
    </div>  
</nav>  
```



#### Custom CSS:  
Styles the navbar toggler for mobile screens:  
```bash
@media (max-width: 991px) {  
    .navbar-toggler {  
        display: block;  
        margin-right: 15px !important;  
        padding: 8px !important;  
    }  
    .navbar-toggler-icon {  
        width: 18px;  
        height: 2px;  
        background: #333 !important;  
    }  
}  
```



### Backend:  

- **Models**: `Pin`, `Pin_likes`, `Comment`, and `Profile` for storing pin data, likes, comments, and user profiles.  
- **Views**: Handle routes for home, profile, login, signup, pin upload, liking, and commenting.  
- **Forms**: `SignUpForm`, `PinForm`, `CommentForm`, and `ProfileForm` for secure data input.  
- **URLs**: Defined in `pins/urls.py` for app-specific routes (e.g., `/`, `/profile/`, `/like/<pin_id>/`).  
- **Database**: SQLite for development, with PostgreSQL/MySQL support via `DATABASE_URL`.  


#### Example View (views.py):
```bash
from django.shortcuts import render, redirect  
from .models import Pin  
from .forms import PinForm, CommentForm  

def home(request):  
    query = request.GET.get('q', '')  
    pins = Pin.objects.filter(title__icontains=query).order_by('?')  
    if request.method == 'POST':  
        form = CommentForm(request.POST)  
        if form.is_valid():  
            comment = form.save(commit=False)  
            comment.user = request.user  
            comment.pin = Pin.objects.get(id=request.POST.get('pin_id'))  
            comment.save()  
            return redirect('home')  
    return render(request, 'pins/home.html', {'pins': pins, 'comment_form': CommentForm()})  
```



#### Database:  
- SQLite stores pins, comments, likes, and user profiles.  
- Custom commands (`create_superuser.py`, `fetch_unsplash_pins.py`) populate initial data.  

#### Form Handling  
- Secure POST requests with CSRF tokens for uploads, comments, and profile updates.  
- Image uploads are validated (5MB limit, image-only) via `PinForm`.  

---

## 🚀 Usage
- **Home Page**: View all pins at `http://127.0.0.1:8000/`.   
- **Upload Pin**: Authenticated users can upload pins at `/upload_pin/`.  
- **Search Pins**: Use the search bar to find pins by keywords.  
- **Profile**: Access `/profile/` to view/edit user details or /change_password/ to update passwords.  
- **Like/Comment**: Interact with pins via like buttons and comment forms.  
- **Mobile Navigation**: On screens <991px, click the hamburger menu to access navigation links.
- **Password Change**: Update password at `/change_password/`.  

---

## 👥 Contributing

1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/pins-studio.git
   ```
3. Create a new branch:  
   ```bash
   git checkout -b feature-name
   ```
4. Make changes and commit:  
   ```bash
   git commit -m "Add new feature"
   ```
5. Push to your branch:  
   ```bash
   git push origin feature-name
   ```
6. Create a `pull request` on GitHub.

---

## 📜 License  
This project is open-source and available under the MIT License.

---

## 📬 Contact
For issues or suggestions, contact @prudhvi1519 or open an issue on GitHub.
