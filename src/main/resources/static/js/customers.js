let selectedCustomers = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Customers module loaded');
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterCustomers();
        }
    });

    // Checkbox selection
    document.querySelectorAll('.customer-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedCustomers();
            updateRowSelection(this);
        });
    });
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.customer-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
        updateRowSelection(checkbox);
    });

    updateSelectedCustomers();
}

function updateRowSelection(checkbox) {
    const row = checkbox.closest('tr');
    if (checkbox.checked) {
        row.classList.add('selected-row');
    } else {
        row.classList.remove('selected-row');
    }
}

function updateSelectedCustomers() {
    selectedCustomers = [];
    document.querySelectorAll('.customer-checkbox:checked').forEach(checkbox => {
        selectedCustomers.push(checkbox.value);
    });

    // Update select all checkbox state
    const allCheckboxes = document.querySelectorAll('.customer-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.customer-checkbox:checked');
    const selectAll = document.getElementById('selectAll');

    if (checkedCheckboxes.length === 0) {
        selectAll.indeterminate = false;
        selectAll.checked = false;
    } else if (checkedCheckboxes.length === allCheckboxes.length) {
        selectAll.indeterminate = false;
        selectAll.checked = true;
    } else {
        selectAll.indeterminate = true;
        selectAll.checked = false;
    }
}

function clearFilters() {
    // Clear all filter inputs
    document.getElementById('searchInput').value = '';

    // Show all rows
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.display = '';
    });
}

function filterCustomers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const firstName = row.cells[2].textContent.toLowerCase();
        const lastName = row.cells[3].textContent.toLowerCase();
        const dni = row.cells[4].textContent;

        const matchesSearch = firstName.includes(searchTerm) ||
            lastName.includes(searchTerm) ||
            dni.includes(searchTerm);

        row.style.display = matchesSearch ? '' : 'none';
    });
}

function openAddModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-person me-2"></i>Agregar Cliente';
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';
}

function openEditModal() {
    if (selectedCustomers.length === 0) {
        alert('Por favor seleccione un cliente para editar');
        return;
    }

    if (selectedCustomers.length > 1) {
        alert('Por favor seleccione solo un cliente para editar');
        return;
    }

    editCustomer(selectedCustomers[0]);
}

async function editCustomer(customerId) {
    try {
        // Set modal title
        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Cliente';
        document.getElementById('customerForm').reset();
        document.getElementById('customerId').value = customerId;

        // Since we can't use API (returns 500), we need to get data from the table row
        const rows = document.querySelectorAll('tbody tr');
        let customerData = null;

        rows.forEach(row => {
            const idCell = row.cells[1].textContent;
            if (idCell === customerId.toString()) {
                customerData = {
                    id: customerId,
                    firstName: row.cells[2].textContent,
                    lastName: row.cells[3].textContent,
                    dni: row.cells[4].textContent
                };
            }
        });

        if (customerData) {
            document.getElementById('firstName').value = customerData.firstName;
            document.getElementById('lastName').value = customerData.lastName;
            document.getElementById('dni').value = customerData.dni;

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('customerModal'));
            modal.show();
        } else {
            // Fallback to redirect if data not found
            window.location.href = `/customers/edit/${customerId}`;
        }
    } catch (error) {
        console.error('Error loading customer:', error);
        alert('Error al cargar los datos del cliente');
    }
}

function validateDNI(dni) {
    // Validate DNI format (8 digits)
    const dniPattern = /^[0-9]{8}$/;
    return dniPattern.test(dni);
}

