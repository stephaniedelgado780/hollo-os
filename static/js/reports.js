
const reportForm = document.getElementById("report-form");
const reportMessage = document.getElementById("report-message");
const reportsList = document.getElementById("reports-list");

// Temporary demonstration data
const reports = [
    {
        sector: "C",
        type: "Water Contamination",
        severity: "High",
        description: "Residents reported unusual water color."
    },
    {
        sector: "E",
        type: "Power Outage",
        severity: "Critical",
        description: "Multiple buildings without electricity."
    }
];

function displayReports() {
    reportsList.replaceChildren();

    reports.forEach(report => {
        const card = document.createElement("div");
        card.classList.add("report-item");

        const title = document.createElement("h4");
        title.textContent = `Sector ${report.sector} — ${report.type}`;

        const severity = document.createElement("p");
        severity.textContent = `Severity: ${report.severity}`;

        const description = document.createElement("p");
        description.textContent = report.description;

        card.append(title, severity, description);
        reportsList.appendChild(card);
    });
}

reportForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const sector = document.getElementById("report-sector").value;
    const type = document.getElementById("hazard-type").value;
    const severity = document.getElementById("severity").value;
    const description = document.getElementById("report-description").value.trim();

    if (!description) {
        reportMessage.textContent = "Please describe the hazard.";
        return;
    }

    const newReport = {
        sector: sector,
        type: type,
        severity: severity,
        description: description
    };

    // Add the new report to the beginning of the list
    reports.unshift(newReport);

    displayReports();

    reportMessage.textContent =
        "Demo report added. It has not been saved to the database.";

    reportForm.reset();
});

// Show the initial demonstration reports
displayReports();
