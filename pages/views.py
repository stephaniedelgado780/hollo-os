from django.http import JsonResponse
from django.shortcuts import render, redirect
from .forms import SectorForm, ResidentForm, CheckinForm, HazardReportForm
from .models import Sector, Resident, Checkin, Hazard_Report

def make_add_view(form_class, list_name, title):
    def view(request):
        if request.method == 'POST':
            form = form_class(request.POST)
            if form.is_valid():
                form.save()
                return redirect(list_name)
        else:
            form = form_class()
        return render(request, 'pages/add.html', {'form': form, "title": title})
    return view

def make_list_view(model, add_name, title):
    def view(request):
        return render(request, "pages/list.html", {
            "objects": model.objects.all(),
            "add_name": add_name,
            "title": title
        })
    return view

sector_list_view = make_list_view(Sector, "Add_Sector", "Sector List")
sector_add = make_add_view(SectorForm, "Sector_List", "Add Sector")

resident_list_view = make_list_view(Resident, "Add_Resident", "Resident List")
resident_add = make_add_view(ResidentForm, "Resident_List", "Add Resident")

checkin_list_view = make_list_view(Checkin, "Add_Check-in", "Check-ins")
checkin_add = make_add_view(CheckinForm, "Check-in_List", "Add Check-in")

hazard_report_add = make_add_view(HazardReportForm, "Hazard_Add", "Add Hazard Report")
hazard_report_list_view = make_list_view(Hazard_Report, "Hazard_List", "Hazard Report List")
<<<<<<< HEAD

def sector_api(request):
    if request.method != "GET":
        return JsonResponse(
            {"error": "GET requests only"},
            status=405
        )

    sectors = list(
        Sector.objects.values(
            "id",
            "name",
            "status",
            "power",
            "water",
            "alert"
        )
    )
    
    return JsonResponse({"sectors": sectors})
=======
>>>>>>> origin/main
