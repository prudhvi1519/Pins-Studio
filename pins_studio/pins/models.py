from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Pin(models.Model):
    # Pin model for storing pin details
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='pins/', blank=True, null=True)
    source_url = models.URLField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pins')
    likes = models.ManyToManyField(User, related_name='liked_pins', blank=True, through='PinLike')

    def __str__(self):
        return self.title

    def like_count(self):
        return self.likes.count()

class PinLike(models.Model):    # Intermediate model for pin likes
    pin = models.ForeignKey(Pin, on_delete=models.CASCADE, related_name='pin_likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_likes')

    class Meta:
        unique_together = ('pin', 'user')
        indexes = [
            models.Index(fields=['user', 'pin']),
        ]

class Comment(models.Model):    # Comment model for pin comments
    pin = models.ForeignKey(Pin, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.pin.title}"

    class Meta:
        indexes = [
            models.Index(fields=['pin', 'created_at']),
        ]

class Profile(models.Model):    # User profile model
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.user.username
