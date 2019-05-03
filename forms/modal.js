function openModal() {
  // Get the modal page blocker that also contains the modal
  var modal = document.getElementById("js-modal-page-blocker");
  modal.classList.remove("not-shown");
}

function closeModal() {
  // Get the modal page blocker that also contains the modal
  var modal = document.getElementById("js-modal-page-blocker");
  // Get the button that closes the modal page blocker that also contains the modal
  var buttonModalClose = document.getElementById(
    "js-close-modal-page-blocker-button"
  );
  if (event.target === buttonModalClose || event.target === modal) {
    modal.classList.add("not-shown");
  }
}
