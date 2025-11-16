let currentStep = 1;
const totalSteps = 3;
let customerAdded = false; // Flag to track if customer was successfully added
let cart = [];
let medicines = [];

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadMedicines();

    // Check for URL parameters (error/success)
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (error) {
        document.getElementById('errorMessage').textContent = decodeURIComponent(error);
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }

    // Check for success parameter
    const success = urlParams.get('success');
    if (success) {
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    }
});

function setupEventListeners() {
    // Customer type selection
    document.querySelectorAll('input[name="customerType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            toggleCustomerSection(this.value);
        });
    });

    // Add customer button
    document.getElementById('addCustomerBtn').addEventListener('click', addNewCustomer);

    // Navigation buttons
    document.getElementById('nextBtn').addEventListener('click', nextStep);
    document.getElementById('prevBtn').addEventListener('click', prevStep);

    // Medicine search
    document.getElementById('searchBtn').addEventListener('click', searchMedicines);
    document.getElementById('medicineSearch').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchMedicines();
        }
    });
}

function toggleCustomerSection(type) {
    const existingSection = document.getElementById('existingCustomerSection');
    const newSection = document.getElementById('newCustomerSection');

    if (type === 'existing') {
        existingSection.style.display = 'block';
        newSection.style.display = 'none';
        const customerIdInput = document.querySelector('select[name="customerId"]');
        if (customerIdInput) customerIdInput.required = true;
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const dniInput = document.getElementById('dni');
        if (firstNameInput) firstNameInput.required = false;
        if (lastNameInput) lastNameInput.required = false;
        if (dniInput) dniInput.required = false;
    } else {
        existingSection.style.display = 'none';
        newSection.style.display = 'block';
        const customerIdInput = document.querySelector('select[name="customerId"]');
        if (customerIdInput) customerIdInput.required = false;
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const dniInput = document.getElementById('dni');
        if (firstNameInput) firstNameInput.required = true;
        if (lastNameInput) lastNameInput.required = true;
        if (dniInput) dniInput.required = true;
    }
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            document.getElementById(`step${currentStep}`).style.display = 'none';
            currentStep++;
            document.getElementById(`step${currentStep}`).style.display = 'block';
            updateProgressBar();
            updateNavigationButtons();
            updateSummary();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).style.display = 'none';
        currentStep--;
        document.getElementById(`step${currentStep}`).style.display = 'block';
        updateProgressBar();
        updateNavigationButtons();
    }
}

function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressBar.style.width = progressPercentage + '%';

    const stepNames = ['Paso 1: Cliente', 'Paso 2: Productos', 'Paso 3: Farmacéutico'];
    progressBar.textContent = stepNames[currentStep - 1];
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.style.display = currentStep > 1 ? 'inline-block' : 'none';
    nextBtn.style.display = currentStep < totalSteps ? 'inline-block' : 'none';
    submitBtn.style.display = currentStep === totalSteps ? 'inline-block' : 'none';
}

function validateCurrentStep() {
    if (currentStep === 1) {
        const customerType = document.querySelector('input[name="customerType"]:checked').value;
        if (customerType === 'existing') {
            const customerId = document.getElementById('customerId').value;
            if (!customerId) {
                alert('Por favor seleccione un cliente');
                return false;
            }
        } else {
            // For new customer, check if customer has been added
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const dni = document.getElementById('dni').value;

            if (firstName || lastName || dni) {
                alert('Por favor agregue el cliente primero usando el botón "Agregar Cliente" o limpie los campos');
                return false;
            }

            alert('Por favor agregue un nuevo cliente o seleccione "Cliente Existente"');
            return false;
        }
    } else if (currentStep === 2) {
        if (cart.length === 0) {
            alert('Por favor agregue al menos un producto');
            return false;
        }
    } else if (currentStep === 3) {
        const pharmacistId = document.getElementById('pharmacistId').value;
        if (!pharmacistId) {
            alert('Por favor seleccione un farmacéutico');
            return false;
        }
    }
    return true;
}

// Initialize medicines from window variable if available
if (window.medicinesData) {
    medicines = window.medicinesData;
}

async function loadMedicines() {
    // Medicines are already loaded from Thymeleaf model
    displayMedicines(medicines);
}

