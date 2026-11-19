
/*
 * Hollo OS Hazard Reports
 * Connected to Django API.
 */

const reportForm = document.getElementById("report-form");
const reportMessage = document.getElementById("report-message");
const reportsList = document.getElementById("reports-list");

const DEMO_USERNAME = "demo_resident_a1";

let reports = [];


// Retrieve JSON data from Django
async function getApiData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to retrieve data from " + url);
    }

    return await response.json();
}


// Display recent community hazard reports
function displayReports() {
    reportsList.replaceChildren();

    if (reports.length === 0) {
        reportsList.textContent =
            "No hazard reports have been submitted yet.";
        return;
    }

    reports.forEach(function(report) {
        const card = document.createElement("div");
        card.classList.add("report-item");

        const title = document.createElement("h4");
        title.textContent =
            `Sector ${report.sector} — ${report.type}`;

        const severity = document.createElement("p");
        severity.textContent =
            `Severity: ${report.severity}`;

        const description = document.createElement("p");
        description.textContent = report.description;

        card.append(title, severity, description);
        reportsList.appendChild(card);
    });
}


// Load saved hazard reports from Django
async function loadReports() {
    try {
        const [hazards, sectors] = await Promise.all([
            getApiData("/api/hazards/"),
            getApiData("/api/sectors/")
        ]);

        if (!Array.isArray(hazards) || !Array.isArray(sectors)) {
            throw new Error("Unexpected API response");
        }

        // Match numeric sector IDs to sector names
        const sectorNames = {};

        sectors.forEach(function(sector) {
            sectorNames[sector.id] = sector.name;
        });

        reports = hazards.map(function(hazard) {
            return {
                sector: sectorNames[hazard.sector_id] || "Unknown",
                type: hazard.hazard_type,
                severity: hazard.severity,
                description: hazard.description,
                timestamp: hazard.timestamp
            };
        });

        // Show newest reports first
        reports.sort(function(a, b) {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        displayReports();

        console.log("Hazard reports loaded from Django:", reports);
    }
    catch (error) {
        console.error("Error loading hazard reports:", error);

        reports = [];
        reportsList.textContent =
            "Unable to load community hazard reports.";
    }
}


// Submit a new hazard report
reportForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const submitButton = reportForm.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;
    reportMessage.textContent = "Submitting hazard report...";

    try {
        const sectorName =
            document.getElementById("report-sector").value;

        const type =
            document.getElementById("hazard-type").value;

        const severity =
            document.getElementById("severity").value;

        const description =
            document.getElementById("report-description").value.trim();

        if (!description) {
            reportMessage.textContent =
                "Please describe the hazard.";
            return;
        }

        // Retrieve sectors and residents
        const [sectors, residents] = await Promise.all([
            getApiData("/api/sectors/"),
            getApiData("/api/residents/")
        ]);

        // Find the selected sector's database ID
        const selectedSector = sectors.find(function(sector) {
            return sector.name === sectorName;
        });

        if (!selectedSector) {
            throw new Error("Selected sector was not found.");
        }

        // Find the temporary demo resident
        const resident = residents.find(function(person) {
            return person.username === DEMO_USERNAME;
        });

        if (!resident) {
            throw new Error(
                "Demo resident was not found. Create the resident first."
            );
        }

        // Match the fields expected by Ian's HazardReportForm
        const reportData = {
            resident: resident.id,
            sector: selectedSector.id,
            hazard_type: type,
            severity: severity,
            description: description
        };

        // Submit the report to Django
        const response = await fetch("/api/hazards/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reportData)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Django validation errors:", result);
            throw new Error("Django could not save the hazard report.");
        }

        console.log("Hazard report saved to Django:", result);

        reportMessage.textContent =
            `Hazard report successfully submitted for Sector ${sectorName}!`;

        reportForm.reset();

        // Refresh the recent reports list
        await loadReports();
    }
    catch (error) {
        console.error("Hazard report submission error:", error);

        reportMessage.textContent =
            "Unable to complete request: " + error.message;
    }
    finally {
        submitButton.disabled = false;
    }
});


// Load reports when the page opens
loadReports();
