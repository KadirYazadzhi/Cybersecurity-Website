document.addEventListener("DOMContentLoaded", () => {
    const activeCourse = localStorage.getItem("activeCourseCard");

    loadCourses("Json/courses.json", activeCourse);
});

// Зареждане на JSON данни
function loadCourses(jsonPath, activeCourse) {
    fetch(jsonPath)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Грешка при зареждане на JSON файла");
            }
            return response.json();
        })
        .then((courses) => {
            handleCourses(courses, activeCourse);
        })
        .catch((error) => {
            console.error("Грешка:", error.message);
        });
}

// Обработка на курсовете
function handleCourses(courses, activeCourse) {
    courses.forEach((course) => {
        if (course.title === activeCourse) {
            renderCertificateSection(course);
            renderBannerSection(course);
            renderSkillsSection(course);
            generateTopics(course);
        }
    });
}

// Рендериране на секцията за сертификат
function renderCertificateSection(course) {
    const certificateSection = document.querySelector(".certificate");
    certificateSection.className = "sticky-box";
    certificateSection.innerHTML = `
        <div class="certificate-card">
            <div class="image-box">
                <img src="${course.certificateImage}" alt="${course.title}">
            </div>
            <div class="dot-box">
                <div class="dot activeDot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;
}

// Рендериране на секцията за банера
function renderBannerSection(course) {
    const bannerSection = document.querySelector(".top-banner-section");
    bannerSection.innerHTML = `
        <div class="top-banner">
            <div class="top-type-box">
                <p>Course</p>
            </div>
            <h1 class="heading title">${course.title}</h1>
            <div class="icon-line-box">
                <div class="icon-line">
                    <i class="fa-solid fa-location-dot"></i>
                    <p>${course.location}</p>
                </div>
                <div class="icon-line">
                    <i class="fa-regular fa-calendar"></i>
                    <p>${course.duration}</p>
                </div>
                <div class="icon-line">
                    <i class="fa-solid ${course.iconType}"></i>
                    <p>${course.difficulty}</p>
                </div>
                <div class="icon-line">
                    <i class="fa-solid fa-award"></i>
                    <p>${course.certificate}</p>
                </div>
            </div>
            <div class="text-box">
                <p class="course-description">${course.moreDescription}</p>
            </div>
        </div>
    `;
}

function renderSkillsSection(course) {
    const skillsSection = document.querySelector(".skills");
    skillsSection.innerHTML = `
        <div class="skills-you-learn">
            <h3 class="course-sections-title skill-title">Skills you will acquire</h3>
            <div class="skills-card"></div>
        </div>
    `;

    renderSkill(course);
}

function renderSkill(course) {
    const skillsCardsBox = document.querySelector(".skills-card");

    for (let i = 0; i < course.skills.length; i++) {
        const skillsBox = document.createElement('div');
        skillsBox.className = "skill-box";
        skillsCardsBox.append(skillsBox);

        const skillIcon = document.createElement('i');
        skillIcon.className = "fa-solid fa-check";
        skillsBox.append(skillIcon);

        const skillText = document.createElement('p');
        skillText.innerHTML = course.skills[i];
        skillsBox.append(skillText);
    }
}

function generateTopics(course) {
    const topicsContainer = document.querySelector(".course-topics-box");

    // Проверка дали контейнерът съществува
    if (!topicsContainer) {
        console.error("Element with ID 'course-topics-box' not found.");
        return;
    }

    topicsContainer.innerHTML = "";

    const title = document.createElement("h3");
    title.className = "course-sections-title topics-title";
    title.textContent = "Topics";
    topicsContainer.appendChild(title);

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "topics-cards";

    if (!Array.isArray(course.topics) || !Array.isArray(course.topicsLinks)) {
        console.error("Invalid course data. 'topics' or 'topicsLinks' is not an array.");
        return;
    }

    course.topics.forEach((topic, index) => {
        const card = document.createElement("div");
        card.className = "topic-card";

        const visiblePart = document.createElement("div");
        visiblePart.className = "visible-part";

        const topicTitle = document.createElement("p");
        topicTitle.textContent = topic;

        const toggleIcon = document.createElement("i");
        toggleIcon.className = "fa-solid fa-plus toggle-icon";

        visiblePart.appendChild(topicTitle);
        visiblePart.appendChild(toggleIcon);
        
        const hiddenPart = document.createElement("div");
        hiddenPart.className = "hidden-part";

        const resources = ["Presentation", "Lab", "Exercise Repository"];
        const icons = ["fa-file-powerpoint", "fa-file-word", "fa-github"];

        const topicLinks = course.topicsLinks[index] || false;
        if (Array.isArray(topicLinks)) {
            let allLinksNull = true; // Flag to check if all links are null

            topicLinks.forEach((link, linkIndex) => {
                if (link) {
                    allLinksNull = false; // At least one link is valid
                    const anchor = document.createElement("a");
                    anchor.href = link;
                    anchor.target = "_blank";

                    const hiddenCard = document.createElement("div");
                    hiddenCard.className = `hidden-card ${resources[linkIndex].toLowerCase().replace(" ", "-")}-card`;

                    const icon = document.createElement("i");
                    icon.className = `fa-solid ${icons[linkIndex]}`;

                    const text = document.createElement("p");
                    text.textContent = resources[linkIndex];

                    hiddenCard.appendChild(icon);
                    hiddenCard.appendChild(text);
                    anchor.appendChild(hiddenCard);

                    hiddenPart.appendChild(anchor);
                }
            });

            // If all links are null, display a single message
            if (allLinksNull) {
                const textForNullResult = document.createElement('p');
                textForNullResult.innerHTML = "There are no materials for this lecture.";
                hiddenPart.appendChild(textForNullResult);
            }
        } else {
            // Fallback if topicLinks is not an array
            const textForInvalidLinks = document.createElement('p');
            textForInvalidLinks.innerHTML = "No links are available.";
            hiddenPart.appendChild(textForInvalidLinks);
        }
        
        card.appendChild(visiblePart);
        card.appendChild(hiddenPart);
        cardsContainer.appendChild(card);
    });

    topicsContainer.appendChild(cardsContainer);
    new TopicCardManager('.topic-card');
}


