import json

from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .forms import SectorForm, ResidentForm, CheckinForm, HazardReportForm
from .models import Sector, Resident, Checkin, Hazard_Report


def make_collection_api(model, form_class):
    @csrf_exempt
    @require_http_methods(["GET", "POST"])
    def view(request):
        if request.method == "GET":
            return JsonResponse(list(model.objects.values()), safe=False)

        try:
            payload = json.loads(request.body)
        except (json.JSONDecodeError, UnicodeDecodeError):
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        form = form_class(payload)

        if form.is_valid():
            obj = form.save()
            created = model.objects.filter(pk=obj.pk).values().first()
            return JsonResponse(created, status=201)

        return JsonResponse(
            {"errors": form.errors.get_json_data()},
            status=400
        )

    return view


def make_detail_api(model):
    @require_http_methods(["GET"])
    def view(request, pk):
        obj = model.objects.filter(pk=pk).values().first()

        if obj is None:
            return JsonResponse({"error": "Not found"}, status=404)

        return JsonResponse(obj)

    return view


# =========================================
# SECTOR API
# =========================================

sectors_api = make_collection_api(Sector, SectorForm)
sector_api = make_detail_api(Sector)


# =========================================
# RESIDENT API
# =========================================

residents_api = make_collection_api(Resident, ResidentForm)
resident_api = make_detail_api(Resident)


# =========================================
# CHECK-IN API
# =========================================

checkins_api = make_collection_api(Checkin, CheckinForm)
checkin_api = make_detail_api(Checkin)


# =========================================
# AUTOMATIC HAZARD EVALUATION
# =========================================

def update_sector_from_hazard(report):
    sector = report.sector

    severity = report.severity.strip().lower()
    hazard_type = report.hazard_type.strip().lower()

    # High and Critical reports mark the sector as hazardous
    if severity == "high" or severity == "critical":
        sector.status = "Hazard"

    # Moderate reports raise Safe sectors to Warning
    elif severity == "moderate":
        if sector.status.strip().lower() == "safe":
            sector.status = "Warning"

    # Low reports are recorded without changing sector conditions
    else:
        return

    # Update affected resources based on the hazard type
    if hazard_type == "power outage":
        sector.power = 0

    elif hazard_type == "water contamination":
        sector.water = "Unsafe"

    # Update the sector alert message
    sector.alert = (
        report.hazard_type +
        " reported (" +
        report.severity +
        " severity)"
    )

    # Save the updated sector to the database
    sector.save()


# =========================================
# HAZARD REPORT API
# =========================================

@csrf_exempt
@require_http_methods(["GET", "POST"])
def hazards_api(request):

    # Retrieve all saved hazard reports
    if request.method == "GET":
        return JsonResponse(
            list(Hazard_Report.objects.values()),
            safe=False
        )

    # Read the submitted report
    try:
        payload = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    form = HazardReportForm(payload)

    if form.is_valid():

        # Save both operations together
        with transaction.atomic():
            report = form.save()

            # Automatically evaluate and update the sector
            update_sector_from_hazard(report)

        created = Hazard_Report.objects.filter(
            pk=report.pk
        ).values().first()

        return JsonResponse(created, status=201)

    return JsonResponse(
        {"errors": form.errors.get_json_data()},
        status=400
    )


hazard_api = make_detail_api(Hazard_Report)
