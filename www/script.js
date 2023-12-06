function openPage(pageName, elmnt) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = "#333";
}

// Get the element with id="defaultOpen" and click on it
document.getElementsByClassName("tablink")[0].click();

function populatePlayerDetails(results) {
  let table = document.getElementById("playerDetails");

  // Clear previous results
  table.innerHTML = "";

  // Add table headers (You can adjust this based on your data attributes)
  let thead = document.createElement("thead");
  let headerRow = thead.insertRow();
  ["PlayerID", "Player Name", "Hand", "Height", "IOC"].forEach((header) => {
    let th = document.createElement("th");
    th.innerText = header;
    headerRow.appendChild(th);
  });
  table.appendChild(thead);

  // Populate table rows
  let tbody = document.createElement("tbody");
  results.forEach((element) => {
    let row = tbody.insertRow();

    // Adjust the following according to your data attributes
    row.insertCell().innerText = element.PlayerID;
    row.insertCell().innerText = element.PlayerName;
    row.insertCell().innerText = element.hand;
    row.insertCell().innerText = element.height;
    row.insertCell().innerText = element.IOC;
  });
  table.appendChild(tbody);
}

function populateTournamentsByYear(results) {
  let table = document.getElementById("tournamentDetails");

  // Clear previous results
  table.innerHTML = "";

  // Add table headers (You can adjust this based on your data attributes)
  let thead = document.createElement("thead");
  let headerRow = thead.insertRow();
  [
    "Tournament ID",
    "Tournament Name",
    "Surface",
    "Draw Size",
    "Tournament Level",
  ].forEach((header) => {
    let th = document.createElement("th");
    th.innerText = header;
    headerRow.appendChild(th);
  });
  table.appendChild(thead);

  // Populate table rows
  let tbody = document.createElement("tbody");
  results.forEach((element) => {
    let row = tbody.insertRow();

    // Adjust the following according to your data attributes
    row.insertCell().innerText = element.TournamentID;
    row.insertCell().innerText = element.TournamentName;
    row.insertCell().innerText = element.Surface;
    row.insertCell().innerText = element.DrawSize;
    row.insertCell().innerText = element.TournamentLevel;
  });
  table.appendChild(tbody);
}

function populateAggregateStatistics(results) {
  let table = document.getElementById("statisticsDetails");

  // Clear previous results
  table.innerHTML = "";

  // Add table headers
  let thead = document.createElement("thead");
  let headerRow = thead.insertRow();
  [
    "Ace",
    "Doubles Faults",
    "Serve Points",
    "First Serves Made",
    "First-serve Points Won",
    "Second-serve Points Won",
    "Serve Games",
    "Break Points Saved",
    "Break Points Faced",
  ].forEach((header) => {
    let th = document.createElement("th");
    th.innerText = header;
    headerRow.appendChild(th);
  });
  table.appendChild(thead);

  // Populate table rows
  let tbody = document.createElement("tbody");
  results.forEach((element) => {
    let row = tbody.insertRow();

    row.insertCell().innerText = element.ace;
    row.insertCell().innerText = element.df;
    row.insertCell().innerText = element.svpt;
    row.insertCell().innerText = element.firstIn;
    row.insertCell().innerText = element.firstWon;
    row.insertCell().innerText = element.secondWon;
    row.insertCell().innerText = element.SvGms;
    row.insertCell().innerText = element.bpSaved;
    row.insertCell().innerText = element.bpFaced; // Note: Adjusted from 'elementAVG.bpFaced' to 'element.bpFaced'
  });
  table.appendChild(tbody);
}

function fetchData(url, callback) {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(async (response) => {
      callback(await response.json());
    })
    .catch((error) => {
      alert(`Cannot obtain data from ${url}`);
    });
}

function fetchPlayerData() {
  const playerName = document.getElementById("playerName").value;
  fetchData(`/player?name=${playerName}`, populatePlayerDetails);
}

function fetchTournamentsByYear() {
  // Get the year from the input field
  const year = document.getElementById("tournamentYear").value;

  // Check if the year is filled
  if (year) {
    fetchTournamentData(year);
  } else {
    alert("Please enter a year.");
  }
}

function fetchTournamentData(year) {
  fetchData(`/tournaments?year=${year}`, populateTournamentsByYear);
}

function fetchStatisticsData() {
  const playerName = document.getElementById("playerNameStat").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  // Check if all fields are filled
  if (playerName && startDate && endDate) {
    fetchData(
      `/playerStatistics?name=${playerName}&start=${startDate}&finish=${endDate}`,
      populateAggregateStatistics
    );
  } else {
    alert("Please fill in all required fields.");
  }
}
