from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.auth.views import redirect_to_login
from .forms import SignUpForm, PinForm, CommentForm
from django.contrib.auth.decorators import login_required
from .models import Pin, Comment
from django.contrib import messages

def home(request):
    query = request.GET.get('q', '')
    pins = Pin.objects.filter(title__icontains=query) if query else Pin.objects.all().order_by('-created_at')

    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect_to_login(request.get_full_path())  # ✅ Redirect with 'next' URL

        form = CommentForm(request.POST)
        if form.is_valid():
            pin_id = request.POST.get('pin_id')
            if pin_id:
                try:
                    pin = Pin.objects.get(id=pin_id)
                except Pin.DoesNotExist:
                    return redirect('home')

                comment = form.save(commit=False)
                comment.user = request.user
                comment.pin = pin
                comment.save()
                return redirect('home')

    comment_form = CommentForm()

    return render(request, 'pins/home.html', {
        'pins': pins,
        'query': query,
        'comment_form': comment_form,
    })

def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = SignUpForm()
    return render(request, 'pins/signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'pins/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')

@login_required
def upload_pin(request):
    if request.method == 'POST':
        form = PinForm(request.POST, request.FILES)
        if form.is_valid():
            pin = form.save(commit=False)
            pin.user = request.user
            pin.save()
            return redirect('home')
    else:
        form = PinForm()
    return render(request, 'pins/upload_pin.html', {'form': form})

@login_required
def like_pin(request, pin_id):
    pin = Pin.objects.get(id=pin_id)
    if request.user in pin.likes.all():
        pin.likes.remove(request.user)
    else:
        pin.likes.add(request.user)
    return redirect('home')  # Redirect to home page after action

@login_required
def edit_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id, user=request.user)  # Get comment for the logged-in user
    except Comment.DoesNotExist:
        return redirect('home')  # Redirect if comment doesn't exist or doesn't belong to the user

    if request.method == 'POST':
        form = CommentForm(request.POST, instance=comment)  # Pre-fill the form with the existing comment data
        if form.is_valid():
            form.save()
            return redirect('home')  # Redirect to home page after saving the edited comment
    else:
        form = CommentForm(instance=comment)  # Pre-fill the form with the existing comment data

    return render(request, 'pins/edit_comment.html', {'form': form})

@login_required
def profile(request):
    user_pins = Pin.objects.filter(user=request.user)  # Fetching all pins uploaded by the logged-in user
    
    # Handle pin deletion
    if request.method == 'POST':
        pin_id = request.POST.get('pin_id')
        if pin_id:
            try:
                pin = Pin.objects.get(id=pin_id, user=request.user)
                pin.delete()
                return redirect('profile')  # Redirect to profile after deletion
            except Pin.DoesNotExist:
                return redirect('profile')

    return render(request, 'pins/profile.html', {
        'user_pins': user_pins,
        'username': request.user.username,  # Pass the username for the welcome message
    })

@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)  # Keep the user logged in after password change
            messages.success(request, 'Your password has been successfully updated!')
            return redirect('profile')  # Redirect to the profile page after successful password change
    else:
        form = PasswordChangeForm(request.user)

    return render(request, 'pins/change_password.html', {'form': form})