function displayMedicines(medicinesToShow) {
    const container = document.getElementById('medicinesList');
    container.innerHTML = '';

    if (!medicinesToShow || medicinesToShow.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay medicamentos disponibles</p>';
        return;
    }

    medicinesToShow.forEach(medicine => {
        const medicineCard = document.createElement('div');
        medicineCard.className = 'col-md-6 mb-3';
        medicineCard.innerHTML = `
            <div class="card h-100 medicine-card">
                <div class="card-body">
                    <h6 class="card-title">${medicine.name}</h6>
                    <p class="card-text">
                        <small class="text-muted">Precio: $${medicine.price}</small><br>
                        <small class="text-muted">Stock: ${medicine.stock}</small><br>
                        <small class="text-muted">Vence: ${medicine.expirationDate}</small>
                    </p>
                    <div class="input-group">
                        <input type="number" class="form-control" id="qty-${medicine.id}" min="1" max="${medicine.stock}" value="1">
                        <button class="btn btn-primary" onclick="addToCart(${medicine.id})" 
                                ${medicine.stock === 0 ? 'disabled' : ''}>
                            <i class="bi bi-cart-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(medicineCard);
    });
}

function searchMedicines() {
    const searchTerm = document.getElementById('medicineSearch').value.toLowerCase();
    const filteredMedicines = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm)
    );
    displayMedicines(filteredMedicines);
}

function addToCart(medicineId) {
    const medicine = medicines.find(m => m.id === medicineId);
    const quantity = parseInt(document.getElementById(`qty-${medicineId}`).value);

    if (quantity > medicine.stock) {
        alert('No hay suficiente stock disponible');
        return;
    }

    const existingItem = cart.find(item => item.medicineId === medicineId);
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subTotal = existingItem.unitPrice * existingItem.quantity;
    } else {
        cart.push({
            medicineId: medicineId,
            medicine: medicine,
            quantity: quantity,
            unitPrice: medicine.price,
            subTotal: medicine.price * quantity
        });
    }

    updateCart();
}

function addNewCustomer() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dni = document.getElementById('dni').value;

    if (!firstName || !lastName || !dni) {
        alert('Por favor complete todos los datos del cliente');
        return;
    }

    // Create new customer via AJAX
    fetch('/customers/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'firstName': firstName,
            'lastName': lastName,
            'dni': dni
        })
    })
        .then(response => {
            if (response.ok) {
                customerAdded = true;
                alert('Cliente creado exitosamente');
                // Clear the form
                document.getElementById('firstName').value = '';
                document.getElementById('lastName').value = '';
                document.getElementById('dni').value = '';

                // Switch back to existing customer option
                document.getElementById('existingCustomer').checked = true;
                toggleCustomerSection('existing');

                // Reload the page to get the updated customer list
                window.location.reload();
            } else {
                throw new Error('Error al crear el cliente');
            }
        })
        .catch(error => {
            if (!customerAdded) { // Only show error if customer wasn't successfully added
                alert('Error al crear el cliente: ' + error.message);
            }
        });
}

function updateCart() {
    const cartContainer = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-muted">No hay productos seleccionados</p>';
        totalAmount.textContent = '0.00';
        return;
    }

    let total = 0;
    cartContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const subTotal = item.unitPrice * item.quantity;
        total += subTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item mb-3 p-3 border rounded';
        cartItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                    <h6 class="mb-2">${item.medicine.name}</h6>
                    <div class="d-flex align-items-center gap-2">
                        <label class="form-label mb-0">Cantidad:</label>
                        <input type="number" class="form-control form-control-sm" style="width: 80px;" 
                               id="cart-qty-${index}" min="1" max="${item.medicine.stock}" 
                               value="${item.quantity}" onchange="updateCartItemQuantity(${index}, this.value)">
                        <span class="ms-2">x $${item.unitPrice} = <strong>$${subTotal.toFixed(2)}</strong></span>
                    </div>
                </div>
                <div class="text-end">
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    totalAmount.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCartItemQuantity(index, newQuantity) {
    const quantity = parseInt(newQuantity);
    const item = cart[index];

    if (quantity > item.medicine.stock) {
        alert('No hay suficiente stock disponible');
        document.getElementById(`cart-qty-${index}`).value = item.quantity;
        return;
    }

    if (quantity < 1) {
        alert('La cantidad debe ser al menos 1');
        document.getElementById(`cart-qty-${index}`).value = item.quantity;
        return;
    }

    item.quantity = quantity;
    updateCart();
}

function updateSummary() {
    if (currentStep === 3) {
        const customerType = document.querySelector('input[name="customerType"]:checked').value;
        let customerName = '';

        if (customerType === 'existing') {
            const customerId = document.getElementById('customerId').value;
            const customerSelect = document.getElementById('customerId');
            customerName = customerSelect.options[customerSelect.selectedIndex].text;
        } else {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            customerName = `${firstName} ${lastName} (Nuevo)`;
        }

        document.getElementById('summaryCustomer').textContent = customerName;
        document.getElementById('summaryProducts').textContent = cart.length;
        document.getElementById('summaryTotal').textContent = cart.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2);
    }
}

function submitSale() {
    // Get customer and pharmacist values
    const customerType = document.querySelector('input[name="customerType"]:checked').value;
    let customerId = null;

    if (customerType === 'existing') {
        customerId = document.getElementById('customerId').value;
        if (!customerId) {
            alert('Por favor seleccione un cliente existente');
            return;
        }
    } else {
        alert('Por favor agregue el cliente primero usando el botón "Agregar Cliente" y luego seleccione "Cliente Existente"');
        return;
    }

    const pharmacistId = document.getElementById('pharmacistId').value;

    if (!pharmacistId) {
        alert('Por favor seleccione un farmacéutico');
        return;
    }

    // Check if cart is empty
    if (cart.length === 0) {
        alert('Por favor agregue productos al carrito');
        return;
    }

    // Create hidden inputs for customer and pharmacist
    const saleDetailsContainer = document.getElementById('saleDetailsHidden');
    saleDetailsContainer.innerHTML = '';

    // Add customerId
    const customerInput = document.createElement('input');
    customerInput.type = 'hidden';
    customerInput.name = 'customerId';
    customerInput.value = customerId;
    saleDetailsContainer.appendChild(customerInput);

    // Add pharmacistId
    const pharmacistInput = document.createElement('input');
    pharmacistInput.type = 'hidden';
    pharmacistInput.name = 'pharmacistId';
    pharmacistInput.value = pharmacistId;
    saleDetailsContainer.appendChild(pharmacistInput);

    // Add sale details
    cart.forEach((item, index) => {
        const medicineInput = document.createElement('input');
        medicineInput.type = 'hidden';
        medicineInput.name = 'saleDetails[' + index + '].medicineId';
        medicineInput.value = item.medicineId;
        saleDetailsContainer.appendChild(medicineInput);

        const qtyInput = document.createElement('input');
        qtyInput.type = 'hidden';
        qtyInput.name = 'saleDetails[' + index + '].quantity';
        qtyInput.value = item.quantity;
        saleDetailsContainer.appendChild(qtyInput);
    });

    // Submit form
    const form = document.getElementById('saleForm');
    form.submit();
}
