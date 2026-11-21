
const checkinForm = document.getElementById("checkin-form");
const checkinMessage = document.getElementById("checkin-message");



// Load JSON data from Django
async function getApiData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to retrieve data from " + url);
    }

    return await response.json();
}


// Submit a check-in to Django
checkinForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const submitButton = checkinForm.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;
    checkinMessage.textContent = "Submitting your check-in...";

    try {
        const sectorName = document.getElementById("sector").value;
        const power = document.getElementById("power").value;
        const water = document.getElementById("water").value;
        const safety = document.getElementById("safety").value;
        const notes = document.getElementById("notes").value;

        // Retrieve the sectors and residents from Django
        const [sectors, residents] = await Promise.all([
            getApiData("/api/sectors/"),
            getApiData("/api/residents/")
        ]);

        // Find the database ID for the selected sector
        const selectedSector = sectors.find(function(sector) {
            return sector.name === sectorName;
        });

        if (!selectedSector) {
            throw new Error("Selected sector was not found.");
        }

        // Find a test resident who belongs to the selected sector
        const resident = residents.find(function(person) {
            return Number(person.sector_id) === Number(selectedSector.id);
        });

        if (!resident) {
            throw new Error(
                `No test resident exists for Sector ${sectorName}.`
            );
        }

        // Match the fields expected by Ian's Django ModelForm
        const checkinData = {
            resident: resident.id,
            sector: selectedSector.id,
            power: power,
            water: water,
            safety: safety,
            notes: notes
        };

        // Send the check-in to Django
        const response = await fetch("/api/checkins/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(checkinData)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Django validation errors:", result);
            throw new Error("Django could not save the check-in.");
        }

        console.log("Check-in saved to Django:", result);

        checkinMessage.textContent =
            `Check-in successfully submitted for Sector ${sectorName}!`;

        checkinForm.reset();
    }
    catch (error) {
        console.error("Check-in submission error:", error);
        checkinMessage.textContent =
            "Unable to submit check-in: " + error.message;
    }
    finally {
        submitButton.disabled = false;
    }
});
