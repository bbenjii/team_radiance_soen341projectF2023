document.getElementById('searchBroker').addEventListener('submit', function (e) {
  e.preventDefault()

  const FirstName = document.getElementById('firstName').value
  const LastName = document.getElementById('lastName').value
  const Email = document.getElementById('email').value
  const PhoneNumber = document.getElementById('phoneNumber').value

  const queryParams = new URLSearchParams({
    FirstName,
    LastName,
    Email,
    PhoneNumber
  })

  fetch(`http://localhost:3306/searchBroker?${queryParams.toString()}`)
    .then(response => response.json())

    .then(brokers => {
      const brokerList = document.getElementById('brokerList')
      brokerList.innerHTML = brokers.map(broker => `
                <li>
                    First Name: ${broker.FirstName} <br>
                    Last Name: ${broker.LastName} <br>
                    Email: ${broker.Email} <br>
                    Phone Number: ${broker.PhoneNumber} <br>
                   
   
               </li>
            `).join('')
    })
})
