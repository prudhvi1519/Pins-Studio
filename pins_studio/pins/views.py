from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.auth.decorators import login_required
from .forms import SignUpForm, PinForm, CommentForm, ProfileForm
from .models import Pin, Comment, Profile
from django.core.paginator import Paginator, EmptyPage
from django.contrib import messages
from django.http import JsonResponse, HttpResponseRedirect
from django.template.loader import render_to_string

def homepage(request):
    query = request.GET.get('q', '')
    pins = (
        Pin.objects.filter(title__icontains=query)
        .select_related('user')
        .prefetch_related('comments', 'likes')
        .order_by('-created_at')
        if query
        else Pin.objects.all()
        .select_related('user')
        .prefetch_related('comments', 'likes')
        .order_by('-created_at')
    )
    paginator = Paginator(pins, 9)  # 9 pins per page
    try:
        pins_page = paginator.page(1)
    except EmptyPage:
        pins_page = []

    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            pin_id = request.POST.get('pin_id')
            try:
                pin = Pin.objects.get(id=pin_id)
                comment = form.save(commit=False)
                comment.user = request.user
                comment.pin = pin
                comment.save()
                messages.success(request, 'Comment added successfully!')
                return redirect('home')
            except Pin.DoesNotExist:
                messages.error(request, 'Invalid pin!')
                return redirect('home')
        else:
            messages.error(request, 'Invalid comment form!')
    else:
        form = CommentForm()

    return render(request, 'pins/home.html', {
        'pins_page': pins_page,
        'query': query,
        'comment_form': form,
    })

def load_more_pins(request):
    page = request.GET.get('page', 1)
    query = request.GET.get('q', '')
    pins = (
        Pin.objects.filter(title__icontains=query)
        .select_related('user')
        .prefetch_related('comments', 'likes')
        .order_by('-created_at')
        if query
        else Pin.objects.all()
        .select_related('user')
        .prefetch_related('comments', 'likes')
        .order_by('-created_at')
    )
    paginator = Paginator(pins, 9)
    try:
        pins_page = paginator.page(page)
    except EmptyPage:
        return JsonResponse({'has_next': False, 'html': ''})

    html_content = render_to_string('pins/pin_card.html', {
        'pins': pins_page,  # Match template expectation
        'user': request.user,
        'comment_form': CommentForm(),
    }, request=request)
    return JsonResponse({
        'has_next': pins_page.has_next(),
        'html': html_content,
    })

def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'Account created successfully! Please log in.')
            return redirect('login')
        else:
            messages.error(request, 'Invalid signup form!')
    else:
        form = SignUpForm()
    return render(request, 'pins/signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, 'Logged in successfully!')
            return redirect('home')
        else:
            messages.error(request, 'Invalid login credentials!')
    else:
        form = AuthenticationForm()
    return render(request, 'pins/login.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.success(request, 'Logged out successfully!')
    return redirect('home')

@login_required
def upload_pin(request):
    if request.method == 'POST':
        form = PinForm(request.POST, request.FILES)
        if form.is_valid():
            pin = form.save(commit=False)
            pin.user = request.user
            pin.save()
            messages.success(request, 'Pin uploaded successfully!')
            return redirect('home')
        else:
            messages.error(request, 'Invalid pin form!')
    else:
        form = PinForm()
    return render(request, 'pins/upload_pin.html', {'form': form})

@login_required
def like_pin(request, pin_id):
    try:
        pin = Pin.objects.get(id=pin_id)
        if request.user in pin.likes.all():
            pin.likes.remove(request.user)
            messages.success(request, 'Pin unliked!')
        else:
            pin.likes.add(request.user)
            messages.success(request, 'Pin liked!')
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', 'home'))
    except Pin.DoesNotExist:
        messages.error(request, 'Pin not found!')
        return redirect('home')

@login_required
def edit_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id, user=request.user)
    if request.method == 'POST':
        form = CommentForm(request.POST, instance=comment)
        if form.is_valid():
            form.save()
            messages.success(request, 'Comment updated successfully!')
            return redirect('home')
        else:
            messages.error(request, 'Invalid comment form!')
    else:
        form = CommentForm(instance=comment)
    return render(request, 'pins/edit_comment.html', {'form': form})

@login_required
def profile(request):
    user_pins = Pin.objects.filter(user=request.user).order_by('-created_at')
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        if 'delete_profile_pic' in request.POST:
            if profile.profile_picture:
                profile.profile_picture.delete()
                profile.save()
                messages.success(request, 'Profile picture deleted successfully!')
        elif 'pin_id' in request.POST:
            try:
                pin = Pin.objects.get(id=request.POST.get('pin_id'), user=request.user)
                pin.delete()
                messages.success(request, 'Pin deleted successfully!')
            except Pin.DoesNotExist:
                messages.error(request, 'Pin not found!')
        else:
            profile_form = ProfileForm(request.POST, request.FILES, instance=profile)
            if profile_form.is_valid():
                profile_form.save()
                messages.success(request, 'Profile updated successfully!')
            else:
                messages.error(request, 'Invalid profile form!')
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
            messages.success(request, 'Password updated successfully!')
            return redirect('profile')
        else:
            messages.error(request, 'Invalid password change form!')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'pins/change_password.html', {'form': form})

@login_required
def delete_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id, user=request.user)
        comment.delete()
        messages.success(request, 'Comment deleted successfully!')
    except Comment.DoesNotExist:
        messages.error(request, 'Comment not found!')
    return redirect('home')
