
function PropertyVisitRequest(property) {
    // Construct the query parameters
    const queryParams = new URLSearchParams(property).toString();
    fetch(`http://localhost:3306/requestPropertyVisit?${queryParams}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Problem with request');
            }
            return response.text();
        })
        .then(result => {
            alert('Email sent successfully!');
        })
        .catch(error => {
            console.error('Error sending email:', error);
            alert('Error sending email. Please try again.');
        });
}

function submitVisitRequest() {
    const propertyID = document.getElementById('selectedPropertyID').value;
    const visitDate = document.getElementById('visitDate').value;
    const message = document.getElementById('additionalMessage').value;
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const buyerID = document.getElementById('buyerProfileSelect').value;
    const brokerID = document.getElementById('selectedBrokerID').value;


    const queryParams = new URLSearchParams({
        BuyerID: buyerID,
        BrokerID: brokerID,
        PropertyID: propertyID,
        RequestDate: today,
        VisitDate: visitDate,
        Status: 'Pending', // Or any default status
        Message: message
    });

    fetch(`http://localhost:3306/requestVisit?${queryParams.toString()}`)
        .then(response => response.json())
        .then(result => {
            alert(result.message);
            closeVisitRequestForm(); // Close the form after submission
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error sending request. Please try again.');
        });
}

function requestPropertyVisit(propertyID, brokerID) {
    document.getElementById('selectedPropertyID').value = propertyID;
    document.getElementById('selectedBrokerID').value = brokerID;
    document.getElementById('visitRequestForm').style.display = 'block';

    // Fetch and populate buyer profiles
    const buyerProfileSelect = document.getElementById('buyerProfileSelect');
    fetch(`http://localhost:3306/Buyers`)
        .then(response => response.json())
        .then(profiles => {
            buyerProfileSelect.innerHTML = '<option value="">Select your profile</option>';
            profiles.forEach(profile => {
                buyerProfileSelect.innerHTML += `<option value="${profile.BuyerID}">${profile.FirstName} ${profile.LastName}</option>`;
            });
        })
        .catch(error => console.error('Error:', error));

}



function closeVisitRequestForm() {
    document.getElementById('visitRequestForm').style.display = 'none';
}

function sendOfferRequest(propertyID, brokerID, propertyAddress) {

    document.getElementById('PropertyID').value = propertyID;
    document.getElementById('BrokerID').value = brokerID;
    document.getElementById('propertyAddress').value = propertyAddress;

    document.getElementById('offerRequestForm').style.display = 'block';

    // Fetch and populate buyer profiles

}

function submitOfferRequest() {

    const propertyID = document.getElementById('PropertyID').value;
    const brokerID = document.getElementById('BrokerID').value;
    const buyerName = document.getElementById('buyerName').value;
    const buyerEmail = document.getElementById('buyerEmail').value;
    const propertyAddress = document.getElementById('propertyAddress').value;
    const offerAmount = document.getElementById('offerAmount').value;
    const deedOfSaleDate = document.getElementById('deedOfSaleDate').value;
    const occupancyDate = document.getElementById('occupancyDate').value;
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const message = document.getElementById('Message').value;


    // Construct the query parameters
    const queryParams = new URLSearchParams({
        PropertyID: propertyID,
        BrokerID: brokerID,
        BuyerName: buyerName,
        BuyerEmail: buyerEmail,
        Address: propertyAddress, // Assuming the address is to be fetched from the property details
        OfferAmount: offerAmount,
        DeedOfSaleDate: deedOfSaleDate,
        OccupancyDate: occupancyDate,
        OfferDate: today,
        Message: message
    });

    fetch(`http://localhost:3306/sendOfferRequest?${queryParams.toString()}`)
        .then(response => response.json())
        .then(result => {
            alert(result.message);
            closeOfferRequestForm(); // Close the form after submission
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error sending offer. Please try again.');
        });
}

function closeOfferRequestForm() {
    document.getElementById('offerRequestForm').style.display = 'none';
}
function ssendOfferRequest(propertyID, brokerID) {
    // Collect offer details from the user
    const buyerName = prompt("Enter your name:");
    const buyerEmail = prompt("Enter your email:");
    const offerAmount = prompt("Enter your offer amount:");
    const deedOfSaleDate = prompt("Enter the deed of sale date (YYYY-MM-DD):");
    const occupancyDate = prompt("Enter the occupancy date (YYYY-MM-DD):");
    const offerDate = new Date().toISOString().split('T')[0]; // Current date
    const message = prompt("Enter any additional notes or messages:");

    // Construct the query parameters
    const queryParams = new URLSearchParams({
        PropertyID: propertyID,
        BrokerID: brokerID,
        BuyerName: buyerName,
        BuyerEmail: buyerEmail,
        Address: '', // Assuming the address is to be fetched from the property details
        OfferAmount: offerAmount,
        DeedOfSaleDate: deedOfSaleDate,
        OccupancyDate: occupancyDate,
        OfferDate: offerDate,
        Message: message
    });

    // Send the data to the server
    fetch(`http://localhost:3306/sendOfferRequest?${queryParams.toString()}`)
        .then(response => response.json())
        .then(result => {
            if(result.success) {
                alert('Offer request sent successfully!');
            } else {
                alert('Error sending offer request. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error sending offer request:', error);
            alert('Error sending offer request. Please try again.');
        });
}


function sendOffer(property) {
    const offerAmount = prompt("Please enter your offer amount (in CAD):");
    if (offerAmount) {
        // Construct the query parameters, including the offer amount
        const queryParams = new URLSearchParams({ ...property, OfferAmount: offerAmount }).toString();
        fetch(`http://localhost:3306/sendOffer?${queryParams}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Problem with request');
                }
                return response.text();
            })
            .then(result => {
                alert('Offer email sent successfully!');
            })
            .catch(error => {
                console.error('Error sending offer email:', error);
                alert('Error sending offer email. Please try again.');
            });
    }
}


document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();


    const Address = document.getElementById('Address').value;

    const Country = document.getElementById('Country').value;
    const City = document.getElementById('City').value;
    const ListingPrice = document.getElementById('ListingPrice').value;
    const Bedrooms = document.getElementById('Bedrooms').value;
    const Bathrooms = document.getElementById('Bathrooms').value;
    const Description = document.getElementById('Description').value;
    const PropertyType = document.getElementById('PropertyType').value;
    const Status = document.getElementById('Status').value;

    const queryParams = new URLSearchParams({
        Address,
        Country,
        City,
        ListingPrice,
        Bedrooms,
        Bathrooms,
        Description,
        PropertyType,
        Status
    });

    fetch(`http://localhost:3306/searchProperty?${queryParams.toString()}`)
        .then(response => response.json())

        .then(properties => {
            const propertyList = document.getElementById('propertyList');
            propertyList.innerHTML = properties.map(property => `
                <li>
                    Address: ${property.Address} <br>
                    Country: ${property.Country} <br>
                    City: ${property.City} <br>
                    Price: $${property.ListingPrice} <br>
                    Bedrooms: ${property.Bedrooms} <br>
                    Bathrooms: ${property.Bathrooms} <br>
                    Description: ${property.Description} <br>
                    Broker in charge: ${property.BrokerID} <br>
                    Type: ${property.PropertyType} <br>
                    Status: ${property.Status} <br>   
                    
<!--            <button onclick='requestPropertyVisit(${JSON.stringify(property)})'>Request Visit</button>-->
            <button onclick='requestPropertyVisit(${property.PropertyID}, ${property.BrokerID}); <!--PropertyVisitRequest(${JSON.stringify(property)}) -->'>Request Visit</button>
<!--            <button onclick='sendOffer(${JSON.stringify(property)})'>Send Offer</button>-->
            <button onclick='sendOfferRequest(${property.PropertyID}, ${property.BrokerID}, "${property.Address}");  <!--sendOffer(${JSON.stringify(property)})-->'>Send Offer Request</button>

               </li>
             
            `).join('');
        })

});
