var glide = new Glide('.glide', {
    type: 'carousel',
    perView: 3.5,
    focusAt: 0,
    autoplay: 3000,
    breakpoints: {
        800: {
            perView: 2
        },
        480: {
            perView: 1
        }
    }
});

// Mount the Glide instance
glide.mount();

// Select all cards
const cards = document.querySelectorAll('.course-card');

// Pause autoplay when hovering over a card, and resume when not hovering
cards.forEach(card => {
    card.addEventListener('mouseenter', () => glide.pause()); // Pause autoplay on hover
    card.addEventListener('mouseleave', () => glide.play());  // Resume autoplay when hover ends
});
