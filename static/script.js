var chart_playerStat = []
var chart_avgFwdOV = []

var playerChart = new Chart("radarChart", {
  type: 'radar',
  data: {
    labels: ['FO', 'FG', 'CK', 'ST','EN', 'DU', 'SK', 'PH', 'PA', 'SC', 'DF', 'EX', 'LD', 'DI'],
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
function getSelectedValue(selectedValue) {
  /*// Make a POST AJAX call
  // Get the select element
  var selectElement = document.getElementById('playerSelected');

  // Get the selected option
  var selectedOption = selectElement.options[selectElement.selectedIndex];

  // Get the value of the selected option
  var selectedValue = selectedOption.value;*/
  $(document).ready(function () {
    var value = selectedValue;
    //alert("Selected value: " + value);

    $.ajax({
      url: '/updateChart',
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

const input = document.querySelector("input");

input.addEventListener("change", updateValue);

function updateValue(e) {
  console.log(e.target.value)
  getSelectedValue(e.target.value);
}
