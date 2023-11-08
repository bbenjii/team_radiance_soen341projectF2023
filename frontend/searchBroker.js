document.addEventListener('DOMContentLoaded', function() {
    var searchForm = document.getElementById('searchBrokerForm');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting via the browser

        var brokerName = document.getElementById('brokerName').value;
        var brokerInfoDisplay = document.getElementById('brokerInfoDisplay');
        
        // Clear previous results
        brokerInfoDisplay.innerHTML = ''; 

        fetch('/search-broker?query=' + encodeURIComponent(brokerName))
            .then(response => response.json())
            .then(data => {
                // Assuming the server responds with an array of brokers
                if (data.length > 0) {
                    data.forEach(broker => {
                        var brokerDiv = document.createElement('div');
                        brokerDiv.innerHTML = `
                            <h3>${broker.name}</h3>
                            <p>ID: ${broker.id}</p>
                            <p>Email: ${broker.email}</p>
                            <p>Phone: ${broker.phone}</p>
                        `;
                        brokerInfoDisplay.appendChild(brokerDiv);
                    });
                } else {
                    brokerInfoDisplay.innerHTML = '<p>No brokers found.</p>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                brokerInfoDisplay.innerHTML = '<p>Error searching for brokers. Please try again later.</p>';
            });
    });
});

