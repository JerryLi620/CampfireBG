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
        // Create a table element with the 'table-striped' class
        var table = document.createElement("table");
        table.classList.add("table", "table-striped"); // Add 'table-striped' class

        // Create the table header (thead)
        var thead = document.createElement("thead");
        var headerRow = document.createElement("tr");

        // Add a column for the sequential number
        var seqNumberHeader = document.createElement("th");
        seqNumberHeader.scope = "col";
        seqNumberHeader.textContent = "#";
        headerRow.appendChild(seqNumberHeader);

        // Iterate over the properties of the first result to create table headers
        for (var key in data[0]) {
            if (data[0].hasOwnProperty(key) && key !== "GameID" && key !== "MinPlayer" && key !== "MaxPlayer" && key !== "MinTime" && key !== "MaxTime") {
                var headerCell = document.createElement("th");
                headerCell.scope = "col";
                headerCell.textContent = key;
                headerRow.appendChild(headerCell);
            }
        }

        // Add a header for NumPlayer
        var numPlayerHeader = document.createElement("th");
        numPlayerHeader.scope = "col";
        numPlayerHeader.textContent = "NumPlayer";
        headerRow.appendChild(numPlayerHeader);

        // Add a header for PlayTime
        var playTimeHeader = document.createElement("th");
        playTimeHeader.scope = "col";
        playTimeHeader.textContent = "PlayTime";
        headerRow.appendChild(playTimeHeader);

        // Append the header row to the thead
        thead.appendChild(headerRow);
        // Append the thead to the table
        table.appendChild(thead);

        // Create the table body (tbody)
        var tbody = document.createElement("tbody");

        // Iterate over each result
        data.forEach(function (result, index) {
            // Create a row for each result
            var row = document.createElement("tr");

            // Add a cell for the sequential number
            var seqNumberCell = document.createElement("th");
            seqNumberCell.scope = "row";
            seqNumberCell.textContent = index + 1;
            row.appendChild(seqNumberCell);

            // Iterate over each property in the result
            for (var key in result) {
                if (result.hasOwnProperty(key) && key !== "GameID" && key !== "MinPlayer" && key !== "MaxPlayer" && key !== "MinTime" && key !== "MaxTime") {
                    // Create a cell for each property and its data
                    var cell = document.createElement("td");

                    // Check if the property is "Rating" or "Complexity" and round to one decimal place
                    if (key === "Rating") {
                        cell.textContent = result[key].toFixed(1) + "/10"; // Add "/10"
                    } else if (key === "Complexity") {
                        cell.textContent = result[key].toFixed(1) + "/5"; // Add "/5"
                    } else {
                        cell.textContent = result[key];
                    }

                    // Append the cell to the row
                    row.appendChild(cell);
                }
            }

            // Combine MinPlayer and MaxPlayer into NumPlayer
            var numPlayerCell = document.createElement("td");
            numPlayerCell.textContent = result.MinPlayer === result.MaxPlayer ? result.MinPlayer : result.MinPlayer + " ~ " + result.MaxPlayer;
            row.appendChild(numPlayerCell);

            // Combine MinTime and MaxTime into PlayTime with "min" unit
            var playTimeCell = document.createElement("td");
            playTimeCell.textContent = result.MinTime === result.MaxTime ? result.MinTime + " min" : result.MinTime + " ~ " + result.MaxTime + " min";
            row.appendChild(playTimeCell);

            // Append the row to the tbody
            tbody.appendChild(row);
        });

        // Append the tbody to the table
        table.appendChild(tbody);

        // Append the table to the overall results element
        results.appendChild(table);
    } else {
        // Display a message if there are no results
        results.textContent = "No results found.";
    }
}