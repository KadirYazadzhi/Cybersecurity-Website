async function loadCourses() {
    try {
        const response = await fetch('Json/courses.json');
        const courses = await response.json();
        const slidesContainer = document.getElementById('courses');

        courses.forEach(course => {
            const slide = document.createElement('li');
            slide.className = 'glide__slide';
            slide.innerHTML = `
                <div class="card course-card">
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
            slidesContainer.appendChild(slide);
        });

        // Инициализира Glide.js след като картите са заредени
        const glide = new Glide('.glide', {
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

    } catch (error) {
        console.error("Грешка при зареждане на курсовете:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadCourses);
