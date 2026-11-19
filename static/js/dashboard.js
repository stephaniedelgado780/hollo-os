
/*
 * Hollo OS Dashboard
 * Temporary demonstration data.
 * Will be replaced with backend API data later.
 */

let dashboardData = {
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

    // Display a message if there are no check-ins or hazard reports
    if (dashboardData.activity.length === 0) {
        container.textContent =
            "No recent community activity. Check-ins and hazard reports will appear here.";
        return;
    }

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



/* =========================================
   DJANGO API INTEGRATION
   ========================================= */

// Retrieve the latest sector information from Django
async function loadDashboardData() {
    try {
        const response = await fetch("/api/sectors/");

        if (!response.ok) {
            throw new Error("Failed to retrieve sector data");
        }

        const sectors = await response.json();

        if (!Array.isArray(sectors)) {
            throw new Error("Unexpected sector API response");
        }

        // Replace demonstration sectors with database records
        dashboardData.sectors = sectors;

        // Create active alerts from warning and hazard sectors
        dashboardData.alerts = sectors
            .filter(function(sector) {
                const status = sector.status.toLowerCase();

                return status === "warning" || status === "hazard";
            })
            .map(function(sector) {
                return {
                    sector: sector.name,
                    title: sector.status === "Warning"
                        ? "Sector Warning"
                        : "Sector Hazard",
                    description: sector.alert,
                    severity: sector.status.toLowerCase()
                };
            });

        // Refresh the dashboard using the latest database data
        displaySectors();
        displayAlerts();

        console.log("Dashboard connected to Django API:", sectors);
    }
    catch (error) {
        console.error("Error loading dashboard data:", error);

        // Avoid presenting demonstration data as live information
        dashboardData.sectors = [];
        dashboardData.alerts = [];

        displaySectors();
        displayAlerts();

        document.getElementById("dashboard-sectors").textContent =
            "Unable to load sector information.";

        document.getElementById("dashboard-alerts").textContent =
            "Unable to load current alerts.";
    }
}


/* =========================================
   COMMUNITY ACTIVITY API
   ========================================= */

async function loadCommunityActivity() {
    try {
        const responses = await Promise.all([
            fetch("/api/checkins/"),
            fetch("/api/hazards/"),
            fetch("/api/sectors/")
        ]);

        for (const response of responses) {
            if (!response.ok) {
                throw new Error("Failed to retrieve community activity");
            }
        }

        const [checkins, hazards, sectors] = await Promise.all(
            responses.map(response => response.json())
        );

        if (!Array.isArray(checkins) ||
            !Array.isArray(hazards) ||
            !Array.isArray(sectors)) {
            throw new Error("Unexpected API response");
        }

        // Match Django's numeric sector IDs to sector names
        const sectorNames = {};

        sectors.forEach(function(sector) {
            sectorNames[sector.id] = sector.name;
        });

        const checkinActivity = checkins.map(function(checkin) {
            return {
                sector: sectorNames[checkin.sector_id] || "Unknown",
                type: "Check-In",
                description: "Resident completed daily check-in",
                time: new Date(checkin.timestamp).toLocaleString(),
                timestamp: checkin.timestamp
            };
        });

        const hazardActivity = hazards.map(function(hazard) {
            return {
                sector: sectorNames[hazard.sector_id] || "Unknown",
                type: "Hazard Report",
                description: hazard.hazard_type + " — " + hazard.severity,
                time: new Date(hazard.timestamp).toLocaleString(),
                timestamp: hazard.timestamp
            };
        });

        dashboardData.activity = [
            ...checkinActivity,
            ...hazardActivity
        ];

        // Show newest activity first
        dashboardData.activity.sort(function(a, b) {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        displayActivity();

        console.log(
            "Community activity loaded from Django:",
            dashboardData.activity
        );
    }
    catch (error) {
        console.error("Error loading community activity:", error);

        dashboardData.activity = [];
        displayActivity();

        document.getElementById("dashboard-activity").textContent =
            "Unable to load community activity.";
    }
}


/* =========================================
   CHECK-IN PARTICIPATION API
   ========================================= */

// Calculate today's participation using Django data
async function loadParticipation() {
    try {
        const responses = await Promise.all([
            fetch("/api/residents/"),
            fetch("/api/checkins/")
        ]);

        for (const response of responses) {
            if (!response.ok) {
                throw new Error("Failed to retrieve participation data");
            }
        }

        const [residents, checkins] = await Promise.all(
            responses.map(response => response.json())
        );

        if (!Array.isArray(residents) || !Array.isArray(checkins)) {
            throw new Error("Unexpected participation API response");
        }

        // Count registered residents
        const totalResidents = residents.length;

        // Get today's date using the browser's local timezone
        const today = new Date().toDateString();

        // Store unique resident IDs who checked in today
        const checkedInResidents = new Set();

        checkins.forEach(function(checkin) {
            const checkinDate = new Date(checkin.timestamp);

            if (checkinDate.toDateString() === today) {
                checkedInResidents.add(checkin.resident_id);
            }
        });

        // Only count check-ins belonging to registered residents
        const registeredIds = new Set(
            residents.map(function(resident) {
                return resident.id;
            })
        );

        let completed = 0;

        checkedInResidents.forEach(function(residentId) {
            if (registeredIds.has(residentId)) {
                completed++;
            }
        });

        dashboardData.participation = {
            completed: completed,
            total: totalResidents
        };

        displayParticipation();

        console.log(
            "Participation loaded from Django:",
            dashboardData.participation
        );
    }
    catch (error) {
        console.error("Error loading participation:", error);

        // Show unavailable instead of fictional statistics
        document.getElementById("participation-percent").textContent =
            "N/A";

        document.getElementById("participation-count").textContent =
            "Participation data unavailable";

        document.getElementById("participation-ring").style.background =
            "conic-gradient(#34464b 0% 100%)";
    }
}


// Initialize the dashboard

function initializeDashboard() {
    // Clear demonstration data before loading
    dashboardData.sectors = [];
    dashboardData.alerts = [];
    dashboardData.activity = [];

    // Reset participation until real data loads
    dashboardData.participation = {
        completed: 0,
        total: 0
    };

    displaySectors();
    displayActivity();
    displayParticipation();
    displayAlerts();

    // Retrieve real data from Django
    loadDashboardData();
    loadCommunityActivity();
    loadParticipation();
}



document.addEventListener("DOMContentLoaded", initializeDashboard);

