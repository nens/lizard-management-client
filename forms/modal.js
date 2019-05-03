function openModal() {
  // Get the modal
  var modal = document.getElementById("about-roles-modal");
  modal.style.display = "block";
}

function closeModal() {
  // Get the modal
  var modal = document.getElementById("about-roles-modal");
  // Get the <span> element that closes the modal
  var buttonModalClose = document.getElementById("modal-close-button");
  if (event.target === modal || event.target === buttonModalClose) {
    modal.style.display = "none";
  }
}
