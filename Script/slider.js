var toolsSlider = new Glide('.tools-slider', {
    type: 'carousel',
    perView: 3,
    focusAt: 0,
    breakpoints: {
        800: {
            perView: 2
        },
        480: {
            perView: 1
        }
    }
});

toolsSlider.mount();

