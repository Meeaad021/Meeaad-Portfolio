document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const message = document.getElementById("message").value;

  const response = await fetch("http://localhost:3000/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  if (response.ok) {
    alert("Message sent successfully!");
    this.reset();
  } else {
    alert("Error sending message.");
  }
});
