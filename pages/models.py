from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    done = models.BooleanField(default=False)

    def _str_(self):
        return self.title
# Create your models here.
