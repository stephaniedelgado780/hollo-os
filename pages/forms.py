from django import forms
from .models import Sector, Resident, Checkin, Hazard_Report

class SectorForm(forms.ModelForm):
    class Meta:
        model = Sector
        fields = "__all__"

class ResidentForm(forms.ModelForm):
    class Meta:
        model = Resident
        fields = "__all__"

class CheckinForm(forms.ModelForm):
    class Meta:
        model = Checkin
        fields = "__all__"

class HazardReportForm(forms.ModelForm):
    class Meta:
        model = Hazard_Report
        fields = "__all__"
        