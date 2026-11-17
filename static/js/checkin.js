
const checkinForm = document.getElementById("checkin-form");
const checkinMessage = document.getElementById("checkin-message");

checkinForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const sector = document.getElementById("sector").value;
    const power = document.getElementById("power").value;
    const water = document.getElementById("water").value;
    const safety = document.getElementById("safety").value;
    const notes = document.getElementById("notes").value;

    const checkinData = {
        sector: sector,
        power: power,
        water: water,
        safety: safety,
        notes: notes
    };

    console.log("Demo check-in:", checkinData);

    checkinMessage.textContent =
        `Demo check-in recorded for Sector ${sector}. ` +
        "Backend submission is not connected yet.";

    checkinForm.reset();
});
