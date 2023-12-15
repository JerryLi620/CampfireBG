document.addEventListener("DOMContentLoaded", function () {
  var savedGameCheck = document.getElementById("savedGameCheck");

  var searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      performSearch(savedGameCheck.checked); 
    });
  }

  function displayLoadingIndicator() {
    var loadingContainer = document.createElement("div");
    loadingContainer.classList.add("d-flex", "align-items-center", "mt-3"); 

    var loadingText = document.createElement("strong");
    loadingText.setAttribute("role", "status");
    loadingText.textContent = "Moving BG to your camp...";

    var spinner = document.createElement("div");
    spinner.classList.add("spinner-border", "ms-auto");
    spinner.setAttribute("aria-hidden", "true");

    loadingContainer.appendChild(loadingText);
    loadingContainer.appendChild(spinner);

    var resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; 
    resultsContainer.appendChild(loadingContainer);
  }

  function performSearch(isMySavedGamesClicked = false) {
    displayLoadingIndicator(); 
    const isLoggedIn =
      document.getElementById("loginButton").style.display === "none";
    var formData = {
      gameName: document.getElementById("gameName").value,
      designerName: document.getElementById("designerName").value,
      artistName: document.getElementById("artistName").value,
      publisherName: document.getElementById("publisherName").value,
      minPlayer: document.getElementById("minPlayers").value,
      maxPlayer: document.getElementById("maxPlayers").value,
      minTime: document.getElementById("minTime").value,
      maxTime: document.getElementById("maxTime").value,
      complexity: document.getElementById("complexity").value,
      rating: document.getElementById("rating").value,
    };

    if (isLoggedIn) {
      formData.userId = window.userId;
      formData.onlySaved = isMySavedGamesClicked; // Add a flag to indicate if only saved games should be fetched
    }

    var endpoint = isLoggedIn ? "/userGames" : "/games";
    fetch(endpoint + "?" + new URLSearchParams(formData))
      .then((response) => response.json())
      .then((data) => displayResults(data))
      .catch((error) => console.error("Error:", error));
  }
});

function displayResults(data) {
  const isLoggedIn =
    document.getElementById("loginButton").style.display === "none";
  var resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";
  var tableWrapper = document.createElement("div");
  tableWrapper.classList.add("table-wrapper");
  tableWrapper.classList.add("table-responsive");
  
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
      if (
        data[0].hasOwnProperty(key) &&
        key !== "GameID" &&
        key !== "MinPlayer" &&
        key !== "MaxPlayer" &&
        key !== "MinTime" &&
        key !== "MaxTime" &&
        key !== "IsFavorite"
      ) {
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

    if (isLoggedIn) {
      var savedHeader = document.createElement("th");
      savedHeader.scope = "col";
      savedHeader.textContent = "Saved";
      headerRow.appendChild(savedHeader);
    }

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
        if (
          result.hasOwnProperty(key) &&
          key !== "GameID" &&
          key !== "MinPlayer" &&
          key !== "MaxPlayer" &&
          key !== "MinTime" &&
          key !== "MaxTime" &&
          key !== "IsFavorite"
        ) {
          var cell = document.createElement("td");
          if (key === "GameName") {
            var link = document.createElement("a");
            link.href =
              "https://www.amazon.com/s?k=" + result[key] + " boardgame";
            link.textContent = result[key];
            link.target = "_blank"; 
            cell.appendChild(link);
          } else if (key === "Categories" || key === "Mechanics") {
            cell.innerHTML =
              result[key] !== null ? result[key].replace(/,/g, ",<br>") : "N/A";
          } else if (key === "Rating") {
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
      numPlayerCell.textContent =
        result.MinPlayer === result.MaxPlayer
          ? result.MinPlayer
          : result.MinPlayer + " ~ " + result.MaxPlayer;
      row.appendChild(numPlayerCell);

      // Combine MinTime and MaxTime into PlayTime
      var playTimeCell = document.createElement("td");
      playTimeCell.textContent =
        result.MinTime === result.MaxTime
          ? result.MinTime + " min"
          : result.MinTime + " ~ " + result.MaxTime + " min";
      row.appendChild(playTimeCell);

      if (isLoggedIn) {
        var savedCell = document.createElement("td");
        savedCell.classList.add("text-center");

        var starButton = document.createElement("button");
        starButton.classList.add("btn", "btn-sm");
        var starIcon = document.createElement("i");
        starIcon.classList.add(result.IsFavorite ? "fas" : "far", "fa-star");
        starButton.appendChild(starIcon);

        starButton.onclick = function () {
          toggleStar(starIcon, result.GameID, window.userId);
        };

        savedCell.appendChild(starButton);
        row.appendChild(savedCell);
      }
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    results.appendChild(table);
    tableWrapper.appendChild(table);
    resultsContainer.appendChild(tableWrapper);
  } else {
    results.textContent = "No results found.";
  }
}

function toggleStar(starIcon, gameId, userId) {
  if (starIcon.classList.contains("far")) {
    starIcon.classList.remove("far");
    starIcon.classList.add("fas");

    fetch("/saveGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, gameId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        alert("Game saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving game:", error);
        alert("Error occurred while saving the game.");
        starIcon.classList.remove("fas");
        starIcon.classList.add("far");
      });

    console.log("Game saved, Game ID:", gameId);
  } else {
    starIcon.classList.remove("fas");
    starIcon.classList.add("far");

    fetch("/unsaveGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, gameId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        alert("Game unsaved successfully!");
      })
      .catch((error) => {
        console.error("Error saving game:", error);
        alert("Error occurred while saving the game.");
        starIcon.classList.remove("far");
        starIcon.classList.add("fas");
      });

    console.log("Game unsaved, Game ID:", gameId);
  }
}
