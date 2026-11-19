
/*
 * HOLLO OS - SECTOR MAP
 * Retrieves sector information from Django API.
 */

// Store sector information returned by Django
let sectors = {};

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
