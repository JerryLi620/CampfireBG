document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("success");
          // Hide login button and show greeting
          document.getElementById("loginButton").style.display = "none";
          document.getElementById("greeting").style.display = "block";
          document.getElementById("username").textContent = data.username; // Set the username
          // Close the modal if it's open
          if ($("#loginModal").length) {
            $("#loginModal").modal("hide");
          }
        } else {
          alert(data.message || "Login failed");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message);
      });
  });
