
/*
 * Hollo OS Dashboard
 * Temporary demonstration data.
 * Will be replaced with backend API data later.
 */

const dashboardData = {
    sectors: [
        { name: "A", status: "Safe" },
        { name: "B", status: "Safe" },
        { name: "C", status: "Warning" },
        { name: "D", status: "Safe" },
        { name: "E", status: "Hazard" },
        { name: "F", status: "Unknown" }
    ],

    activity: [
        {
            sector: "C",
            type: "Hazard Report",
            description: "Water quality concern reported",
            time: "10 minutes ago"
        },
        {
            sector: "A",
            type: "Check-In",
            description: "Resident completed daily check-in",
            time: "25 minutes ago"
        },
        {
            sector: "E",
            type: "Hazard Report",
            description: "Power instability reported",
            time: "1 hour ago"
        }
    ],

    participation: {
        completed: 468,
        total: 600
    },

    alerts: [
        {
            sector: "C",
            title: "Water Warning",
            description: "Possible contamination reported by residents.",
            severity: "warning"
        },
        {
            sector: "E",
            title: "Power Instability",
            description: "Multiple residents reporting unstable power.",
            severity: "hazard"
        }
    ]
};

function getParticipationPercentage() {
    const completed = dashboardData.participation.completed;
    const total = dashboardData.participation.total;

    if (total === 0) {
        return 0;
    }

    return Math.round((completed / total) * 100);
}

console.log("Hollo OS dashboard data loaded.");


/* =========================================
   DASHBOARD DISPLAY FUNCTIONS
   ========================================= */

// Display the six sector status cards
function displaySectors() {
    const container = document.getElementById("dashboard-sectors");

    container.innerHTML = "";

    dashboardData.sectors.forEach(function(sector) {
        const card = document.createElement("a");
        card.className = "dashboard-sector-card";
        card.href = "/map/";

        const name = document.createElement("span");
        name.className = "dashboard-sector-name";
        name.textContent = "Sector " + sector.name;

        const status = document.createElement("span");
        status.className =
            "dashboard-sector-status " + sector.status.toLowerCase();

        const dot = document.createElement("span");
        dot.className = "dashboard-status-dot";

        const statusText = document.createElement("span");
        statusText.textContent = sector.status;

        status.appendChild(dot);
        status.appendChild(statusText);

        card.appendChild(name);
        card.appendChild(status);

        container.appendChild(card);
    });
}


// Display recent community activity
function displayActivity() {
    const container = document.getElementById("dashboard-activity");

    container.innerHTML = "";

    dashboardData.activity.forEach(function(activity) {
        const item = document.createElement("div");
        item.className = "dashboard-activity-item";

        const icon = document.createElement("div");
        icon.className = "dashboard-activity-icon";

        if (activity.type === "Check-In") {
            icon.textContent = "✓";
        }
        else {
            icon.textContent = "!";
        }

        const text = document.createElement("div");
        text.className = "dashboard-activity-text";

        const title = document.createElement("strong");
        title.textContent = "Sector " + activity.sector
            + " — " + activity.type;

        const description = document.createElement("p");
        description.textContent = activity.description;

        const time = document.createElement("span");
        time.textContent = activity.time;

        text.appendChild(title);
        text.appendChild(description);
        text.appendChild(time);

        item.appendChild(icon);
        item.appendChild(text);

        container.appendChild(item);
    });
}


// Display the circular check-in participation chart
function displayParticipation() {
    const percentage = getParticipationPercentage();

    const ring = document.getElementById("participation-ring");
    const percentText = document.getElementById("participation-percent");
    const countText = document.getElementById("participation-count");

    percentText.textContent = percentage + "%";

    countText.textContent =
        dashboardData.participation.completed + " / " +
        dashboardData.participation.total + " residents";

    ring.style.background =
        "conic-gradient(#8cdbba 0% " + percentage +
        "%, #34464b " + percentage + "% 100%)";
}


// Display active hazard alerts
function displayAlerts() {
    const container = document.getElementById("dashboard-alerts");

    container.innerHTML = "";

    dashboardData.alerts.forEach(function(alert) {
        const item = document.createElement("div");
        item.className = "dashboard-alert-item " + alert.severity;

        const title = document.createElement("strong");
        title.textContent = "Sector " + alert.sector
            + " — " + alert.title;

        const description = document.createElement("p");
        description.textContent = alert.description;

        item.appendChild(title);
        item.appendChild(description);

        container.appendChild(item);
    });
}


// Initialize the dashboard
function initializeDashboard() {
    displaySectors();
    displayActivity();
    displayParticipation();
    displayAlerts();
}

document.addEventListener("DOMContentLoaded", initializeDashboard);
