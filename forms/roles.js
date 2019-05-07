function toggleEditRolesButton() {
  console.log(event);
  console.log(event.target);
  if (
    event.target.classList.contains("edit-role") &&
    !event.target.classList.contains("button-shadow")
  ) {
    event.target.textContent = "SAVE";
    event.target.classList.add("button-shadow");
  } else {
    event.target.textContent = "+";
    event.target.classList.remove("button-shadow");
  }
}
