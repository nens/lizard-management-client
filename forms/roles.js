function enableRoleCheckboxes() {
  // Prevent page from reloading
  event.preventDefault();
  var userRoles = event.target.parentNode.children;
  // Add interaction of the custom checkboxes
  for (var i = 0; i < 4; i++) {
    userRoles[i].childNodes[1].disabled = false;
    userRoles[i].childNodes[3].classList.remove("disabled");
  }
  // Remove the edit button and show the save button
  event.target.classList.add("not-shown");
  event.target.parentNode.children[5].classList.remove("not-shown");
  return false;
}

function disableRoleCheckboxes() {
  // Prevent page from reloading
  event.preventDefault();
  var userRoles = event.target.parentNode.children;
  // Remove interaction of the custom checkboxes and
  // add the not-checked class to the accompanying span if checkbox is clicked
  for (var i = 0; i < 4; i++) {
    if (userRoles[i].childNodes[1].checked === true) {
      userRoles[i].childNodes[3].classList.remove("not-checked");
    } else {
      userRoles[i].childNodes[3].classList.add("not-checked");
    }
    userRoles[i].childNodes[1].disabled = true;
    userRoles[i].childNodes[3].classList.add("disabled");
  }
  // Remove the save button and show the edit button
  event.target.classList.add("not-shown");
  event.target.parentNode.children[4].classList.remove("not-shown");
  return false;
}
