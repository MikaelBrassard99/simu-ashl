let chart_playerStat = [];
let chart_avgFwdOV = [];
let gbl_avg_league_stat_def;
let gbl_avg_league_stat_fwd;

let playerChart = new Chart("radarChart", {
  type: "radar",
  data: {
    labels: [
      "FO",
      "FG",
      "CK",
      "ST",
      "EN",
      "DU",
      "SK",
      "PH",
      "PA",
      "SC",
      "DF",
      "EX",
      "LD",
      "DI",
    ],
    datasets: [
      {
        label: "Stats joueur",
        data: chart_playerStat,
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
      {
        label: "Moyenne de la ligue",
        data: chart_avgFwdOV,
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
      },
    ],
  },
  options: {
    scale: {
      ticks: {
        beginAtZero: false,
        max: d3.max(chart_playerStat),
        min: d3.min(chart_playerStat),
        stepSize: 2,
      },
      pointLabels: {
        fontSize: 18,
      },
    },
  },
});

//get selected value from playerName scoll
const input = document.querySelector("input");

input.addEventListener("change", getSelectedValue);

function getSelectedValue(e) {
  $(document).ready(function () {
    var div = document.createElement("div");
    let value = e.target.value;
    $.ajax({
      url: "/updateChart",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(value),
      success: function (response) {
        //create a drag and drop div of the player selected
        div.innerHTML = value;
        div.draggable = "true";
        div.className = "box2";
        div.id = value.replace(/\s/g, '')
        div.addEventListener('dragstart', handleDragStart);
        div.addEventListener('dragover', handleDragOver);
        div.addEventListener('dragenter', handleDragEnter);
        div.addEventListener('dragleave', handleDragLeave);
        div.addEventListener('dragend', handleDragEnd);
        div.addEventListener('drop', handleDrop);
        div.addEventListener("dblclick", handleDblClick);
        //div.addEventListener('mouseover', getValueFromPlayer)
        //verify if already an element at this id. if not, create one, if true dont do anything
        try {
          var node = document.getElementById(value.replace(/\s/g, '')).firstChild;  // Get the first child node of the first list
        }
        catch {
          document.getElementById("playerSel").appendChild(div);
        }

        $("#result").text("Processed value: " + value);
        synchRadarChart();
      },
      error: function (xhr, status, error) { },
    });
  });
}
// Function to generate a random hexadecimal color code
function getRandomColor() {
  // Generate a random number between 0 and 16777215 (hexadecimal FFFFFF)
  let color = Math.floor(Math.random() * 16777215).toString(16);
  // Pad the color code with zeros if necessary to ensure it has 6 digits
  while (color.length < 6) {
    color = "0" + color;
  }
  // Return the hexadecimal color code
  return "#" + color;
}
//js for modifying data
function modifyVariable() {
  let newValue = document.getElementById("newVariableValue").value;
  document.getElementById("pythonVariable").innerText = newValue;
}

//RadarChart call from allStats script tag
let chart_playerSelStat = [];
let chart_playerSelStatFiltered = [];
let chart_avgStat = [];
let chart_labels = [];
let newValueTd = "";
let valueOfPlayerOV = [];
function updateRadarChart(avg_league_stat_def, avg_league_stat_fwd) {
  gbl_avg_league_stat_def = avg_league_stat_def;
  gbl_avg_league_stat_fwd = avg_league_stat_fwd;
  $.get("/updateChart", function (response) {
    // Process the received JSON data
    if (response !== null && typeof response !== "undefined") {
      //all PlayerStat
      chart_playerSelStat = JSON.parse(response.values)[0];
      //get column to show in chart
      chart_labels = response.labels;
      //get name from player
      chart_playerStatName = chart_playerSelStat.Name;
      //get team name from player
      chart_playerTeamName = chart_playerSelStat.TeamName;

      //get values from column
      for (let i = 0; i < chart_labels.length; i++) {
        chart_playerSelStatFiltered[i] = chart_playerSelStat[chart_labels[i]];
      }
      //verify if player is D
      if (chart_playerSelStat.PosD == "True") {
        //get average static league stat from rendertemplate
        chart_avgStat = avg_league_stat_def;
        chart_avgStatLabel = "Moyenne def";
      } else {
        chart_avgStat = avg_league_stat_fwd;
        chart_avgStatLabel = "Moyenne att";
      }

      for (let i = 0; i < JSON.parse(response.playerSelSorted).length; i++) {
        let valueOfPlayerSelectOV = JSON.parse(response.playerSelSorted)[i];
        let valueOfPlayersTeamSelectOV = JSON.parse(response.playersFromTeamSel)[i];
        let valueAvgDef = document.getElementById(i + "_def").innerHTML;
        let valueAvgOff = document.getElementById(i + "_off").innerHTML;

        //verify if is a defensman of not to make the diff between is stats and the general stats of the league at is position
        //i==0|| i==23 || i==25 || i==26 || i==41 is SalaryAverage , Pim, ShotsBlock, OwnShotsBlock and GiveAway so we dont want do be red when its negative
        if (chart_playerSelStat.PosD == "True") {
          newValueTd =
            "(" + Math.round(valueOfPlayerSelectOV - valueAvgDef) + ")";
          if ((valueOfPlayerSelectOV - valueAvgDef) < -0.5) {
            (i == 0 || i == 23 || i == 25 || i == 26 || i == 41) ? document.getElementById(i + "_diff").style.color = "green" : document.getElementById(i + "_diff").style.color = "red";
          }
          else {
            (i == 0 || i == 23 || i == 25 || i == 26 || i == 41) ? document.getElementById(i + "_diff").style.color = "red" : document.getElementById(i + "_diff").style.color = "green";
          }
        } else {
          newValueTd =
            "(" + Math.round(valueOfPlayerSelectOV - valueAvgOff) + ")";
          if ((valueOfPlayerSelectOV - valueAvgOff) < -0.5) {
            (i == 0 || i == 23 || i == 25 || i == 26 || i == 41) ? document.getElementById(i + "_diff").style.color = "green" : document.getElementById(i + "_diff").style.color = "red";
          }
          else {
            (i == 0 || i == 23 || i == 25 || i == 26 || i == 41) ? document.getElementById(i + "_diff").style.color = "red" : document.getElementById(i + "_diff").style.color = "green";
          }
        }

        document.getElementById(i).innerHTML = valueOfPlayerSelectOV;
        document.getElementById(i + "_diff").innerHTML = newValueTd;
        document.getElementById(i + "_team").innerHTML = Math.round(valueOfPlayersTeamSelectOV);
      }
    }
    document.getElementById("PlayerName").innerHTML = chart_playerStatName;
    document.getElementById("TeamName").innerHTML = chart_playerTeamName;
    playerChart.data.labels = chart_labels;
    playerChart.data.datasets[0].label = chart_playerStatName;
    playerChart.data.datasets[0].data = chart_playerSelStatFiltered;
    playerChart.data.datasets[1].label = chart_avgStatLabel;
    playerChart.data.datasets[1].data = chart_avgStat;
    playerChart.update();
  });
}
function updateDataOnMouseOver(playerName, avg_league_stat_def, avg_league_stat_fwd) {
  var url = '/updateChartMouseOver';
  var data = { playerName: playerName };
  $.get(url, data, function (response) {
    // Process the received JSON data
    if (response !== null && typeof response !== "undefined") {
      //all PlayerStat
      chart_playerSelStat = JSON.parse(response.values)[0];
      //get column to show in chart
      chart_labels = response.labels;
      //get name from player
      chart_playerStatName = chart_playerSelStat.Name;
      //get team name from player
      chart_playerTeamName = chart_playerSelStat.TeamName;

      //get values from column
      for (let i = 0; i < chart_labels.length; i++) {
        chart_playerSelStatFiltered[i] = chart_playerSelStat[chart_labels[i]];
      }
      //verify if player is D
      if (chart_playerSelStat.PosD == "True") {
        //get average static league stat from rendertemplate
        chart_avgStat = avg_league_stat_def;
        chart_avgStatLabel = "Moyenne def";
      } else {
        chart_avgStat = avg_league_stat_fwd;
        chart_avgStatLabel = "Moyenne att";
      }

      for (let i = 0; i < JSON.parse(response.playerSelSorted).length; i++) {
        let valueOfPlayerSelectOV = JSON.parse(response.playerSelSorted)[i];
        let valueOfPlayersTeamSelectOV = JSON.parse(response.playersFromTeamSel)[i];
        let valueAvgDef = document.getElementById(i + "_def").innerHTML;
        let valueAvgOff = document.getElementById(i + "_off").innerHTML;

        //verify if is a defensman of not to make the diff between is stats and the general stats of the league at is position
        //i==0|| i==23 || i==25 || i==26 || i==41 is SalaryAverage , Pim, ShotsBlock, OwnShotsBlock and GiveAway so we dont want do be red when its negative
        if (chart_playerSelStat.PosD == "True") {
          newValueTd =
            "(" + Math.round(valueOfPlayerSelectOV - valueAvgDef) + ")";
          if ((valueOfPlayerSelectOV - valueAvgDef) < -0.5) {
            (i == 0 || i == 23 || i == 25 || i == 26 || i == 41) ? document.getElementById(i + "_diff").style.color = "green" : document.getElementById(i + "_diff").style.color = "red";
          }
          else {
            (i == 0 || i == 23 || i == 25 || i == 26 || i == 41) ? document.getElementById(i + "_diff").style.color = "red" : document.getElementById(i + "_diff").style.color = "green";
          }
        } else {
          newValueTd =
            "(" + Math.round(valueOfPlayerSelectOV - valueAvgOff) + ")";
          if ((valueOfPlayerSelectOV - valueAvgOff) < -0.5) {
            (i == 0 || i == 23 || i == 25 || i == 26 || i == 41) ? document.getElementById(i + "_diff").style.color = "green" : document.getElementById(i + "_diff").style.color = "red";
          }
          else {
            (i == 0 || i == 23 || i == 25 || i == 26 || i == 41) ? document.getElementById(i + "_diff").style.color = "red" : document.getElementById(i + "_diff").style.color = "green";
          }
        }

        document.getElementById(i).innerHTML = valueOfPlayerSelectOV;
        document.getElementById(i + "_diff").innerHTML = newValueTd;
        document.getElementById(i + "_team").innerHTML = Math.round(valueOfPlayersTeamSelectOV);
      }
    }
    document.getElementById("PlayerName").innerHTML = chart_playerStatName;
    document.getElementById("TeamName").innerHTML = chart_playerTeamName;
    playerChart.data.labels = chart_labels;
    playerChart.data.datasets[0].label = chart_playerStatName;
    playerChart.data.datasets[0].data = chart_playerSelStatFiltered;
    playerChart.data.datasets[1].label = chart_avgStatLabel;
    playerChart.data.datasets[1].data = chart_avgStat;
    playerChart.update();
  });
}
//getvaluesOfSelectedPlayer from event
let playerSelStat = [];
let playerSelStatFiltered = [];
let avgStat = [];
let labels = [];
function event_getValuePlayer(e) {
  if (this.innerHTML != '') {
    var url = '/getStatFromPlayerName';
    var data = { playerName: this.innerHTML };
    $.get(url, data, function (response) {
      if (response !== null && typeof response !== "undefined") {
        //all PlayerStat
        playerSelStat = JSON.parse(response.values)[0];
        //get column to show in chart
        labels = response.labels;

        //get name from player
        playerStatName = playerSelStat.Name;
        //get team name from player
        playerTeamName = playerSelStat.TeamName;

        for (let i = 0; i < labels.length; i++) {
          playerSelStatFiltered[i] = playerSelStat[labels[i]];
        }
        console.log(playerStatName, playerTeamName, playerSelStatFiltered);
        updateDataOnMouseOver(playerStatName, gbl_avg_league_stat_def, gbl_avg_league_stat_fwd);
      }
    });
  }
}
//getvaluesOfSelectedPlayer from demand
let player1Stat = [];
let player2Stat = [];
let player3Stat = [];
let player1StatFiltered = [];
let player2StatFiltered = [];
let player3StatFiltered = [];
function getValueFromPlayer(playerNames, provider) {
  var url = '/getStatFromPlayersName';
  var data = { playerName1: playerNames[0], playerName2: playerNames[1], playerName3: playerNames[2] };


  $.get(url, data, function (response) {
    if (response !== null && typeof response !== "undefined") {
      //all PlayerStat
      if (response.valuesP1 != '' && response.valuesP2 != '' && response.valuesP3 != '') {
        player1Stat = JSON.parse(response.valuesP1)[0];
        player2Stat = JSON.parse(response.valuesP2)[0];
        player3Stat = JSON.parse(response.valuesP3)[0];
        console.log(player1Stat, player2Stat, player3Stat)
        labels = response.labels;
        for (let i = 0; i < labels.length; i++) {
          player1StatFiltered[i] = player1Stat[labels[i]];
          player2StatFiltered[i] = player2Stat[labels[i]];
          player3StatFiltered[i] = player3Stat[labels[i]];
          var div = document.getElementById(`${labels[i]}_${provider}`)
          div.innerHTML = Math.round((player1StatFiltered[i] + player2StatFiltered[i] + player3StatFiltered[i]) / 3);
        }
      }
      else {
        for (let i = 0; i < labels.length; i++) {
          var div = document.getElementById(`${labels[i]}_${provider}`)
          div.innerHTML = '';
        }
      }
      console.log(player1StatFiltered, player2StatFiltered, player3StatFiltered);
    }
  });
}
function getValueFromdef(playerNames, provider) {
  var url = '/getStatFromDefsName';
  var data = { playerName1: playerNames[0], playerName2: playerNames[1] };
  $.get(url, data, function (response) {
    if (response !== null && typeof response !== "undefined") {
      //all PlayerStat
      if (response.valuesP1 != '' && response.valuesP2 != '' && response.valuesP3 != '') {
        player1Stat = JSON.parse(response.valuesP1)[0];
        player2Stat = JSON.parse(response.valuesP2)[0];
        console.log(player1Stat, player2Stat)
        labels = response.labels;
        for (let i = 0; i < labels.length; i++) {
          player1StatFiltered[i] = player1Stat[labels[i]];
          player2StatFiltered[i] = player2Stat[labels[i]];
          var div = document.getElementById(`${labels[i]}_${provider}`)
          div.innerHTML = Math.round((player1StatFiltered[i] + player2StatFiltered[i]) / 2);
        }
      }
      else {
        for (let i = 0; i < labels.length; i++) {
          var div = document.getElementById(`${labels[i]}_${provider}`)
          div.innerHTML = '';
        }
      }
      console.log(player1StatFiltered, player2StatFiltered);
    }
  });
}
//dragable functions
function handleDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDblClick(e) {
  this.remove();
}

var lineStatGrid = [];
function handleDrop(e) {
  e.stopPropagation();

  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  //Populate all stats from line
  lineStatGrid[0] = document.getElementById("LW_Line_1");
  lineStatGrid[1] = document.getElementById("LW_Line_2");
  lineStatGrid[2] = document.getElementById("LW_Line_3");
  lineStatGrid[3] = document.getElementById("LW_Line_4");

  lineStatGrid[4] = document.getElementById("C_Line_1");
  lineStatGrid[5] = document.getElementById("C_Line_2");
  lineStatGrid[6] = document.getElementById("C_Line_3");
  lineStatGrid[7] = document.getElementById("C_Line_4");

  lineStatGrid[8] = document.getElementById("RW_Line_1");
  lineStatGrid[9] = document.getElementById("RW_Line_2");
  lineStatGrid[10] = document.getElementById("RW_Line_3");
  lineStatGrid[11] = document.getElementById("RW_Line_4");

  lineStatGrid[12] = document.getElementById("DG_Line_1");
  lineStatGrid[13] = document.getElementById("DD_Line_1");

  lineStatGrid[14] = document.getElementById("DG_Line_2");
  lineStatGrid[15] = document.getElementById("DD_Line_2");

  lineStatGrid[16] = document.getElementById("DG_Line_3");
  lineStatGrid[17] = document.getElementById("DD_Line_3");
  
  localStorage.setItem("LW_Line_1", lineStatGrid[0].innerHTML);
  localStorage.setItem("LW_Line_2", lineStatGrid[1].innerHTML);
  localStorage.setItem("LW_Line_3", lineStatGrid[2].innerHTML);
  localStorage.setItem("LW_Line_4", lineStatGrid[3].innerHTML);

  localStorage.setItem("C_Line_1", lineStatGrid[4].innerHTML);
  localStorage.setItem("C_Line_2", lineStatGrid[5].innerHTML);
  localStorage.setItem("C_Line_3", lineStatGrid[6].innerHTML);
  localStorage.setItem("C_Line_4", lineStatGrid[7].innerHTML);

  localStorage.setItem("RW_Line_1", lineStatGrid[8].innerHTML);
  localStorage.setItem("RW_Line_2", lineStatGrid[9].innerHTML);
  localStorage.setItem("RW_Line_3", lineStatGrid[10].innerHTML);
  localStorage.setItem("RW_Line_4", lineStatGrid[11].innerHTML);

  localStorage.setItem("DG_Line_1", lineStatGrid[12].innerHTML);
  localStorage.setItem("DD_Line_1", lineStatGrid[13].innerHTML);

  localStorage.setItem("DG_Line_2", lineStatGrid[14].innerHTML);
  localStorage.setItem("DD_Line_2", lineStatGrid[15].innerHTML);

  localStorage.setItem("DG_Line_3", lineStatGrid[16].innerHTML);
  localStorage.setItem("DD_Line_3", lineStatGrid[17].innerHTML);


  //verify if line 1 is full and populate grid stats
  if (lineStatGrid[0].innerHTML != '' && lineStatGrid[4].innerHTML != '' && lineStatGrid[8].innerHTML != '') {
    console.log('line 1 full', lineStatGrid[0].innerHTML, lineStatGrid[4].innerHTML, lineStatGrid[8].innerHTML);
    getValueFromPlayer([lineStatGrid[0].innerHTML, lineStatGrid[4].innerHTML, lineStatGrid[8].innerHTML], "Line_1");
  }
  //verify if line 2 is full and populate grid stats
  if (lineStatGrid[1].innerHTML != '' && lineStatGrid[5].innerHTML != '' && lineStatGrid[9].innerHTML != '') {
    console.log('line 2 full');
    getValueFromPlayer([lineStatGrid[1].innerHTML, lineStatGrid[5].innerHTML, lineStatGrid[9].innerHTML], "Line_2");
  }
  //verify if line 3 is full and populate grid stats
  if (lineStatGrid[2].innerHTML != '' && lineStatGrid[6].innerHTML != '' && lineStatGrid[10].innerHTML != '') {
    console.log('line 3 full');
    getValueFromPlayer([lineStatGrid[2].innerHTML, lineStatGrid[6].innerHTML, lineStatGrid[10].innerHTML], "Line_3");
  }
  //verify if line 4 is full and populate grid stats
  if (lineStatGrid[3].innerHTML != '' && lineStatGrid[7].innerHTML != '' && lineStatGrid[11].innerHTML != '') {
    console.log('line 4 full');
    getValueFromPlayer([lineStatGrid[3].innerHTML, lineStatGrid[7].innerHTML, lineStatGrid[11].innerHTML], "Line_4");
  }
  //verify if paire 1 is full and populate grid stats
  if (lineStatGrid[12].innerHTML != '' && lineStatGrid[13].innerHTML != '') {
    console.log('paire 1 full');
    getValueFromdef([lineStatGrid[12].innerHTML, lineStatGrid[13].innerHTML], "Paire_1");
  }
  //verify if paire 1 is full and populate grid stats
  if (lineStatGrid[14].innerHTML != '' && lineStatGrid[15].innerHTML != '') {
    console.log('paire 2 full');
    getValueFromdef([lineStatGrid[14].innerHTML, lineStatGrid[15].innerHTML], "Paire_2");
  }
  //verify if paire 1 is full and populate grid stats
  if (lineStatGrid[16].innerHTML != '' && lineStatGrid[17].innerHTML != '') {
    console.log('paire 3 full');
    getValueFromdef([lineStatGrid[16].innerHTML, lineStatGrid[17].innerHTML], "Paire_3");
  }
  return false;
}

function handleDragEnd(e) {
  this.style.opacity = '1';
  let items = document.querySelectorAll('.container .box');
  items.forEach(function (item) {
    item.classList.remove('over');
  });
}

function handleDragOver(e) {
  e.preventDefault();
  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

document.addEventListener('DOMContentLoaded', (event) => {
  let items = document.querySelectorAll('.container .box');
  items.forEach(function (item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dblclick', event_getValuePlayer)
  });

    //Populate all stats from line
    document.getElementById("LW_Line_1").innerHTML = localStorage.getItem("LW_Line_1");
    document.getElementById("LW_Line_2").innerHTML = localStorage.getItem("LW_Line_2");
    document.getElementById("LW_Line_3").innerHTML = localStorage.getItem("LW_Line_3");
    document.getElementById("LW_Line_4").innerHTML = localStorage.getItem("LW_Line_4");
  
    document.getElementById("C_Line_1").innerHTML = localStorage.getItem("C_Line_1");
    document.getElementById("C_Line_2").innerHTML = localStorage.getItem("C_Line_2");
    document.getElementById("C_Line_3").innerHTML = localStorage.getItem("C_Line_3");
    document.getElementById("C_Line_4").innerHTML = localStorage.getItem("C_Line_4");
  
    document.getElementById("RW_Line_1").innerHTML = localStorage.getItem("RW_Line_1");
    document.getElementById("RW_Line_2").innerHTML = localStorage.getItem("RW_Line_2");
    document.getElementById("RW_Line_3").innerHTML = localStorage.getItem("RW_Line_3");
    document.getElementById("RW_Line_4").innerHTML = localStorage.getItem("RW_Line_4");
  
    document.getElementById("DG_Line_1").innerHTML = localStorage.getItem("DG_Line_1");
    document.getElementById("DD_Line_1").innerHTML = localStorage.getItem("DD_Line_1");
  
    document.getElementById("DG_Line_2").innerHTML = localStorage.getItem("DG_Line_2");
    document.getElementById("DD_Line_2").innerHTML = localStorage.getItem("DD_Line_2");
  
    document.getElementById("DG_Line_3").innerHTML = localStorage.getItem("DG_Line_3");
    document.getElementById("DD_Line_3").innerHTML = localStorage.getItem("DD_Line_3");
});
