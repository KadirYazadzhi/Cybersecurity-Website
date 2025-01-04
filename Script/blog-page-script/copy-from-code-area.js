document.addEventListener("DOMContentLoaded", () => {
    const copyButtons = document.querySelectorAll(".copy-btn");

    copyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const codeBlock = button.parentElement.nextElementSibling.querySelector("code");
            const codeText = codeBlock.innerText;

            navigator.clipboard.writeText(codeText).then(() => {
                button.innerText = "Copied!";
                setTimeout(() => (button.innerText = "Copy"), 2000);
            }).catch((err) => {
                console.error("Failed to copy text: ", err);
            });
        });
    });
});