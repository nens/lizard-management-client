function openDropdown() {
    const dropdown = document.getElementById("user-profile_dropdown");
    if (dropdown.style.display === "flex") {
        dropdown.style.display = "none"
    } else {
        dropdown.style.display = "flex";
    }
};
//When user click outside of the modal, close it
// window.onclick = function(event) {
//     const dropdown = document.getElementById("user-profile_dropdown");
//     const userProfile = document.getElementById("user-profile");

//     console.log(event.target === userProfile)
//     console.log(dropdown.style.display)

//     if (event.target !== dropdown && event.target === userProfile) {
//         if (dropdown.style.display === "none") {
//             dropdown.style.display = "flex"
//         } else {
//             dropdown.style.display = "none"
//         }
//     } else if (event.target !== dropdown && event.target !== userProfile) {
//         dropdown.style.display = "none"
//     }
// }

//Organisation switcher
const openOrganisationSwitcher = () => {
    window.location.href = "#switcher";
};

const handleOnOrganisationClick = () => {
    window.location.href = "#"
};

const handleInput = () => {
    const x = document.getElementById("organisationName").value;
    console.log(x)
};


