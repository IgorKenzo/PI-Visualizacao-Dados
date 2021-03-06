var myChart;
var myChart2;
var myChart3;
let object;
let object2;
let object3;
// var barColors = ["#FF6800", "#424242","#515151","#606060","#6f6f6f","#7E7E7E", "#8D8D8D"];
var barColors = ["#61de2a", "#424242","#515151","#606060","#6f6f6f","#7E7E7E", "#8D8D8D"];

document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById("escolher_genero").addEventListener("change", (event) => {changeChart1(parseInt(event.target.value))});
  document.getElementById("escolher_genero").addEventListener("change", (event) => {changeChart3(parseInt(event.target.value))});
  document.getElementById("escolher_plat").addEventListener("change", (event) => {changeChart2(parseInt(event.target.value))});

  let httpRequest = new XMLHttpRequest(); // asynchronous request
  httpRequest.open("GET", "../data/result_engines_x_genre.json", true);
  httpRequest.send();
  httpRequest.addEventListener("readystatechange", function() {
    if (this.readyState === this.DONE) {
      // when the request has completed
      object = JSON.parse(this.response);

      changeChart1(0)
    }
  
    var newSelect = document.getElementById("escolher_genero");

    for(element in object) {
      var opt = document.createElement("option");
      opt.value = element;
      opt.innerHTML = object[element].genre; // whatever property it has

      // then append it to the select element
      newSelect.appendChild(opt);      
    }
  });

  let httpRequest2 = new XMLHttpRequest(); // asynchronous request
  httpRequest2.open("GET", "../data/result_genres_x_platform.json", true);
  httpRequest2.send();
  httpRequest2.addEventListener("readystatechange", function() {
    if (this.readyState === this.DONE) {
      // when the request has completed
      object2 = JSON.parse(this.response);

      changeChart2(0)
    }
  
    var newSelect = document.getElementById("escolher_plat");

    for(element in object2) {
      var opt = document.createElement("option");
      opt.value = element;
      opt.innerHTML = object2[element].platform; // whatever property it has

      // then append it to the select element
      newSelect.appendChild(opt);      
    }
  });

  let httpRequest3 = new XMLHttpRequest(); // asynchronous request
  httpRequest3.open("GET", "../data/result_platform_by_genre.json", true);
  httpRequest3.send();
  httpRequest3.addEventListener("readystatechange", function() {
    if (this.readyState === this.DONE) {
      // when the request has completed
      object3 = JSON.parse(this.response);

      changeChart3(0)
    }
  });

  Chart.defaults.global.defaultFontColor = "#e0e0e0";

});

function changeChart1(index) {
  if (myChart) {
    myChart.destroy()
  }
  
  myChart = new Chart("myChart", {
    type: "bar",
    data: {
      labels: object[index].engines.map(x => x.engine_name),
      datasets: [{
        backgroundColor: barColors,
        data: object[index].engines.map(x => x.tot )
      }]
    },
    options: {
      // legend: {display: true},
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
        text: object[index].genre
      },
      scales: {
        xAxes: [{
          display: true,
          gridLines: {
            display: true,
            color: "#595959"
          }
        }],
        yAxes: [{
          display: true,
          gridLines: {
            display: true,
            color: "#595959"
          }
        }]
      },
      legend: {
        labels: {
          filter: function(item, chart) {

          }
        }
      }
    }
  });
}

function changeChart2(index) {
  if (myChart2) {
    myChart2.destroy()
  }
  
  myChart2 = new Chart("myChart2", {
    type: "bar",
    data: {
      labels: object2[index].genres.map(x => x.genre_name),
      datasets: [{
        backgroundColor: barColors,
        data: object2[index].genres.map(x => x.tot )
      }]
    },
    options: {
      // legend: {display: true},
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
        text: object2[index].platform
      },
      scales: {
        xAxes: [{
          display: true,
          gridLines: {
            display: true,
            color: "#595959"
          }
        }],
        yAxes: [{
          display: true,
          gridLines: {
            display: true,
            color: "#595959"
          }
        }]
      },
      legend: {
        labels: {
          filter: function(item, chart) {

          }
        }
      }
    }
  });
}

function changeChart3(index) {
  if (myChart3) {
    myChart3.destroy()
  }
  
  myChart3 = new Chart("myChart3", {
    type: "bar",
    data: {
      labels: object3[index].platforms.map(x => x.platform_name),
      datasets: [{
        backgroundColor: barColors,
        data: object3[index].platforms.map(x => x.tot )
      }]
    },
    options: {
      // legend: {display: true},
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
      },
      scales: {
        xAxes: [{
          display: true,
          gridLines: {
            display: true,
            color: "#595959"
          }
        }],
        yAxes: [{
          display: true,
          gridLines: {
            display: true,
            color: "#595959"
          }
        }]
      },
      legend: {
        labels: {
          filter: function(item, chart) {

          }
        }
      }
    }
  });
}

function teste2(index) {
  let httpRequest = new XMLHttpRequest(); // asynchronous request
  httpRequest.open("GET", "./data/result_engines_x_genre.json", true);
  httpRequest.send();
  httpRequest.addEventListener("readystatechange", function() {
      if (this.readyState === this.DONE) {
          // when the request has completed
          object = JSON.parse(this.response);
          
          // object.forEach(genre => {
              
          // });

          if (myChart) {
            myChart.destroy()
          }
          
          myChart = new Chart("myChart", {
              type: "bar",
              data: {
                labels: object[index].engines.map(x => x.engine_name),
                datasets: [{
                  backgroundColor: barColors,
                  data: object[index].engines.map(x => x.tot )
                }]
              },
              options: {
                  legend: {display: true},
                  title: {
                  display: true,
                  text: object[index].genre
                  }
              }
            });
      }
  });
}

// new Chart("myChart", {
//   type: "bar",
//   data: {
//     labels: xValues,
//     datasets: [{
//       backgroundColor: barColors,
//       data: yValues
//     }]
//   },
//   options: {}
// });