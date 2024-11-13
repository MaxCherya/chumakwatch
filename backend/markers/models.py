from django.db import models

class Marker(models.Model):
    id = models.AutoField(primary_key=True)
    marker_type = models.CharField(max_length=50)
    severity = models.IntegerField()
    commentar = models.TextField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.marker_type} at {self.latitude}, {self.longitude}"