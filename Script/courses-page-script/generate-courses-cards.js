class SlideLoader {
    constructor(jsonPath, containerId) {
        this.jsonPath = jsonPath;
        this.containerId = containerId;
    }

    // Method to fetch course data from the JSON file
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

    // Method to render courses into the specified container
    renderCourses(courses) {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID "${this.containerId}" not found.`);
            return;
        }

        // Clear previous content
        container.innerHTML = "";

        // Render new cards
        courses.forEach((course, index) => {
            const slide = document.createElement("li");
            slide.className = "card-box";
            slide.innerHTML += `
            <div class="card course-card" data-index="${index}">
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
        });
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

    // Main method to load and display courses
    async load() {
        const courses = await this.fetchCourses();
        if (courses.length === 0) return;

        // Initial render
        this.renderCourses(courses);
        this.setupCardClickListeners(courses);
    }
}

// Instantiate and run the SlideLoader
document.addEventListener("DOMContentLoaded", () => {
    const slideLoader = new SlideLoader(
        "Json/courses.json",
        "courses-cards-section"
    );
    slideLoader.load();
});
