var cmcChart = new Chart(document.getElementById("cmcChart"), {
    type: 'bar',
    data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'],
        datasets: [{
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#FFFFFF'
        }]
    },
    options: {
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'CMC'
                },
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: '# of Cards'
                },
                ticks: {
                    stepSize: 1,
                    min: 0
                }
            }]
        }
    }
})

export { cmcChart }