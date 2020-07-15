var cmcChart = new Chart(document.getElementById("cmcChart"), {
    type: 'bar',
    data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'],
        datasets: [{
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#bfcce0'
        }]
    },
    options: {
        tooltips: {
            callbacks: {
                label: (tooltipItems, data) => {
                    return " CMC " + tooltipItems.xLabel + ' : ' + tooltipItems.yLabel + " Cards";
                },
                title: () => {}
            },
            displayColors: false
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'CMC',
                    fontColor: '#FFFFFF'
                },
                gridLines: {
                    display: false,
                    color: '#000000'
                },
                ticks: {
                    fontColor: '#FFFFFF'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: '# of Cards',
                    fontColor: '#FFFFFF'
                },
                ticks: {
                    stepSize: 1,
                    min: 0,
                    fontColor: '#FFFFFF'
                },
                gridLines: {
                    color: '#000000',
                    zeroLineColor: '#000000'
                }
            }]
        }
    }
})

export { cmcChart }