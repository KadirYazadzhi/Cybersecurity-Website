class TopicCardManager {
    constructor(cardSelector) {
        this.cards = document.querySelectorAll(cardSelector);
        this.visibleCards = []; // Tracks currently visible cards
        this.maxVisible = 3;    // Maximum number of visible cards
        this.init();
    }

    // Initialize event listeners for all cards
    init() {
        this.cards.forEach((card) => {
            const visiblePart = card.querySelector('.visible-part');
            visiblePart.addEventListener('click', () => this.toggleCard(card));
        });
    }

    // Toggle a specific card
    toggleCard(card) {
        const hiddenPart = card.querySelector('.hidden-part');
        const toggleIcon = card.querySelector('.toggle-icon');

        const isHidden = hiddenPart.style.display === 'none' || !hiddenPart.style.display;

        if (isHidden) {
            // Show hidden part and update icon
            hiddenPart.style.display = 'flex';
            toggleIcon.classList.remove('fa-plus');
            toggleIcon.classList.add('fa-minus');

            // Add this card to the visibleCards array
            this.visibleCards.push(card);

            // If more than maxVisible, hide the first opened card
            if (this.visibleCards.length > this.maxVisible) {
                this.hideFirstOpenedCard();
            }
        } else {
            // Hide hidden part and update icon
            hiddenPart.style.display = 'none';
            toggleIcon.classList.remove('fa-minus');
            toggleIcon.classList.add('fa-plus');

            // Remove this card from the visibleCards array
            this.visibleCards = this.visibleCards.filter((c) => c !== card);
        }
    }

    // Hide the first opened card when limit is exceeded
    hideFirstOpenedCard() {
        const firstCard = this.visibleCards.shift(); // Remove the first card from the array

        if (firstCard) {
            const hiddenPart = firstCard.querySelector('.hidden-part');
            const toggleIcon = firstCard.querySelector('.toggle-icon');

            // Hide the hidden part and update the icon
            hiddenPart.style.display = 'none';
            toggleIcon.classList.remove('fa-minus');
            toggleIcon.classList.add('fa-plus');
        }
    }
}

// Initialize the TopicCardManager
new TopicCardManager('.topic-card');
