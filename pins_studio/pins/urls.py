from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('upload_pin/', views.upload_pin, name='upload_pin'),
    path('like_pin/<int:pin_id>/', views.like_pin, name='like_pin'),
    path('edit_comment/<int:comment_id>/', views.edit_comment, name='edit_comment'),
    path('profile/', views.profile, name='profile'),
    path('change_password/', views.change_password, name='change_password'),
    path('load-more-pins/', views.load_more_pins, name='load_more_pins'),
    path('delete_comment/<int:comment_id>/', views.delete_comment, name='delete_comment'),
    path('healthz/', views.healthz, name='healthz'),
]
