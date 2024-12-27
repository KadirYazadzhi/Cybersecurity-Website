class SlideLoader {
    constructor(jsonPath, containerId, pageNumberContainer, sortingContainerSelector) {
        this.jsonPath = jsonPath;
        this.containerId = containerId;
        this.pagesChangerContainer = document.querySelector(pageNumberContainer);
        this.sortingContainers = document.querySelectorAll(sortingContainerSelector);
        this.maxCoursePerPage = 16;
        this.currentPage = 1;
        this.courses = [];
        this.filteredCourses = []; // Store filtered courses
    }

    // Fetch course data from the JSON file
    async fetchCourses() {
        try {
            const response = await fetch(this.jsonPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch courses: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching courses:", error);
            return [];
        }
    }

    // Generate page number changers and arrow listeners
    generatePagesNumberChanger() {
        const totalPages = Math.ceil(this.filteredCourses.length / this.maxCoursePerPage);
        const numbersContainer = this.pagesChangerContainer;
        const numbersElement = numbersContainer.querySelector(".numbers");
        numbersElement.innerHTML = ""; // Clear existing page numbers

        // Generate page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageNumberBox = document.createElement("div");
            pageNumberBox.classList.add("page-number-box");
            if (i === this.currentPage) pageNumberBox.classList.add("active-page");

            const text = document.createElement("p");
            text.innerText = i.toString();
            pageNumberBox.appendChild(text);
            numbersElement.appendChild(pageNumberBox);

            // Add click listener to change page
            pageNumberBox.addEventListener("click", () => {
                this.currentPage = i;
                this.renderCourses();
            });
        }

        // Add event listeners for arrows
        const leftDoubleArrow = numbersContainer.querySelector(".fa-angles-left");
        const leftSingleArrow = numbersContainer.querySelector(".fa-chevron-left");
        const rightSingleArrow = numbersContainer.querySelector(".fa-chevron-right");
        const rightDoubleArrow = numbersContainer.querySelector(".fa-angles-right");

        leftDoubleArrow.parentElement.addEventListener("click", () => {
            this.currentPage = 1;
            this.renderCourses();
        });

        leftSingleArrow.parentElement.addEventListener("click", () => {
            if (this.currentPage > 1) {
                this.currentPage -= 1;
                this.renderCourses();
            }
        });

        rightSingleArrow.parentElement.addEventListener("click", () => {
            if (this.currentPage < totalPages) {
                this.currentPage += 1;
                this.renderCourses();
            }
        });

        rightDoubleArrow.parentElement.addEventListener("click", () => {
            this.currentPage = totalPages;
            this.renderCourses();
        });
    }

    // Render courses for the current page
    renderCourses() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID "${this.containerId}" not found.`);
            return;
        }

        container.innerHTML = ""; // Clear previous content

        const startIndex = (this.currentPage - 1) * this.maxCoursePerPage;
        const endIndex = Math.min(startIndex + this.maxCoursePerPage, this.filteredCourses.length);

        for (let i = startIndex; i < endIndex; i++) {
            const course = this.filteredCourses[i];
            const slide = document.createElement("li");
            slide.className = "card-box";
            slide.innerHTML = `
            <div class="card course-card" data-index="${i}">
                <div class="course-card-top">
                    <div class="topic-card">
                        <p class="topic-small-text">${course.category}</p>
                    </div>
                    <img src="${course.image}" alt="${course.title}">
                </div>
                <div class="course-card-medium">
                    <h1 class="heading-xs">${course.title}</h1>
                    <p class="paragraph-small course-text">${course.description}</p>
                </div>
                <div class="course-card-bottom">
                    <ul class="course-card-list">
                        <li><i class="fa-solid fa-location-dot"></i> ${course.location}</li>
                        <li><i class="fa-regular fa-calendar"></i> ${course.duration}</li>
                    </ul>
                    <ul class="course-card-list">
                        <li><i class="fa-solid ${course.iconType}"></i> ${course.difficulty}</li>
                        <li><i class="fa-solid fa-award"></i> ${course.certificate}</li>
                    </ul>
                </div>
            </div>
            `;
            container.appendChild(slide);
        }

        this.generatePagesNumberChanger();
        this.setupCardClickListeners();
    }


    setupCardClickListeners(courses) {
        const cards = document.querySelectorAll('.course-card');
        cards.forEach(card => {
            const index = card.dataset.index; // Retrieve the correct index from data attributes
            card.addEventListener('click', () => {
                const activeCourse = courses[index].title;
                localStorage.setItem('activeCourseCard', activeCourse);
                window.location.href = 'course.html';
            });
        });
    }

    // Apply filters based on the active sorting options
    applyFilters() {
        this.filteredCourses = this.courses;

        this.sortingContainers.forEach(container => {
            const activeBoxes = container.querySelectorAll(".active-box");
            if (activeBoxes.length > 0 && !activeBoxes[0].innerText.includes("All")) {
                const filterCriteria = Array.from(activeBoxes).map(box => box.innerText.trim());
                this.filteredCourses = this.filteredCourses.filter(course =>
                    filterCriteria.includes(course.category) ||
                    filterCriteria.includes(course.difficulty) ||
                    filterCriteria.includes(course.duration[0]) ||
                    filterCriteria.includes(course.certificate)
                );
            }
        });

        this.currentPage = 1; // Reset to the first page after filtering
        this.renderCourses();
    }

    // Setup click listeners for the sorting buttons
    setupSortingListeners() {
        this.sortingContainers.forEach(container => {
            container.addEventListener("click", () => this.applyFilters());
        });
    }

    // Main method to load and display courses
    async load() {
        this.courses = await this.fetchCourses();
        if (this.courses.length === 0) return;

        this.filteredCourses = this.courses; // Initially, all courses are shown
        this.setupSortingListeners(); // Initialize sorting listeners
        this.renderCourses();
    }
}

// Instantiate and run the SlideLoader
document.addEventListener("DOMContentLoaded", () => {
    const slideLoader = new SlideLoader(
        "Json/courses.json",
        "courses-cards-section",
        ".numbers-container",
        ".sorting-box-container"
    );
    slideLoader.load();
});

