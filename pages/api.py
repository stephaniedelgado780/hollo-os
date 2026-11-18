import json

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
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        form = form_class(payload)
        if form.is_valid():
            obj = form.save()
            created = model.objects.filter(pk=obj.pk).values().first()
            return JsonResponse(created, status=201)
        return JsonResponse({"errors": form.errors.get_json_data()}, status=400)

    return view


def make_detail_api(model):
    @require_http_methods(["GET"])
    def view(request, pk):
        obj = model.objects.filter(pk=pk).values().first()
        if obj is None:
            return JsonResponse({"error": "Not found"}, status=404)
        return JsonResponse(obj)

    return view


sectors_api = make_collection_api(Sector, SectorForm)
sector_api = make_detail_api(Sector)

residents_api = make_collection_api(Resident, ResidentForm)
resident_api = make_detail_api(Resident)

checkins_api = make_collection_api(Checkin, CheckinForm)
checkin_api = make_detail_api(Checkin)

hazards_api = make_collection_api(Hazard_Report, HazardReportForm)
hazard_api = make_detail_api(Hazard_Report)