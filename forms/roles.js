function enableRoleCheckboxes() {
  // Prevent page from reloading
  event.preventDefault();
  var userRolesForm = event.target.form;
  // User role
  var userRoleCheckbox =
    userRolesForm.elements["edit-user-roles-form-user-role"];
  userRoleCheckbox.disabled = false;
  var userRoleSpan = userRoleCheckbox.nextElementSibling; // get span with sibling selector
  userRoleSpan.classList.remove("disabled");
  // Supplier role
  var supplierRoleCheckbox =
    userRolesForm.elements["edit-user-roles-form-supplier-role"];
  supplierRoleCheckbox.disabled = false;
  var supplierRoleSpan = supplierRoleCheckbox.nextElementSibling; // get span with sibling selector
  supplierRoleSpan.classList.remove("disabled");
  // Admin role
  var adminRoleCheckbox =
    userRolesForm.elements["edit-user-roles-form-admin-role"];
  adminRoleCheckbox.disabled = false;
  var adminRoleSpan = adminRoleCheckbox.nextElementSibling; // get span with sibling selector
  adminRoleSpan.classList.remove("disabled");
  // Manager role
  var managerRoleCheckbox =
    userRolesForm.elements["edit-user-roles-form-manager-role"];
  managerRoleCheckbox.disabled = false;
  var managerRoleSpan = managerRoleCheckbox.nextElementSibling; // get span with sibling selector
  managerRoleSpan.classList.remove("disabled");
  // Remove the edit button and show the save button
  event.target.classList.add("not-shown");
  event.target.parentNode.children[5].classList.remove("not-shown");
  return false;
}

function disableRoleCheckboxes() {
  // Prevent page from reloading
  event.preventDefault();
  var userRolesForm = event.target.form;
  // Remove interaction of the custom checkboxes and
  // add the not-checked class to the accompanying span if checkbox is clicked
  // User role
  var userRoleCheckbox =
    userRolesForm.elements["edit-user-roles-form-user-role"];
  var userRoleSpan = userRoleCheckbox.nextElementSibling;
  if (userRoleCheckbox.checked === true) {
    userRoleSpan.classList.remove("not-checked");
  } else {
    userRoleSpan.classList.add("not-checked");
  }
  userRoleCheckbox.disabled = true;
  userRoleSpan.classList.add("disabled");
  // Supplier role
  var supplierRoleCheckbox =
    userRolesForm.elements["edit-user-roles-form-supplier-role"];
  var supplierRoleSpan = supplierRoleCheckbox.nextElementSibling;
  if (supplierRoleCheckbox.checked === true) {
    supplierRoleSpan.classList.remove("not-checked");
  } else {
    supplierRoleSpan.classList.add("not-checked");
  }
  supplierRoleCheckbox.disabled = true;
  supplierRoleSpan.classList.add("disabled");
  // Admin role
  var adminRoleCheckbox =
    userRolesForm.elements["edit-user-roles-form-admin-role"];
  var adminRoleSpan = adminRoleCheckbox.nextElementSibling;
  if (adminRoleCheckbox.checked === true) {
    adminRoleSpan.classList.remove("not-checked");
  } else {
    adminRoleSpan.classList.add("not-checked");
  }
  adminRoleCheckbox.disabled = true;
  adminRoleSpan.classList.add("disabled");
  // Manager role
  var managerRoleCheckbox =
    userRolesForm.elements["edit-user-roles-form-manager-role"];
  var managerRoleSpan = managerRoleCheckbox.nextElementSibling;
  if (managerRoleCheckbox.checked === true) {
    managerRoleSpan.classList.remove("not-checked");
  } else {
    managerRoleSpan.classList.add("not-checked");
  }
  managerRoleCheckbox.disabled = true;
  managerRoleSpan.classList.add("disabled");
  // Remove the save button and show the edit button
  event.target.classList.add("not-shown");
  event.target.parentNode.children[4].classList.remove("not-shown");
  return false;
}
