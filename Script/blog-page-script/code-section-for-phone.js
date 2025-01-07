function setWidthForCodeElementsForPhone() {
    const codeElements = document.querySelectorAll(".code-container");

    console.log(codeElements);

    codeElements.forEach(codeElement => {
        const pageWidth = window.innerWidth;

        console.log(window.innerWidth);

        codeElement.style.width = `${pageWidth - (pageWidth * 0.23)}px`;
    });
}