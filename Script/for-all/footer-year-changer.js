function setYearInFooter() {
    const yearText = document.querySelector(".plus-part p");
    const year = new Date().getFullYear();

    yearText.innerHTML = `Copyright © ${year} - All rights reserved || Designed By: Kadir Yazadzhi`;
}

document.addEventListener("DOMContentLoaded", setYearInFooter);