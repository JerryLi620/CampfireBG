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
    results.innerHTML = "";

    if (data && data.length > 0) {
        var table = document.createElement("table");
        table.classList.add("table", "table-hover"); 

        var thead = document.createElement("thead");
        var headerRow = document.createElement("tr");
        var seqNumberHeader = document.createElement("th");
        seqNumberHeader.scope = "col";
        seqNumberHeader.textContent = "#";
        headerRow.appendChild(seqNumberHeader);

        for (var key in data[0]) {
            if (data[0].hasOwnProperty(key) && key !== "GameID" && key !== "MinPlayer" && key !== "MaxPlayer" && key !== "MinTime" && key !== "MaxTime") {
                var headerCell = document.createElement("th");
                headerCell.scope = "col";
                headerCell.textContent = key;
                headerRow.appendChild(headerCell);
            }
        }

        var numPlayerHeader = document.createElement("th");
        numPlayerHeader.scope = "col";
        numPlayerHeader.textContent = "NumPlayer";
        headerRow.appendChild(numPlayerHeader);

        var playTimeHeader = document.createElement("th");
        playTimeHeader.scope = "col";
        playTimeHeader.textContent = "PlayTime";
        headerRow.appendChild(playTimeHeader);

        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement("tbody");

        data.forEach(function (result, index) {
            var row = document.createElement("tr");
            var seqNumberCell = document.createElement("th");
            seqNumberCell.scope = "row";
            seqNumberCell.textContent = index + 1;
            row.appendChild(seqNumberCell);

            // Iterate over each property in the result
            for (var key in result) {
                if (result.hasOwnProperty(key) && key !== "GameID" && key !== "MinPlayer" && key !== "MaxPlayer" && key !== "MinTime" && key !== "MaxTime") {
                    var cell = document.createElement("td");

                    if (key === "Rating") {
                        cell.textContent = result[key].toFixed(1) + "/10"; 
                    } else if (key === "Complexity") {
                        cell.textContent = result[key].toFixed(1) + "/5"; 
                    } else {
                        cell.textContent = result[key];
                    }
                    row.appendChild(cell);
                }
            }

            // Combine MinPlayer and MaxPlayer into NumPlayer
            var numPlayerCell = document.createElement("td");
            numPlayerCell.textContent = result.MinPlayer === result.MaxPlayer ? result.MinPlayer : result.MinPlayer + " ~ " + result.MaxPlayer;
            row.appendChild(numPlayerCell);

            // Combine MinTime and MaxTime into PlayTime
            var playTimeCell = document.createElement("td");
            playTimeCell.textContent = result.MinTime === result.MaxTime ? result.MinTime + " min" : result.MinTime + " ~ " + result.MaxTime + " min";
            row.appendChild(playTimeCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        results.appendChild(table);
    } else {
        results.textContent = "No results found.";
    }
}