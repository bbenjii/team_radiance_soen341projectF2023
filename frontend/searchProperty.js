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
                    Type: ${property.PropertyType} <br>
                    Status: ${property.Status} <br>
                    
                   
                </li>
            `).join('');
        })


});
