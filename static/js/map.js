
const sectors = {
    A: {
        status: "Safe",
        power: "95%",
        water: "Safe",
        alert: "No active warnings."
    },

    B: {
        status: "Safe",
        power: "90%",
        water: "Safe",
        alert: "No active warnings."
    },

    C: {
        status: "Warning",
        power: "72%",
        water: "Potential contamination",
        alert: "Residents reported unusual water conditions."
    },

    D: {
        status: "Safe",
        power: "88%",
        water: "Safe",
        alert: "No active warnings."
    },

    E: {
        status: "Hazard",
        power: "35%",
        water: "Unsafe",
        alert: "Critical power instability detected."
    },

    F: {
        status: "Unknown",
        power: "Unknown",
        water: "Unknown",
        alert: "Insufficient monitoring data."
    }
};

const sectorButtons = document.querySelectorAll(".sector");

sectorButtons.forEach(button => {
    button.addEventListener("click", () => {
        const sectorId = button.dataset.sector;
        const sector = sectors[sectorId];

        document.getElementById("sector-name").textContent =
            `Sector ${sectorId}`;

        document.getElementById("sector-status").textContent =
            `Status: ${sector.status}`;

        document.getElementById("sector-power").textContent =
            `Power Supply: ${sector.power}`;

        document.getElementById("sector-water").textContent =
            `Water Quality: ${sector.water}`;

        document.getElementById("sector-alert").textContent =
            `Alert: ${sector.alert}`;

        sectorButtons.forEach(btn => {
            btn.classList.remove("selected");
            btn.setAttribute("aria-pressed", "false");
        });

        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
    });
});
