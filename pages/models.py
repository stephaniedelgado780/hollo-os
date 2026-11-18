from django.db import models

class Sector(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    power = models.DecimalField(max_digits=3, decimal_places=2)
    water = models.CharField(max_length=100)
    alert = models.CharField(max_length=100)

class Resident(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100)
    sector = models.ForeignKey('Sector', on_delete=models.CASCADE)
    mood = models.DecimalField(max_digits=2, decimal_places=1)
    health = models.CharField(max_length=100)

class Checkin(models.Model):
    id = models.AutoField(primary_key=True)
    resident = models.ForeignKey('Resident', on_delete=models.CASCADE)
    sector = models.ForeignKey('Sector', on_delete=models.CASCADE)
    power = models.CharField(max_length=100)
    water = models.CharField(max_length=100)
    saftey = models.CharField(max_length=100)
    notes = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class Hazard_Report(models.Model):
    id = models.AutoField(primary_key=True)
    resident = models.ForeignKey('Resident', on_delete=models.CASCADE)
    sector = models.ForeignKey('Sector', on_delete=models.CASCADE)
    hazard_type = models.CharField(max_length=100)
    severity = models.CharField(max_length=100)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.title
# Create your models here.
