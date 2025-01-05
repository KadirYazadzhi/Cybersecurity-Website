class BlogGenerator {
    constructor(jsonPath, topContainer, mainContainer) {
        this.jsonPath = jsonPath;
        this.topContainer = document.querySelector(topContainer);
        this.mainContainer = document.querySelector(mainContainer);
        this.blogData = null; // Adjusted to reflect the structure
    }

    // Fetch blog data from the JSON file
    async fetchBlogData() {
        try {
            const response = await fetch(this.jsonPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch blog data: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching blog data:", error);
            return null;
        }
    }

    // Main method to load and display the blog
    async load() {
        this.blogData = await this.fetchBlogData();
        console.log(this.blogData); // Log the fetched data to see its structure
        if (!this.blogData || !this.blogData.blog) {
            console.error("Error: blog data or topSection is missing.");
            return;
        }

        this.generateTopSection();
    }


    generateTopSection() {
        const topSection = this.blogData?.blog?.topSection; // Optional chaining
        if (!topSection) {
            console.error("Error: topSection is missing in the blog data.");
            return;
        }

        this.topContainer.innerHTML = `
        <div class="top-banner">
            <div class="top-type-box"><p>${topSection.type}</p></div>
            <h1 class="heading title">${topSection.title}</h1>
            <div class="icon-line-box">
                <div class="icon-line"><i class="fa-regular fa-calendar"></i><p>${topSection.date}</p></div>
                <div class="icon-line"><i class="fa-regular fa-clock"></i><p>${topSection.time}</p></div>
                <div class="icon-line"><i class="fa-regular fa-user"></i><p>${topSection.author}</p></div>
            </div>
            <div class="text-box">
                <p class="course-description">${topSection.description}</p>
            </div>
        </div>
    `;
    }

}

// Instantiate and run the BlogGenerator
document.addEventListener("DOMContentLoaded", () => {
    const blogGenerator = new BlogGenerator(
        "Json/blogs.json",
        ".top-banner-section",
        ".main-section"
    );
    blogGenerator.load();
});
