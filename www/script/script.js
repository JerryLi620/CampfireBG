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

    // Clear previous results
    results.innerHTML = "";

    // Check if there are any results
    if (data && data.length > 0) {
        // Create a container div for all results
        var resultsContainer = document.createElement("div");
        resultsContainer.classList.add("results-container"); // Add a class for styling if needed

        // Iterate over each result
        data.forEach(function (result) {
            // Create a result row div
            var resultRow = document.createElement("div");
            resultRow.classList.add("result-row"); // Add a class for styling if needed

            // Iterate over each property in the result
            for (var key in result) {
                if (result.hasOwnProperty(key) && key !== "GameID") {
                    // Create a paragraph element for each property and its data
                    var propertyElement = document.createElement("p");
                    propertyElement.innerHTML = `<strong>${key}:</strong> ${result[key]}`;
                    
                    // Append the paragraph to the result row
                    resultRow.appendChild(propertyElement);
                }
            }

            // Append the result row to the container
            resultsContainer.appendChild(resultRow);
        });

        // Append the results container to the overall results element
        results.appendChild(resultsContainer);
    } else {
        // Display a message if there are no results
        results.textContent = "No results found.";
    }
}
