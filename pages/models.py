from django.db import models

class Sector(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    power = models.DecimalField(max_digits=5, decimal_places=2)
    water = models.CharField(max_length=100)
    alert = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Resident(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100)
    sector = models.ForeignKey('Sector', on_delete=models.CASCADE)
    mood = models.DecimalField(max_digits=2, decimal_places=1)
    health = models.CharField(max_length=100)

    def __str__(self):
        return self.username

class Checkin(models.Model):
    id = models.AutoField(primary_key=True)
    resident = models.ForeignKey('Resident', on_delete=models.CASCADE)
    sector = models.ForeignKey('Sector', on_delete=models.CASCADE)
    power = models.CharField(max_length=100)
    water = models.CharField(max_length=100)
    safety = models.CharField(max_length=100)
    notes = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Check-in {self.id} by {self.resident}"

class Hazard_Report(models.Model):
    id = models.AutoField(primary_key=True)
    resident = models.ForeignKey('Resident', on_delete=models.CASCADE)
    sector = models.ForeignKey('Sector', on_delete=models.CASCADE)
    hazard_type = models.CharField(max_length=100)
    severity = models.CharField(max_length=100)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Hazard Report {self.hazard_type} by {self.resident}"
