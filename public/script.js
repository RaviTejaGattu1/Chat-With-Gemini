// Load Google Charts
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

// Fetch and draw the chart
async function drawChart() {
    try {
        const response = await fetch('/milk-prices');
        const dataArray = await response.json();

        // Prepare data for Google Charts
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Price ($/Gallon)');
        data.addRows(dataArray);

        // Chart options
        const options = {
            title: 'Average Price: Milk, Fresh, Whole, Fortified (Cost per Gallon/3.8 Liters) in U.S. City Average',
            hAxis: { title: 'Date' },
            vAxis: { title: 'Price ($/Gallon)' },
            legend: { position: 'bottom' },
            curveType: 'function',
            pointSize: 5
        };

        // Draw the chart
        const chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    } catch (error) {
        console.error('Error rendering chart:', error);
    }
}

// Existing chat functionality
document.getElementById('send-btn').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const responseArea = document.getElementById('response');

    if (!prompt) {
        alert('Please enter a prompt');
        return;
    }

    try {
        const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        if (data.error) {
            responseArea.value = 'Error: ' + data.error;
        } else {
            responseArea.value = data.response;
        }
    } catch (error) {
        responseArea.value = 'Error: Failed to connect to the server';
    }
});

document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('prompt').value = '';
    document.getElementById('response').value = '';
});
