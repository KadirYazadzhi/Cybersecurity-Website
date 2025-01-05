class PageProtection {
    // Constructor to initialize the protection logic
    constructor() {
        this.activeLanguage = localStorage.getItem("activeLanguage"); // Get the active language from localStorage
        this.activeCourseCard = localStorage.getItem("activeCourseCard"); // Get the active course card from localStorage
        this.page = window.location.href; // Get the current page URL
    }

    // Method to protect the page if no active data is found
    protectPage() {
        // If no active language or course is found, redirect to index.html
        if (!this.activeLanguage && !this.activeCourseCard) {
            window.location.href = 'index.html';
        }
    }

    // Method to handle the protection logic based on the current page
    handlePageProtection() {
        switch (this.page) {
            case "course.html":
                this.checkActiveData("activeCourseCard");
                break;
            case "language.html":
                this.checkActiveData("activeLanguage");
                break;
            default:
                this.protectPage(); // Default protection check
                break;
        }
    }

    // Method to check if the required data is available
    checkActiveData(dataType) {
        if (localStorage.getItem(dataType) === null) {
            window.location.href = 'index.html'; // Redirect to index.html if data is not found
        }
    }
}

// Instantiate the PageProtection class when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const protection = new PageProtection(); // Create a new instance of PageProtection
    protection.handlePageProtection(); // Handle page protection based on the current page
});
