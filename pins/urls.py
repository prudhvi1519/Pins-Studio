from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/', views.signup_view, name='signup'),
    path('upload/', views.upload_pin, name='upload_pin'),
    path('', views.home, name='home'),
    path('like_pin/<int:pin_id>/', views.like_pin, name='like_pin'),
    path('edit_comment/<int:comment_id>/', views.edit_comment, name='edit_comment'),
    path('profile/', views.profile, name='profile'),
    path('change_password/', views.change_password, name='change_password'),
]
