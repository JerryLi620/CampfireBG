document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("registername").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
        } else {
          alert(data.message);
        }
        if ($("#registrationModal").length) {
          $("#registrationModal").modal("hide");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
