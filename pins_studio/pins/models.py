from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Pin model with a likes ManyToManyField
class Pin(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='pins/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, related_name='liked_pins', blank=True, through='Pin_likes')

    def __str__(self):
        return self.title

    def like_count(self):
        return self.likes.count()

# Pin_likes intermediate model for likes
class Pin_likes(models.Model):
    pin = models.ForeignKey(Pin, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('pin', 'user')

# Comment model related to Pin and User
class Comment(models.Model):
    pin = models.ForeignKey(Pin, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.pin.title}"

# Profile model related to the User model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.user.username
