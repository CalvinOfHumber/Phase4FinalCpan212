document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("receiptBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      alert("Movie Receipt\n\nThank you for watching! Your viewing is confirmed.");
    });
  }
});
