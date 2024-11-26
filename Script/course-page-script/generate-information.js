// Main application class
class CourseApp {
    constructor(jsonPath) {
        this.jsonPath = jsonPath;
        this.activeCourse = localStorage.getItem("activeCourseCard");
        this.init();
    }

    // Initialize the application
    init() {
        this.loadCourses();
    }

    // Load course data from JSON
    loadCourses() {
        fetch(this.jsonPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error loading JSON file");
                }
                return response.json();
            })
            .then((courses) => this.handleCourses(courses))
            .catch((error) => console.error("Error:", error.message));
    }

    // Process and render active course
    handleCourses(courses) {
        courses.forEach((course) => {
            if (course.title === this.activeCourse) {
                const courseRenderer = new CourseRenderer(course);
                courseRenderer.renderAllSections();
            }
        });
    }
}

// Class responsible for rendering course details
class CourseRenderer {
    constructor(course) {
        this.course = course;
    }

    // Render all sections for the course
    renderAllSections() {
        this.renderCertificateSection();
        this.renderBannerSection();
        this.renderSkillsSection();
        this.generateTopics();
        this.TopicCardManager();
        this.generateMiddleSection();
        this.renderPersonalExperienceSection();
        this.renderOrganizationSection();
    }

    // Render certificate section if applicable
    renderCertificateSection() {
        if (!this.course.haveCertificate) return;

        const certificateSection = document.querySelector(".certificate");
        certificateSection.className = "sticky-box";
        certificateSection.innerHTML = `
            <div class="certificate-card">
                <div class="image-box">
                    <img src="${this.course.certificateImage}" alt="${this.course.title}">
                </div>
                <div class="dot-box">
                    <div class="dot activeDot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        `;
    }

    // Render banner section
    renderBannerSection() {
        const bannerSection = document.querySelector(".top-banner-section");
        bannerSection.innerHTML = `
            <div class="top-banner">
                <div class="top-type-box"><p>Course</p></div>
                <h1 class="heading title">${this.course.title}</h1>
                <div class="icon-line-box">
                    <div class="icon-line"><i class="fa-solid fa-location-dot"></i><p>${this.course.location}</p></div>
                    <div class="icon-line"><i class="fa-regular fa-calendar"></i><p>${this.course.duration}</p></div>
                    <div class="icon-line"><i class="fa-solid ${this.course.iconType}"></i><p>${this.course.difficulty}</p></div>
                    <div class="icon-line"><i class="fa-solid fa-award"></i><p>${this.course.certificate}</p></div>
                </div>
                <div class="text-box"><p class="course-description">${this.course.moreDescription}</p></div>
            </div>
        `;
    }

    // Render skills section
    renderSkillsSection() {
        const skillsSection = document.querySelector(".skills");
        skillsSection.innerHTML = `
            <div class="skills-you-learn">
                <h3 class="course-sections-title skill-title">Skills you will acquire</h3>
                <div class="skills-card"></div>
            </div>
        `;

        this.renderSkills();
    }

    // Render individual skills
    renderSkills() {
        const skillsCardsBox = document.querySelector(".skills-card");

        this.course.skills.forEach((skill) => {
            const skillsBox = document.createElement('div');
            skillsBox.className = "skill-box";

            const skillIcon = document.createElement('i');
            skillIcon.className = "fa-solid fa-check";
            const skillText = document.createElement('p');
            skillText.textContent = skill;

            skillsBox.append(skillIcon, skillText);
            skillsCardsBox.append(skillsBox);
        });
    }

    // Generate topics section
    generateTopics() {
        const topicsContainer = document.querySelector(".course-topics-box");
        if (!topicsContainer) return console.error("Topics container not found");

        topicsContainer.innerHTML = `<h3 class="course-sections-title topics-title">Topics</h3>`;
        const cardsContainer = document.createElement("div");
        cardsContainer.className = "topics-cards";

        this.course.topics.forEach((topic, index) => {
            const card = this.createTopicCard(topic, index);
            cardsContainer.appendChild(card);
        });

        topicsContainer.appendChild(cardsContainer);
    }

    // Create individual topic cards
    createTopicCard(topic, index) {
        const card = document.createElement("div");
        card.className = "topic-card";

        const visiblePart = document.createElement("div");
        visiblePart.className = "visible-part";
        visiblePart.innerHTML = `<p>${topic}</p><i class="fa-solid fa-plus toggle-icon"></i>`;

        const hiddenPart = this.createHiddenPart(index);

        card.append(visiblePart, hiddenPart);
        return card;
    }

    TopicCardManager() {
        new TopicCardManager('.topic-card');
    }

    // Create hidden part for topics
    createHiddenPart(index) {
        const hiddenPart = document.createElement("div");
        hiddenPart.className = "hidden-part";

        const resources = ["Presentation", "Lab", "Exercise Repository"];
        const icons = ["fa-solid fa-file-powerpoint", "fa-solid fa-file-word", "fa-brands fa-github"];

        const topicLinks = this.course.topicsLinks[index] || [];
        if (!Array.isArray(topicLinks)) {
            hiddenPart.innerHTML = "<p>No links are available.</p>";
            return hiddenPart;
        }

        if (topicLinks.every((link) => !link)) {
            hiddenPart.innerHTML = "<p>There are no materials for this lecture.</p>";
            return hiddenPart;
        }

        topicLinks.forEach((link, i) => {
            if (!link) return;

            const anchor = document.createElement("a");
            anchor.href = link;
            anchor.target = "_blank";
            anchor.innerHTML = `
                <div class="hidden-card">
                    <i class="${icons[i]}"></i>
                    <p>${resources[i]}</p>
                </div>
            `;

            hiddenPart.appendChild(anchor);
        });

        return hiddenPart;
    }

    // Generate middle section
    generateMiddleSection() {
        const middleSection = document.querySelector(".middle-section");
        middleSection.innerHTML = `
            <div class="middle-box">
                <h3 class="course-sections-title middle-box-title">Who is the course suitable for?</h3>
                <p>${this.course.courseSuitableFor}</p>
            </div>
        `;
    }

    // Render personal experience section
    renderPersonalExperienceSection() {
        const section = document.querySelector(".personal-experience-section");
        section.innerHTML = `
            <div class="personal-experience-box">
                <h3 class="course-sections-title personal-experience-title">Personal Experience</h3>
                ${this.course.MyExperience.map((exp) => `<p>${exp}</p>`).join("")}
            </div>
        `;
    }

    // Render organization section
    renderOrganizationSection() {
        const section = document.querySelector(".organization-section");
        section.innerHTML = `
            <div class="organization-box">
                <h3 class="course-sections-title personal-experience-title">Educational Organization</h3>
                <div class="organization-card">
                    <div class="organization-logo-box"><img src="${this.course.educationalOrganization[0]}"></div>
                    <div class="organization-text"><p>${this.course.educationalOrganization[1]}</p></div>
                </div>
            </div>
        `;
    }
}

// Start the application
document.addEventListener("DOMContentLoaded", () => new CourseApp("Json/courses.json"));

