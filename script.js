function calculateArea() {
    let length = document.getElementById("length").value;
    let width = document.getElementById("width").value;
    let unit = document.getElementById("unit").value;

    if (length <= 0 || width <= 0) {
        alert("Please enter valid dimensions.");
        return;
    }

    let area = length * width;
    
    // Convert area based on unit
    if (unit === "acre") {
        area /= 43560; // Convert sq ft to acres
    } else if (unit === "sqm") {
        area *= 0.092903; // Convert sq ft to sqm
    }

    document.getElementById("result").innerText = `Area: ${area.toFixed(2)} ${unit}`;
}
