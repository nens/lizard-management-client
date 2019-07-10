//Open and close the user profile dropdown
const openDropdown = () => {
    const dropdown = document.getElementById("user-profile_dropdown");
    if (dropdown.style.display === "flex") {
        dropdown.style.display = "none"
    } else {
        dropdown.style.display = "flex"
    }
};
const closeDropdown = () => {
    const dropdown = document.getElementById("user-profile_dropdown");
    dropdown.style.display = "none"
};

//Organisation switcher
const openOrganisationSwitcher = () => {
    window.location.href = "#switcher";
};

const handleOnOrganisationClick = () => {
    window.location.href = "#"
};