async function saveCustomer() {
    const form = document.getElementById('customerForm');

    // Check if form is valid
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);

    const customerData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        dni: formData.get('dni')
    };

    // Validate DNI
    if (!validateDNI(customerData.dni)) {
        alert('El DNI debe tener 8 dígitos numéricos');
        return;
    }

    // Check if fields are empty
    if (!customerData.firstName.trim() || !customerData.lastName.trim() || !customerData.dni.trim()) {
        alert('Por favor, complete todos los campos requeridos');
        return;
    }

    try {
        const customerId = document.getElementById('customerId').value;

        if (customerId) {
            // Update existing customer - use form submission
            const formElement = document.createElement('form');
            formElement.method = 'POST';
            formElement.action = `/customers/update/${customerId}`;

            // Add form data as hidden fields
            Object.keys(customerData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = customerData[key];
                formElement.appendChild(input);
            });

            document.body.appendChild(formElement);
            formElement.submit();
        } else {
            // Create new customer - use form submission
            const formElement = document.createElement('form');
            formElement.method = 'POST';
            formElement.action = '/customers/save';

            // Add form data as hidden fields
            Object.keys(customerData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = customerData[key];
                formElement.appendChild(input);
            });

            document.body.appendChild(formElement);
            formElement.submit();
        }

    } catch (error) {
        console.error('Error saving customer:', error);
        alert('Error al guardar el cliente');
    }
}

function deleteCustomer() {
    if (selectedCustomers.length === 0) {
        alert('Por favor seleccione al menos un cliente para eliminar');
        return;
    }

    if (confirm(`¿Está seguro de que desea eliminar ${selectedCustomers.length} cliente(s)?`)) {
        selectedCustomers.forEach(async (customerId) => {
            try {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/customers/delete/${customerId}`;
                document.body.appendChild(form);
                form.submit();
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        });
    }
}

async function deleteCustomerById(customerId) {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
        try {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/customers/delete/${customerId}`;
            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Error al eliminar el cliente');
        }
    }
}

async function viewCustomer(customerId) {
    try {
        const response = await fetch(`/api/customers/${customerId}`);
        const customer = await response.json();

        // Load customer sales
        const salesResponse = await fetch(`/api/sales/customer/${customerId}`);
        const sales = await salesResponse.json();

        displayCustomerDetails(customer, sales);

        const modal = new bootstrap.Modal(document.getElementById('viewCustomerModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading customer details:', error);
        alert('Error al cargar los detalles del cliente');
    }
}

function displayCustomerDetails(customer, sales) {
    const content = document.getElementById('customerDetails');

    const totalSpent = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const lastPurchase = sales.length > 0 ? new Date(Math.max(...sales.map(s => new Date(s.saleDate)))) : null;

    const detailsHtml = `
        <div class="row">
            <div class="col-md-6">
                <h6>Información Personal</h6>
                <p><strong>ID:</strong> ${customer.id}</p>
                <p><strong>Nombre:</strong> ${customer.firstName}</p>
                <p><strong>Apellido:</strong> ${customer.lastName}</p>
                <p><strong>DNI:</strong> ${customer.dni}</p>
            </div>
            <div class="col-md-6">
                <h6>Estadísticas de Compras</h6>
                <p><strong>Total de compras:</strong> ${sales.length}</p>
                <p><strong>Total gastado:</strong> $${totalSpent.toFixed(2)}</p>
                <p><strong>Promedio por compra:</strong> $${sales.length > 0 ? (totalSpent / sales.length).toFixed(2) : '0.00'}</p>
                <p><strong>Última compra:</strong> ${lastPurchase ? lastPurchase.toLocaleDateString() : 'N/A'}</p>
            </div>
        </div>
        
        ${sales.length > 0 ? `
        <div class="row mt-4">
            <div class="col-12">
                <h6>Historial de Compras Recientes</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>ID Venta</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Farmacéutico</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sales.slice(0, 5).map(sale => `
                                <tr>
                                    <td>${sale.id}</td>
                                    <td>${new Date(sale.saleDate).toLocaleDateString()}</td>
                                    <td>$${sale.totalAmount.toFixed(2)}</td>
                                    <td>${sale.pharmacist.firstName} ${sale.pharmacist.lastName}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ${sales.length > 5 ? `<p class="text-muted small">Mostrando las 5 compras más recientes de ${sales.length} totales</p>` : ''}
            </div>
        </div>
        ` : '<div class="row mt-4"><div class="col-12"><p class="text-muted">Este cliente aún no ha realizado compras.</p></div></div>'}
    `;

    content.innerHTML = detailsHtml;
}
