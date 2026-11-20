
/*
 * HOLLO OS - SECTOR MAP
 * Retrieves sector information from Django API.
 */

// Store sector information returned by Django
let sectors = {};

// Passages connect neighbors horizontally and vertically on the sector map.
const passages = {
    A: ["B", "D"],
    B: ["A", "C", "E"],
    C: ["B", "F"],
    D: ["A", "E"],
    E: ["B", "D", "F"],
    F: ["C", "E"]
};

function getPowerPercent(value) {
    if (value == null || String(value).trim() === "") return null;

    const power = Number(value);
    return Number.isFinite(power) && power >= 0 && power <= 100 ? power : null;
}

function getRouteAdvice(start) {
    const origin = sectors[start];
    const status = origin?.status?.trim().toLowerCase();

    if (status === "safe") return "This sector is marked safe.";
    if (status !== "warning" && status !== "hazard") {
        return "Routing unavailable until the sector status is known.";
    }

    const minimumPower = 80;
    const needsWater = /unsafe|contaminat|warning/i.test(origin.water);
    const originPower = getPowerPercent(origin.power);
    const needsPower = originPower !== null && originPower < minimumPower;

    // BFS checks routes with one passage first, then two, and so on.
    const routes = [[start]];
    const visited = new Set([start]);

    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const current = route[route.length - 1];

        for (const next of passages[current]) {
            if (visited.has(next)) continue;
            visited.add(next);

            const sector = sectors[next];
            if (sector?.status?.trim().toLowerCase() !== "safe") continue;

            const nextRoute = [...route, next];
            const hasSafeWater = sector.water?.trim().toLowerCase() === "safe";
            const power = getPowerPercent(sector.power);
            const hasEnoughPower = power !== null && power >= minimumPower;

            if ((!needsWater || hasSafeWater) && (!needsPower || hasEnoughPower)) {
                const reasons = ["marked safe"];
                if (needsWater) reasons.push("water rated safe");
                if (needsPower) reasons.push(`${power}% power`);

                return `Recommended sector: ${next}. Route: ${nextRoute.join(" → ")}. Reason: ${reasons.join(", ")}.`;
            }

            routes.push(nextRoute);
        }
    }

    return "No safe route available that meets this sector's needs.";
}

// Get all sector buttons
const sectorButtons = document.querySelectorAll(".sector");


// Display information for a selected sector
function displaySector(sectorId) {
    const sector = sectors[sectorId];

    if (!sector) {
        document.getElementById("sector-name").textContent =
            `Sector ${sectorId}`;

        document.getElementById("sector-status").textContent =
            "Status: No data available";

        document.getElementById("sector-power").textContent =
            "Power Supply: Unknown";

        document.getElementById("sector-water").textContent =
            "Water Quality: Unknown";

        document.getElementById("sector-alert").textContent =
            "Alert: No monitoring data available";

        return;
    }

    //ensures sector data is not missing before calling route advice
    document.getElementById("sector-route").textContent = getRouteAdvice(sectorId);

    document.getElementById("sector-name").textContent =
        `Sector ${sectorId}`;

    document.getElementById("sector-status").textContent =
        `Status: ${sector.status}`;

    const power = sector.status.toLowerCase() === "unknown"
        || sector.power === null
        ? "Unknown"
        : `${sector.power}%`;

    document.getElementById("sector-power").textContent =
        `Power Supply: ${power}`;

    document.getElementById("sector-water").textContent =
        `Water Quality: ${sector.water}`;

    document.getElementById("sector-alert").textContent =
        `Alert: ${sector.alert}`;
}


// Retrieve sector data from Ian's API
async function loadSectors() {
    try {
        const response = await fetch("/api/sectors/");

        if (!response.ok) {
            throw new Error("Failed to retrieve sectors");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Unexpected sector API response");
        }

        // Convert the array into an object indexed by sector name
        sectors = {};

        data.forEach(function(sector) {
            sectors[sector.name] = sector;
        });

        // Update sector button colors based on database statuses
        sectorButtons.forEach(function(button) {
            const sectorId = button.dataset.sector;
            const sector = sectors[sectorId];


        button.classList.remove(
            "safe-sector",
            "warning-sector",
            "danger-sector",
            "unknown-sector"
        );

        const status = sector
            ? sector.status.toLowerCase()
            : "unknown";

        if (status === "safe") {
            button.classList.add("safe-sector");
        }
        else if (status === "warning") {
            button.classList.add("warning-sector");
        }
        else if (status === "hazard") {
            button.classList.add("danger-sector");
        }
        else {
            button.classList.add("unknown-sector");
        }

        });

        console.log("Sector data loaded from Django:", sectors);

        // Refresh details if a sector is already selected
        const selectedButton =
            document.querySelector(".sector.selected");

        if (selectedButton) {
            displaySector(selectedButton.dataset.sector);
        }

    }
    catch (error) {
        console.error("Error loading sectors:", error);

        document.getElementById("sector-alert").textContent =
            "Alert: Unable to load sector information.";
    }
}


// Handle sector button clicks
sectorButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const sectorId = button.dataset.sector;

        displaySector(sectorId);

        sectorButtons.forEach(function(btn) {
            btn.classList.remove("selected");
            btn.setAttribute("aria-pressed", "false");
        });

        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
    });
});


// Load database information when the page opens
loadSectors();
