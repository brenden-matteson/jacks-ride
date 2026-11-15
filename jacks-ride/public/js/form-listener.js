const form = document.getElementById('post_offer_form');

form.addEventListener('change', (event) => {
  // Check if the changed element is a radio button in the 'contact' group
  if (event.target.matches('input[type="radio"][name="ride_type"]')) {
    console.log('Selected value:', event.target.value);

    const vehicle_section = document.getElementById("select_vehicle");
    const vehicle = document.getElementById("vehicle");
    const payment_method = document.getElementById("payment_method");
    const amount_requested = document.getElementById("amount_requested");
    const seats_available_section = document.getElementById("seats_available_section");
    const seats_available = document.getElementById("seats_available");
    const yes_pet_button = document.getElementById("pets-ok");

    if (event.target.value == "request") 
    {
        vehicle_section.style.display = "none";
        vehicle.required = false;
        vehicle.checked = false;
        payment_method.textContent = "Choose available payment method(s)";
        amount_requested.placeholder = "Enter the amount you are willing to contribute ($)";
        seats_available_section.style.display = "none";
        seats_available.required = false;
        yes_pet_button.labels[0].textContent = "Bringing a pet";
    }   
    else
    {
        vehicle_section.style.display = "block";
        vehicle.required = true;
        payment_method.textContent = "Choose requested payment method(s)";
        amount_requested.placeholder = "Enter requested amount ($)";
        seats_available_section.style.display = "block";
        seats_available.required = true;
        yes_pet_button.labels[0].textContent = "Pets OK";
    }
  }
});