function showEditUserPopup() {
  // Close other popups so that only one popup is open
  var openUserPopups = document.getElementsByClassName("edit-user-popup");
  for (var i = 0; i < openUserPopups.length; i++) {
    if (!openUserPopups[i].classList.contains("not-shown")) {
      // Switch show less button to show more button
      openUserPopups[i].classList.add("not-shown");
      var showLessUserOptions = openUserPopups[i].previousElementSibling;
      showLessUserOptions.classList.add("not-shown");
      var showMoreUserOptions = showLessUserOptions.previousElementSibling;
      showMoreUserOptions.classList.remove("not-shown");
    }
  }
  var showMoreUserOptions = event.target;
  showMoreUserOptions.classList.add("not-shown");
  var showLessUserOptions = showMoreUserOptions.nextElementSibling;
  showLessUserOptions.classList.remove("not-shown");
  var userOptions = showLessUserOptions.nextElementSibling;
  userOptions.setAttribute(
    "style",
    "top:" + event.clientY + "px;left:" + (event.clientX + 10) + "px;"
  );
  userOptions.classList.remove("not-shown");
  return false;
}

function dontShowEditUserPopup() {
  var showLessUserOptions = event.target;
  showLessUserOptions.classList.add("not-shown");
  var showMoreUserOptions = showLessUserOptions.previousElementSibling;
  showMoreUserOptions.classList.remove("not-shown");
  var userOptions = showLessUserOptions.nextElementSibling;
  userOptions.classList.add("not-shown");
}

function closeEditUserPopup() {
  console.log(event.target);
  var userOptions = event.target.parent;
  userOptions.classList.add("not-shown");
  var showLessUserOptions = userOptions.previousElementSibling;
  showLessUserOptions.classList.add("not-shown");
  var showMoreUserOptions = showLessUserOptions.previousElementSibling;
  showMoreUserOptions.classList.remove("not-shown");
}
