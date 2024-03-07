var chart_playerStat = []
var chart_avgFwdOV = []


//1er graph
const xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
const xArray = ["Italy", "France", "Spain", "USA", "Argentina"];
const yArray = [55, 49, 44, 24, 15];
const layout = { title: "World Wide Wine Production" };
const data = [{ labels: xArray, values: yArray, type: "pie" }];
Plotly.newPlot("myPlot", data, layout);
//2e graph
new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      data: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478],
      borderColor: "red",
      fill: false
    }, {
      data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
      borderColor: "green",
      fill: false
    }, {
      data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
      borderColor: "blue",
      fill: false
    }]
  },
  options: {
    legend: { display: false }
  }
});
//3e graph
new Chart("programmingChart", {
  type: 'polarArea',
  data: {
    labels: ["CK", "FG", "DI", "SK", "ST", "EN", "DU", "PH", "FO", "PA", "SC", "DF", "EX", "LD"],
    datasets: [{
      data: [80, 55, 75, 88, 77, 80, 80, 85, 70, 88, 90, 75, 99, 99],
      backgroundColor: [getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor()],
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Repartition des stats de joueurs'
    }
  }
});

//3e graph
Highcharts.chart('container', {
  chart: {
    styledMode: true
  },
  title: {
    text: 'Mobile vendor market share, 2021',
    align: 'left'
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  series: [{
    type: 'pie',
    allowPointSelect: true,
    keys: ['name', 'y', 'selected', 'sliced'],
    data: [
      ['Samsung', 27.79, true, true],
      ['Apple', 27.34, false],
      ['Xiaomi', 10.87, false],
      ['Huawei', 8.48, false],
      ['Oppo', 5.38, false],
      ['Vivo', 4.17, false],
      ['Realme', 2.57, false],
      ['Unknown', 2.45, false],
      ['Motorola', 2.22, false],
      ['LG', 1.53, false],
      ['Other', 7.2, false]
    ],
    showInLegend: true
  }]
});
//4e graph
var playerChart = new Chart("radarChart", {
  type: 'radar',
  data: {
    labels: ['CK', 'FG', 'DI', 'SK', 'ST', 'EN', 'DU', 'PH', 'FO', 'PA', 'SC', 'DF', 'PS', 'EX', 'LD', 'PO'],
    datasets: [{
      label: 'Stats joueur',
      data: chart_playerStat,
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }, {
      label: 'Moyenne de la ligue',
      data: chart_avgFwdOV,
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }]
  },
  options: {
    elements: {
      line: {
        borderWidth: 3
      }
    }
  }
});

//get selected value from playerName scoll
function getSelectedValue() {
  // Make a POST AJAX call
  // Get the select element
  var selectElement = document.getElementById('playerSelected');

  // Get the selected option
  var selectedOption = selectElement.options[selectElement.selectedIndex];

  // Get the value of the selected option
  var selectedValue = selectedOption.value;
  $(document).ready(function () {
    var value = selectedValue;
    alert("Selected value: " + value);

    $.ajax({
      url: '/allStats',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(value),
      success: function (response) {
        $('#result').text('Processed value: ' + value);

        //console.log('Server Response:', value);
        // Handle success response if needed
      },
      error: function (xhr, status, error) {
        //console.error('Error:', error);
        // Handle error response if needed
      }
    });
  });

  // Display the selected value (for demonstration)
}
// Function to generate a random hexadecimal color code
function getRandomColor() {
  // Generate a random number between 0 and 16777215 (hexadecimal FFFFFF)
  var color = Math.floor(Math.random() * 16777215).toString(16);
  // Pad the color code with zeros if necessary to ensure it has 6 digits
  while (color.length < 6) {
    color = '0' + color;
  }
  // Return the hexadecimal color code
  return '#' + color;
}

//js for modifying data
function modifyVariable() {
  var newValue = document.getElementById("newVariableValue").value;
  document.getElementById("pythonVariable").innerText = newValue;
}

//table sort
document.addEventListener('click', function (e) {
  try {
    function findElementRecursive(element, tag) {
      return element.nodeName === tag ? element :
        findElementRecursive(element.parentNode, tag)
    }
    var descending_th_class = ' dir-d '
    var ascending_th_class = ' dir-u '
    var ascending_table_sort_class = 'asc'
    var regex_dir = / dir-(u|d) /
    var regex_table = /\bsortable\b/
    var alt_sort = e.shiftKey || e.altKey
    var element = findElementRecursive(e.target, 'TH')
    var tr = findElementRecursive(element, 'TR')
    var table = findElementRecursive(tr, 'TABLE')
    function reClassify(element, dir) {
      element.className = element.className.replace(regex_dir, '') + dir
    }
    function getValue(element) {
      return (
        (alt_sort && element.getAttribute('data-sort-alt')) ||
        element.getAttribute('data-sort') || element.innerText
      )
    }
    if (regex_table.test(table.className)) {
      var column_index
      var nodes = tr.cells
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] === element) {
          column_index = element.getAttribute('data-sort-col') || i
        } else {
          reClassify(nodes[i], '')
        }
      }
      var dir = descending_th_class
      if (
        element.className.indexOf(descending_th_class) !== -1 ||
        (table.className.indexOf(ascending_table_sort_class) !== -1 &&
          element.className.indexOf(ascending_th_class) == -1)
      ) {
        dir = ascending_th_class
      }
      reClassify(element, dir)
      var org_tbody = table.tBodies[0]
      var rows = [].slice.call(org_tbody.rows, 0)
      var reverse = dir === ascending_th_class
      rows.sort(function (a, b) {
        var x = getValue((reverse ? a : b).cells[column_index])
        var y = getValue((reverse ? b : a).cells[column_index])
        return isNaN(x - y) ? x.localeCompare(y) : x - y
      })
      var clone_tbody = org_tbody.cloneNode()
      while (rows.length) {
        clone_tbody.appendChild(rows.splice(0, 1)[0])
      }
      table.replaceChild(clone_tbody, org_tbody)
    }
  } catch (error) {
  }
});
