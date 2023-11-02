
document.addEventListener("DOMContentLoaded", function() {
    fetchProperties();
});


//function to display the list of Properties in the system
function fetchProperties() {
    fetch('http://localhost:3306/Properties')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(properties => {
            const propertyList = document.getElementById('propertyList');
            propertyList.innerHTML = properties.map(property => `
                <li>
                    Broker in charge: ${property.BrokerID} <br>
                    Address: ${property.Address} <br>
                    Country: ${property.Country} <br>
                    City: ${property.City} <br>
                     <button onClick="openEditForm('${property.PropertyID}', '${property.Address}', '${property.Country}', '${property.City}', '${property.ListingPrice}', '${property.Bedrooms}', '${property.Bathrooms}', '${property.Description}', '${property.PropertyType}', '${property.Status}')">Edit</button>
                    <button data-id="${property.PropertyID}" class="delete-property">Delete</button>

                </li>
            `).join('');
        })

        .catch(error => {
            console.log('There was a problem with the fetch operation:', error.message);
        });
}

const propertyFormContainer = document.getElementById('propertyFormContainer');
const showPropertyFormBtn = document.getElementById('showPropertyFormBtn');
const cancelPropertyFormBtn = document.getElementById('cancelPropertyFormBtn');

showPropertyFormBtn.addEventListener('click', function() {
    propertyFormContainer.style.display = 'block';
});

cancelPropertyFormBtn.addEventListener('click', function() {
    propertyFormContainer.style.display = 'none';
});


document.getElementById('propertyForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents the form from submitting the traditional way

    const Address = document.getElementById('Address').value;
    const Country = document.getElementById('Country').value;
    const City = document.getElementById('City').value;
    const ListingPrice = document.getElementById('ListingPrice').value;
    const Bedrooms = document.getElementById('Bedrooms').value;
    const Bathrooms = document.getElementById('Bathrooms').value;
    const PropertyType = document.getElementById('PropertyType').value;
    const Description = document.getElementById('Description').value;
    const Status = document.getElementById('Status').value;



    fetch('http://localhost:3306/addProperty', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Address: Address,
            Country: Country,
            City: City,
            ListingPrice: ListingPrice,
            Bedrooms: Bedrooms,
            Bathrooms: Bathrooms,
            PropertyType: PropertyType,
            Description: Description,
            Status: Status
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Property added successfully!');
                fetchProperties(); // Refresh the brokers list
            } else {
                alert('Error adding broker. Please try again.');
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
});

document.addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("delete-property")) {
        const propertyID = event.target.getAttribute("data-id");
        deleteProperty(propertyID);
    }
});

function deleteProperty(id) {
    const confirmation = window.confirm("Are you sure you want to delete this property?");
    if (!confirmation) {
        return; // if user clicks "Cancel", do not proceed
    }

    fetch(`http://localhost:3306/Properties/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Successfully deleted the broker, now refresh the list
            fetchProperties();
        })
        .catch(error => {
            console.log('There was a problem with the delete operation:', error.message);
        });
}


function openEditForm(id, address, country, city, listingPrice, bedrooms, bathrooms, descriptions, propertyType, status) {
    const editForm = document.getElementById('editPropertyForm');
    editForm.style.display = 'block'; // show the form

    // Populate the form with the broker's current data
    document.getElementById('editPropertyId').value = id;
    document.getElementById('editPropertyAddress').value = address;
    document.getElementById('editPropertyCountry').value = country;
    document.getElementById('editPropertyCity').value = city;
    document.getElementById('editPropertyListingPrice').value = listingPrice;
    document.getElementById('editPropertyBedrooms').value = bedrooms;
    document.getElementById('editPropertyBathrooms').value = bathrooms;
    document.getElementById('editPropertyDescription').value = descriptions;
    document.getElementById('editPropertyType').value = propertyType;
    document.getElementById('editPropertyStatus').value = status;

}



function closeEditForm() {
    document.getElementById('editPropertyForm').style.display = 'none';
}
