from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.auth.views import redirect_to_login
from .forms import SignUpForm, PinForm, CommentForm, ProfileForm
from django.contrib.auth.decorators import login_required
from .models import Pin, Comment, Profile
from django.core.paginator import Paginator, EmptyPage
from django.contrib import messages
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.template.loader import render_to_string

def home(request):
    query = request.GET.get('q', '')
    # Shuffle pins with or without search query
    pins = Pin.objects.filter(title__icontains=query).select_related('user').prefetch_related('comments', 'likes').order_by('?') if query else Pin.objects.all().select_related('user').prefetch_related('comments', 'likes').order_by('?')
    paginator = Paginator(pins, 9)  # 9 pins per page
    pins_page = paginator.page(1)

    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect_to_login(request.get_full_path())
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
        'pins': pins_page,
        'query': query,
        'comment_form': comment_form,
    })

def load_more_pins(request):
         page = request.GET.get('page', 1)
         query = request.GET.get('q', '')
         # Shuffle pins with or without search query
         pins = Pin.objects.filter(title__icontains=query).select_related('user').prefetch_related('comments', 'likes').order_by('?') if query else Pin.objects.all().select_related('user').prefetch_related('comments', 'likes').order_by('?')
         paginator = Paginator(pins, 9)  # 9 pins per page
         try:
             pins_page = paginator.page(page)
         except EmptyPage:
             return JsonResponse({'has_next': False, 'html': ''})
         html = render_to_string('pins/pin_card.html', {
             'pins': pins_page,
             'user': request.user,
             'comment_form': CommentForm(),
         }, request=request)
         return JsonResponse({
             'has_next': pins_page.has_next(),
             'html': html,
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
    if not request.user.is_authenticated:
        return redirect_to_login(request.get_full_path())
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
    if not request.user.is_authenticated:
        return redirect_to_login(request.get_full_path())
    pin = Pin.objects.get(id=pin_id)
    if request.user in pin.likes.all():
        pin.likes.remove(request.user)
    else:
        pin.likes.add(request.user)
    return redirect('home')

@login_required
def edit_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id, user=request.user)
    except Comment.DoesNotExist:
        return redirect('home')

    if request.method == 'POST':
        form = CommentForm(request.POST, instance=comment)
        if form.is_valid():
            form.save()
            return redirect('home')
    else:
        form = CommentForm(instance=comment)

    return render(request, 'pins/edit_comment.html', {'form': form})

@login_required
def profile(request):
    user_pins = Pin.objects.filter(user=request.user)
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        if 'delete_profile_pic' in request.POST:
            if profile.profile_picture:
                profile.profile_picture.delete()
                profile.save()
                messages.success(request, 'Profile picture deleted successfully!')
                return redirect('profile')
        elif 'pin_id' in request.POST:
            try:
                pin = Pin.objects.get(id=request.POST.get('pin_id'), user=request.user)
                pin.delete()
                return redirect('profile')
            except Pin.DoesNotExist:
                return redirect('profile')
        else:
            profile_form = ProfileForm(request.POST, request.FILES, instance=profile)
            if profile_form.is_valid():
                profile_form.save()
                messages.success(request, 'Profile updated successfully!')
                return redirect('profile')
    else:
        profile_form = ProfileForm(instance=profile)

    return render(request, 'pins/profile.html', {
        'user_pins': user_pins,
        'username': request.user.username,
        'profile_form': profile_form,
        'profile': profile,
    })

@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            messages.success(request, 'Your password has been successfully updated!')
            return redirect('profile')
    else:
        form = PasswordChangeForm(request.user)

    return render(request, 'pins/change_password.html', {'form': form})

@login_required
def delete_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id, user=request.user)
        comment.delete()
    except Comment.DoesNotExist:
        pass
    return redirect('home')
