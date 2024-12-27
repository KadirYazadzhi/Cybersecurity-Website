class SortingManager {
    constructor(containerSelector) {
        this.sortingContainers = document.querySelectorAll(containerSelector);
        this.initialize();
    }

    // Initialize event listeners for each sorting group
    initialize() {
        this.sortingContainers.forEach(container => {
            const allBox = container.querySelector(".sorting-box:first-child");
            const otherBoxes = Array.from(container.querySelectorAll(".sorting-box")).slice(1);

            container.addEventListener("click", (event) => this.handleClick(event, allBox, otherBoxes));
        });
    }

    // Handle the click event for sorting boxes
    handleClick(event, allBox, otherBoxes) {
        const clickedBox = event.target.closest(".sorting-box");
        if (!clickedBox) return;

        if (clickedBox === allBox) {
            // If "All" is clicked, deactivate all others and activate "All"
            this.activateAll(allBox, otherBoxes);
        } else {
            // Toggle the clicked box and handle group activation logic
            clickedBox.classList.toggle("active-box");
            this.handleGroupState(allBox, otherBoxes);
        }
    }

    // Activate "All" and deactivate all other boxes
    activateAll(allBox, otherBoxes) {
        allBox.classList.add("active-box");
        otherBoxes.forEach(box => box.classList.remove("active-box"));
    }

    // Handle the activation/deactivation logic for the group
    handleGroupState(allBox, otherBoxes) {
        const anyActive = otherBoxes.some(box => box.classList.contains("active-box"));

        if (!anyActive) {
            // If no boxes are active, activate "All"
            this.activateAll(allBox, otherBoxes);
        } else {
            // If any are active, ensure "All" is deactivated
            allBox.classList.remove("active-box");

            const allActive = otherBoxes.every(box => box.classList.contains("active-box"));
            if (allActive) {
                // If all are active, reset to "All"
                this.activateAll(allBox, otherBoxes);
            }
        }
    }
}

// Instantiate the SortingManager for the given selector
document.addEventListener("DOMContentLoaded", () => {
    new SortingManager(".sorting-box-container");
});
