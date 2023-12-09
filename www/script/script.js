document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Collect form data
    var formData = {
      gameName: document.getElementById("gameName").value,
      designerName: document.getElementById("designerName").value,
      artistName: document.getElementById("artistName").value,
      publisherName: document.getElementById("publisherName").value,
      categoryName: document.getElementById("categoryName").value,
      mechanicName: document.getElementById("mechanicName").value,
    };

    fetch("/games?" + new URLSearchParams(formData))
      .then((response) => response.json())
      .then((data) => {
        displayResults(data);
      })
      .catch((error) => console.error("Error:", error));
  });

function displayResults(data) {
  var results = document.getElementById("results");
  results.innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
}
