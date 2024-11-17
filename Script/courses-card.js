class SlideLoader {
    constructor(jsonPath, containerId, glideSelector) {
        this.jsonPath = jsonPath;
        this.containerId = containerId;
        this.glideSelector = glideSelector;
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

        courses.forEach((course, index) => {
            const slide = document.createElement('li');
            slide.className = 'glide__slide';
            slide.innerHTML = `
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

    // Method to initialize Glide.js for the courses carousel
    initializeGlide() {
        const glide = new Glide(this.glideSelector, {
            type: 'carousel',
            perView: 3.5,
            focusAt: 0,
            autoplay: 4000,
            breakpoints: {
                800: { perView: 2 },
                480: { perView: 1 }
            }
        });

        glide.mount();

        // Pause autoplay on hover
        const cards = document.querySelectorAll('.course-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => glide.pause());
            card.addEventListener('mouseleave', () => glide.play());
        });
    }

    // Method to save active course card details to localStorage
    setupCardClickListeners(courses) {
        const cards = document.querySelectorAll('.course-card');
        cards.forEach(card => {
            const index = card.dataset.index; // Retrieve the correct index from data attributes
            card.addEventListener('click', () => {
                const activeCourse = courses[index].title;
                localStorage.setItem('activeCourseCard', JSON.stringify(activeCourse));
                // TODO: Add method to open another page for more information about selected course
            });
        });
    }

    // Main method to load and display courses
    async load() {
        const courses = await this.fetchCourses();
        if (courses.length === 0) return;

        this.renderCourses(courses);
        this.initializeGlide();
        this.setupCardClickListeners(courses);
    }
}

// Instantiate and run the CourseLoader
document.addEventListener('DOMContentLoaded', () => {
    const courseLoader = new SlideLoader('Json/courses.json', 'courses', '.glide');
    courseLoader.load();
});
