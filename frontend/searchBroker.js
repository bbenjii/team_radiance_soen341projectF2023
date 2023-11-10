document.addEventListener('DOMContentLoaded', function() {
    var searchForm = document.getElementById('searchBroker');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        var brokerName = document.getElementById('brokerName').value;
        var brokerInfoDisplay = document.getElementById('brokerInfoDisplay');
        
        
        brokerInfoDisplay.innerHTML = ''; 

        fetch('/search-broker?query=' + encodeURIComponent(brokerName))
            .then(response => response.json())
            .then(data => {
               
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



document.getElementById('searchBroker').addEventListener('submit', function(e) {
    e.preventDefault();


    const FirstName = document.getElementById('firstName').value;
    const LastName = document.getElementById('lastName').value;
    const Email = document.getElementById('email').value;
    const PhoneNumber = document.getElementById('phoneNumber').value;

    const queryParams = new URLSearchParams({
        FirstName,
        LastName,
        Email,
        PhoneNumber,
    });

    fetch(`http://localhost:3306/searchBroker?${queryParams.toString()}`)
        .then(response => response.json())

        .then(brokers => {
            const brokerList = document.getElementById('brokerList');
            brokerList.innerHTML = brokers.map(broker => `
                <li>
                    First Name: ${broker.FirstName} <br>
                    Last Name: ${broker.LastName} <br>
                    Email: ${broker.Email} <br>
                    Phone Number: ${broker.PhoneNumber} <br>
                   
   
               </li>
            `).join('');
        })

});
