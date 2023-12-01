document.addEventListener('DOMContentLoaded', function () {
  fetchBrokers()
  fetchProperties()
})

// function to display the list of Brokers in the system
function fetchBrokers () {
  fetch('http://localhost:3306/Brokers')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })

    .then(brokers => {
      const brokerList = document.getElementById('brokerList')
      brokerList.innerHTML = brokers.map(broker => `
        <li>
            Name: ${broker.FirstName} ${broker.LastName} <br>
            BrokerID: #${broker.BrokerID} <br>
            Email: ${broker.Email} <br>
            Phone Number: ${broker.PhoneNumber} <br>
            <button onClick="openEditForm('${broker.BrokerID}', '${broker.FirstName}', '${broker.LastName}', '${broker.Email}', '${broker.PhoneNumber}')">Edit</button>
            <button data-id="${broker.BrokerID}" class="delete-broker">Delete</button>
        </li>
    `).join('')
    })
}

// function to display the list of Properties in the system
function fetchProperties () {
  fetch('http://localhost:3306/Properties')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(properties => {
      const propertyList = document.getElementById('propertyList')
      propertyList.innerHTML = properties.map(property => `
                <li>
                    Broker in charge: ${property.BrokerID} <br>
                    Address: ${property.Address} <br>
                    Country: ${property.Country} <br>
                    City: ${property.City} <br>
                                       <button data-id="${property.PropertyID}" class="delete-property">Delete</button>

                </li>
            `).join('')
    })

    .catch(error => {
      console.log('There was a problem with the fetch operation:', error.message)
    })
}

const brokerFormContainer = document.getElementById('brokerFormContainer')
const showBrokerFormBtn = document.getElementById('showBrokerFormBtn')
const cancelBrokerFormBtn = document.getElementById('cancelBrokerFormBtn')

showBrokerFormBtn.addEventListener('click', function () {
  brokerFormContainer.style.display = 'block'
})

cancelBrokerFormBtn.addEventListener('click', function () {
  brokerFormContainer.style.display = 'none'
})

// function to add new Broker to database
document.getElementById('brokerForm').addEventListener('submit', function (e) {
  e.preventDefault() // Prevents the form from submitting the traditional way

  const FirstName = document.getElementById('brokerFirstName').value
  const LastName = document.getElementById('brokerLastName').value
  const Email = document.getElementById('brokerEmail').value
  const PhoneNumber = document.getElementById('brokerPhoneNumber').value

  fetch('http://localhost:3306/addBroker', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      FirstName,
      LastName,
      Email,
      PhoneNumber
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Broker added successfully!')
        fetchBrokers() // Refresh the brokers list
      } else {
        alert('Error adding broker. Please try again.')
      }
    })
    .catch(error => {
      console.log('Error:', error)
    })
})

document.addEventListener('click', function (event) {
  if (event.target && event.target.classList.contains('delete-broker')) {
    const brokerID = event.target.getAttribute('data-id')
    deleteBroker(brokerID)
  }
})

function deleteBroker (id) {
  const confirmation = window.confirm('Are you sure you want to delete this broker?')
  if (!confirmation) {
    return // if user clicks "Cancel", do not proceed
  }

  fetch(`http://localhost:3306/Brokers/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // Successfully deleted the broker, now refresh the list
      fetchBrokers()
    })
    .catch(error => {
      console.log('There was a problem with the delete operation:', error.message)
    })
}

function openEditForm (id, firstName, lastName, email, phoneNumber) {
  const editForm = document.getElementById('editBrokerForm')
  editForm.style.display = 'block' // show the form

  // Populate the form with the broker's current data
  document.getElementById('editBrokerId').value = id
  document.getElementById('editBrokerFirstName').value = firstName
  document.getElementById('editBrokerLastName').value = lastName
  document.getElementById('editBrokerEmail').value = email
  document.getElementById('editBrokerPhoneNumber').value = phoneNumber
}

function submitEditForm () {
  const id = parseInt(document.getElementById('editBrokerId').value, 10)
  const FirstName = document.getElementById('editBrokerFirstName').value
  const LastName = document.getElementById('editBrokerLastName').value
  const Email = document.getElementById('editBrokerEmail').value
  const PhoneNumber = document.getElementById('editBrokerPhoneNumber').value

  // Basic validation
  if (!id || !FirstName || !LastName || !Email || !PhoneNumber) {
    alert('All fields are required.')
    return
  }

  // Send the updated data to the server
  fetch(`http://localhost:3306/Brokers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      FirstName,
      LastName,
      Email,
      PhoneNumber
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      if (data.success) {
        fetchBrokers() // Refresh the list
        closeEditForm()
      } else {
        alert('Error updating broker.')
      }
    })
    .catch(error => {
      alert('There was a problem with the request: ' + error.message)
    })
}

function closeEditForm () {
  document.getElementById('editBrokerForm').style.display = 'none'
}
