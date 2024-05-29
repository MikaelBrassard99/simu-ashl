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
const inputPlayer = document.querySelector(".playerSel");
const inputGoalie = document.querySelector(".goalieSel");
const inputTeam = document.querySelector(".teamSel");

inputPlayer.addEventListener("change", getSelectedPlayerValue);
inputGoalie.addEventListener("change", getSelectedGoalieValue);
inputTeam.addEventListener("change", getSelectedTeamValue);

function getSelectedPlayerValue(e) {
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
        div.dataset.status = "player"; 
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
          document.getElementById("elemSel").appendChild(div);
        }

        $("#result").text("Processed value: " + value);
        synchRadarChart();
      },
      error: function (xhr, status, error) { },
    });
  });
}
function getSelectedGoalieValue(e) {
  $(document).ready(function () {
    var div = document.createElement("div");
    let value = e.target.value;
    $.ajax({
      url: "/updateChartGoalie",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(value),
      success: function (response) {
        //create a drag and drop div of the player selected
        div.innerHTML = value;
        div.draggable = "true";
        div.className = "box2";
        div.dataset.status = "goalie"; 
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
          document.getElementById("elemSel").appendChild(div);
        }

        $("#result").text("Processed value: " + value);
        //synchRadarChart();
      },
      error: function (xhr, status, error) { },
    });
  });
}
function getSelectedTeamValue(e) {
  $(document).ready(function () {
    var div = document.createElement("div");
    let value = e.target.value;
    let rcvData;
    $.ajax({
      url: "/getPlayersStatsFromTeam",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(value),
      success: function (response) {
        //create a drag and drop div of the player selected
        rcvData = JSON.parse(response.values)[0];
        //Populate all stats from line
        document.getElementById("LW_Line_1").innerHTML = rcvData.Line15vs5ForwardLeftWing;
        document.getElementById("LW_Line_2").innerHTML = rcvData.Line25vs5ForwardLeftWing;
        document.getElementById("LW_Line_3").innerHTML = rcvData.Line35vs5ForwardLeftWing;
        document.getElementById("LW_Line_4").innerHTML = rcvData.Line45vs5ForwardLeftWing;

        document.getElementById("C_Line_1").innerHTML = rcvData.Line15vs5ForwardCenter;
        document.getElementById("C_Line_2").innerHTML = rcvData.Line25vs5ForwardCenter;
        document.getElementById("C_Line_3").innerHTML = rcvData.Line35vs5ForwardCenter;
        document.getElementById("C_Line_4").innerHTML = rcvData.Line45vs5ForwardCenter;

        document.getElementById("RW_Line_1").innerHTML = rcvData.Line15vs5ForwardRightWing;
        document.getElementById("RW_Line_2").innerHTML = rcvData.Line25vs5ForwardRightWing;
        document.getElementById("RW_Line_3").innerHTML = rcvData.Line35vs5ForwardRightWing;
        document.getElementById("RW_Line_4").innerHTML = rcvData.Line45vs5ForwardRightWing;

        document.getElementById("DG_Line_1").innerHTML = rcvData.Line15vs5DefenseDefense1;
        document.getElementById("DD_Line_1").innerHTML = rcvData.Line15vs5DefenseDefense2;

        document.getElementById("DG_Line_2").innerHTML = rcvData.Line25vs5DefenseDefense1;
        document.getElementById("DD_Line_2").innerHTML = rcvData.Line25vs5DefenseDefense2;

        document.getElementById("DG_Line_3").innerHTML = rcvData.Line35vs5DefenseDefense1;
        document.getElementById("DD_Line_3").innerHTML = rcvData.Line35vs5DefenseDefense2;
        
        populateGeneralLineStat();

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
function updateDataOnDblClick(playerName, avg_league_stat_def, avg_league_stat_fwd) {
  var url = '/updateDataOnDblClick';
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
function event_getValuePlayer(params) {
  if (params != '') {
    var url = '/getStatFromPlayerName';
    var data = { playerName: params };
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
        updateDataOnDblClick(playerStatName, gbl_avg_league_stat_def, gbl_avg_league_stat_fwd);
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
        labels = response.labels;
        for (let i = 0; i < labels.length; i++) {
          player1StatFiltered[i] = player1Stat[labels[i]];
          player2StatFiltered[i] = player2Stat[labels[i]];
          player3StatFiltered[i] = player3Stat[labels[i]];
          var div_stat = document.getElementById(`${labels[i]}_${provider}`)
          div_stat.innerHTML = Math.round((player1StatFiltered[i] + player2StatFiltered[i] + player3StatFiltered[i]) / 3);
        }
        var div_salary = document.getElementById(`Salary_${provider}`)
        div_salary.innerHTML = (player1Stat['SalaryAverage']+player2Stat['SalaryAverage']+player3Stat['SalaryAverage']);
        
        var div_tot_salary = document.getElementById('tot_player_salary');
        div_tot_salary.innerHTML = (Number(document.getElementById('Salary_Line_1').innerHTML)+Number(document.getElementById('Salary_Line_2').innerHTML)+Number(document.getElementById('Salary_Line_3').innerHTML)+Number(document.getElementById('Salary_Line_4').innerHTML)+Number(document.getElementById('Salary_Paire_1').innerHTML)+Number(document.getElementById('Salary_Paire_2').innerHTML)+Number(document.getElementById('Salary_Paire_3').innerHTML));
      }
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
        labels = response.labels;
        for (let i = 0; i < labels.length; i++) {
          player1StatFiltered[i] = player1Stat[labels[i]];
          player2StatFiltered[i] = player2Stat[labels[i]];
          var div_stat = document.getElementById(`${labels[i]}_${provider}`)
          div_stat.innerHTML = Math.round((player1StatFiltered[i] + player2StatFiltered[i]) / 2);
        }
        var div_salary = document.getElementById(`Salary_${provider}`)
        div_salary.innerHTML = (player1Stat['SalaryAverage']+player2Stat['SalaryAverage']);

        var div_tot_salary = document.getElementById('tot_player_salary');
        div_tot_salary.innerHTML = (Number(document.getElementById('Salary_Line_1').innerHTML)+Number(document.getElementById('Salary_Line_2').innerHTML)+Number(document.getElementById('Salary_Line_3').innerHTML)+Number(document.getElementById('Salary_Line_4').innerHTML)+Number(document.getElementById('Salary_Paire_1').innerHTML)+Number(document.getElementById('Salary_Paire_2').innerHTML)+Number(document.getElementById('Salary_Paire_3').innerHTML));
      }
    }
  });
}

function populateGeneralLineStat(){
  //verify if line 1 is full and populate grid stats
  if (document.getElementById("LW_Line_1").innerHTML != '' && document.getElementById("C_Line_1").innerHTML != '' && document.getElementById("RW_Line_1").innerHTML != '') {
    getValueFromPlayer([document.getElementById("LW_Line_1").innerHTML, document.getElementById("C_Line_1").innerHTML, document.getElementById("RW_Line_1").innerHTML], "Line_1");
  }
  else{
      for (let i = 0; i < labels.length; i++) {
        var div = document.getElementById(`${labels[i]}_Line_1`)
        div.innerHTML = '';
        var div_tot_salary = document.getElementById('Salary_Line_1');
        div_tot_salary.innerHTML = '';
      }
    }
  //verify if line 2 is full and populate grid stats
  if (document.getElementById("LW_Line_2").innerHTML != '' && document.getElementById("C_Line_2").innerHTML != '' && document.getElementById("RW_Line_2").innerHTML != '') {
    getValueFromPlayer([document.getElementById("LW_Line_2").innerHTML, document.getElementById("C_Line_2").innerHTML, document.getElementById("RW_Line_2").innerHTML], "Line_2");
  }
  else{
    for (let i = 0; i < labels.length; i++) {
      var div = document.getElementById(`${labels[i]}_Line_2`)
      div.innerHTML = '';
      var div_tot_salary = document.getElementById('Salary_Line_2');
      div_tot_salary.innerHTML = '';
    }
  }
  //verify if line 3 is full and populate grid stats
  if (document.getElementById("LW_Line_3").innerHTML != '' && document.getElementById("C_Line_3").innerHTML != '' && document.getElementById("RW_Line_3").innerHTML != '') {
    getValueFromPlayer([document.getElementById("LW_Line_3").innerHTML, document.getElementById("C_Line_3").innerHTML, document.getElementById("RW_Line_3").innerHTML], "Line_3");
  }
  else{
    for (let i = 0; i < labels.length; i++) {
      var div = document.getElementById(`${labels[i]}_Line_3`)
      div.innerHTML = '';
      var div_tot_salary = document.getElementById('Salary_Line_3');
      div_tot_salary.innerHTML = '';
    }
  }
  //verify if line 4 is full and populate grid stats
  if (document.getElementById("LW_Line_4").innerHTML != '' && document.getElementById("C_Line_4").innerHTML != '' && document.getElementById("RW_Line_4").innerHTML != '') {
    getValueFromPlayer([document.getElementById("LW_Line_4").innerHTML, document.getElementById("C_Line_4").innerHTML, document.getElementById("RW_Line_4").innerHTML], "Line_4");
  }
  else{
    for (let i = 0; i < labels.length; i++) {
      var div = document.getElementById(`${labels[i]}_Line_4`)
      div.innerHTML = '';
      var div_tot_salary = document.getElementById('Salary_Line_4');
      div_tot_salary.innerHTML = '';
    }
  }
  //verify if Line 1 is full and populate grid stats
  if (document.getElementById("DG_Line_1").innerHTML != '' && document.getElementById("DD_Line_1").innerHTML != '') {
    getValueFromdef([document.getElementById("DG_Line_1").innerHTML, document.getElementById("DD_Line_1").innerHTML], "Paire_1");
  }
  else{
    for (let i = 0; i < labels.length; i++) {
      var div = document.getElementById(`${labels[i]}_Paire_1`)
      div.innerHTML = '';
      var div_tot_salary = document.getElementById('Salary_Paire_1');
      div_tot_salary.innerHTML = '';
    }
  }
  //verify if Line 1 is full and populate grid stats
  if (document.getElementById("DG_Line_2").innerHTML != '' && document.getElementById("DD_Line_2").innerHTML != '') {
    getValueFromdef([document.getElementById("DG_Line_2").innerHTML, document.getElementById("DD_Line_2").innerHTML], "Paire_2");
  }
  else{
    for (let i = 0; i < labels.length; i++) {
      var div = document.getElementById(`${labels[i]}_Paire_2`)
      div.innerHTML = '';
      var div_tot_salary = document.getElementById('Salary_Paire_2');
      div_tot_salary.innerHTML = '';
    }
  }
  //verify if Line 1 is full and populate grid stats
  if (document.getElementById("DG_Line_3").innerHTML != '' && document.getElementById("DD_Line_3").innerHTML != '') {
    getValueFromdef([document.getElementById("DG_Line_3").innerHTML, document.getElementById("DD_Line_3").innerHTML], "Paire_3");
  }
  else{
    for (let i = 0; i < labels.length; i++) {
      var div = document.getElementById(`${labels[i]}_Paire_3`)
      div.innerHTML = '';
      var div_tot_salary = document.getElementById('Salary_Paire_3');
      div_tot_salary.innerHTML = '';
    }
  }
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
    if(dragSrcEl.dataset.status == this.dataset.status){
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }
  }
  populateGeneralLineStat();
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

function choiceOnPlayer(e) {
  if(this.innerHTML != ''){
    if (confirm("OK: montrer les statistiques, Cancel: supprimer le joueur")) {
      if(this.dataset.status == "player"){
        event_getValuePlayer(this.innerHTML);
      }
    } else {
      this.innerHTML = '';
      populateGeneralLineStat();
    }
  }
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
    item.addEventListener('dblclick', choiceOnPlayer);
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

    document.getElementById("G_1").innerHTML = localStorage.getItem("G_1");
    document.getElementById("G_2").innerHTML = localStorage.getItem("G_2");
    
    populateGeneralLineStat();
});

window.addEventListener("beforeunload", function (e) {
  localStorage.setItem("LW_Line_1", document.getElementById("LW_Line_1").innerHTML);
  localStorage.setItem("LW_Line_2", document.getElementById("LW_Line_2").innerHTML);
  localStorage.setItem("LW_Line_3", document.getElementById("LW_Line_3").innerHTML);
  localStorage.setItem("LW_Line_4", document.getElementById("LW_Line_4").innerHTML);

  localStorage.setItem("C_Line_1", document.getElementById("C_Line_1").innerHTML);
  localStorage.setItem("C_Line_2", document.getElementById("C_Line_2").innerHTML);
  localStorage.setItem("C_Line_3", document.getElementById("C_Line_3").innerHTML);
  localStorage.setItem("C_Line_4", document.getElementById("C_Line_4").innerHTML);

  localStorage.setItem("RW_Line_1", document.getElementById("RW_Line_1").innerHTML);
  localStorage.setItem("RW_Line_2", document.getElementById("RW_Line_2").innerHTML);
  localStorage.setItem("RW_Line_3", document.getElementById("RW_Line_3").innerHTML);
  localStorage.setItem("RW_Line_4", document.getElementById("RW_Line_4").innerHTML);

  localStorage.setItem("DG_Line_1", document.getElementById("DG_Line_1").innerHTML);
  localStorage.setItem("DD_Line_1", document.getElementById("DD_Line_1").innerHTML);

  localStorage.setItem("DG_Line_2", document.getElementById("DG_Line_2").innerHTML);
  localStorage.setItem("DD_Line_2", document.getElementById("DD_Line_2").innerHTML);

  localStorage.setItem("DG_Line_3", document.getElementById("DG_Line_3").innerHTML);
  localStorage.setItem("DD_Line_3", document.getElementById("DD_Line_3").innerHTML);

  localStorage.setItem("G_1", document.getElementById("G_1").innerHTML);
  localStorage.setItem("G_2", document.getElementById("G_2").innerHTML);
});
