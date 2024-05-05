let chart_playerStat = [];
let chart_avgFwdOV = [];

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
function getSelectedValue(selectedValue) {
  $(document).ready(function () {
    let value = selectedValue;
    $.ajax({
      url: "/updateChart",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(value),
      success: function (response) {
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

//table sort
document.addEventListener("click", function (e) {
  try {
    function findElementRecursive(element, tag) {
      return element.nodeName === tag
        ? element
        : findElementRecursive(element.parentNode, tag);
    }
    let descending_th_class = " dir-d ";
    let ascending_th_class = " dir-u ";
    let ascending_table_sort_class = "asc";
    let regex_dir = / dir-(u|d) /;
    let regex_table = /\bsortable\b/;
    let alt_sort = e.shiftKey || e.altKey;
    let element = findElementRecursive(e.target, "TH");
    let tr = findElementRecursive(element, "TR");
    let table = findElementRecursive(tr, "TABLE");
    function reClassify(element, dir) {
      element.className = element.className.replace(regex_dir, "") + dir;
    }
    function getValue(element) {
      return (
        (alt_sort && element.getAttribute("data-sort-alt")) ||
        element.getAttribute("data-sort") ||
        element.innerText
      );
    }
    if (regex_table.test(table.className)) {
      let column_index;
      let nodes = tr.cells;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] === element) {
          column_index = element.getAttribute("data-sort-col") || i;
        } else {
          reClassify(nodes[i], "");
        }
      }
      let dir = descending_th_class;
      if (
        element.className.indexOf(descending_th_class) !== -1 ||
        (table.className.indexOf(ascending_table_sort_class) !== -1 &&
          element.className.indexOf(ascending_th_class) == -1)
      ) {
        dir = ascending_th_class;
      }
      reClassify(element, dir);
      let org_tbody = table.tBodies[0];
      let rows = [].slice.call(org_tbody.rows, 0);
      let reverse = dir === ascending_th_class;
      rows.sort(function (a, b) {
        let x = getValue((reverse ? a : b).cells[column_index]);
        let y = getValue((reverse ? b : a).cells[column_index]);
        return isNaN(x - y) ? x.localeCompare(y) : x - y;
      });
      let clone_tbody = org_tbody.cloneNode();
      while (rows.length) {
        clone_tbody.appendChild(rows.splice(0, 1)[0]);
      }
      table.replaceChild(clone_tbody, org_tbody);
    }
  } catch (error) { }
});

const input = document.querySelector("input");

input.addEventListener("change", updateValue);

function updateValue(e) {
  console.log(e.target.value);
  getSelectedValue(e.target.value);
}

//RadarChart call from allStats script tag
let chart_playerSelStat = [];
let chart_playerSelStatFiltered = [];
let chart_avgStat = [];
let chart_labels = [];
let newValueTd = "";
let valueOfPlayerOV = [];
// Define a JavaScript function inside a <script> tag
function updateRadarChart(avg_league_stat_def, avg_league_stat_fwd) {
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

//dragable functions

document.addEventListener('DOMContentLoaded', (event) => {

  function handleDragStart(e) {
    this.style.opacity = '0.4';
  
    dragSrcEl = this;
  
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }
  
  function handleDrop(e) {
    e.stopPropagation();
  
    if (dragSrcEl !== this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }
  
    return false;
  }
    

  function handleDragEnd(e) {
    this.style.opacity = '1';

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

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
});
