let selectedPharmacists = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Pharmacists module loaded');
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterPharmacists();
        }
    });

    // Checkbox selection
    document.querySelectorAll('.pharmacist-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedPharmacists();
            updateRowSelection(this);
        });
    });
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.pharmacist-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
        updateRowSelection(checkbox);
    });

    updateSelectedPharmacists();
}

function updateRowSelection(checkbox) {
    const row = checkbox.closest('tr');
    if (checkbox.checked) {
        row.classList.add('selected-row');
    } else {
        row.classList.remove('selected-row');
    }
}

function updateSelectedPharmacists() {
    selectedPharmacists = [];
    document.querySelectorAll('.pharmacist-checkbox:checked').forEach(checkbox => {
        selectedPharmacists.push(checkbox.value);
    });

    // Update select all checkbox state
    const allCheckboxes = document.querySelectorAll('.pharmacist-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.pharmacist-checkbox:checked');
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

function filterPharmacists() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const name = row.cells[2].textContent.toLowerCase();
        const lastName = row.cells[3].textContent.toLowerCase();
        const username = row.cells[4].textContent.toLowerCase();

        const matchesSearch = name.includes(searchTerm) ||
            lastName.includes(searchTerm) ||
            username.includes(searchTerm);

        row.style.display = matchesSearch ? '' : 'none';
    });
}

function openAddModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-person-badge me-2"></i>Agregar Farmacéutico';
    document.getElementById('pharmacistForm').reset();
    document.getElementById('pharmacistId').value = '';
    document.getElementById('password').required = true;
}

function openEditModal() {
    if (selectedPharmacists.length === 0) {
        alert('Por favor seleccione un farmacéutico para editar');
        return;
    }

    if (selectedPharmacists.length > 1) {
        alert('Por favor seleccione solo un farmacéutico para editar');
        return;
    }

    editPharmacist(selectedPharmacists[0]);
}

async function editPharmacist(pharmacistId) {
    try {
        // Set modal title
        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Farmacéutico';
        document.getElementById('pharmacistForm').reset();
        document.getElementById('pharmacistId').value = pharmacistId;

        // Since we can't use API (returns 500), we need to get data from the table row
        const rows = document.querySelectorAll('tbody tr');
        let pharmacistData = null;

        rows.forEach(row => {
            const idCell = row.cells[1].textContent;
            if (idCell === pharmacistId.toString()) {
                pharmacistData = {
                    id: pharmacistId,
                    firstName: row.cells[2].textContent,
                    lastName: row.cells[3].textContent,
                    username: row.cells[4].textContent
                };
            }
        });

        if (pharmacistData) {
            document.getElementById('firstName').value = pharmacistData.firstName;
            document.getElementById('lastName').value = pharmacistData.lastName;
            document.getElementById('username').value = pharmacistData.username;
            document.getElementById('password').value = pharmacistData.password;

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('pharmacistModal'));
            modal.show();
        } else {
            // Fallback to redirect if data not found
            window.location.href = `/pharmacists/edit/${pharmacistId}`;
        }
    } catch (error) {
        console.error('Error loading pharmacist:', error);
        alert('Error al cargar los datos del farmacéutico');
    }
}

async function savePharmacist() {
    const form = document.getElementById('pharmacistForm');

    // Check if form is valid
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);

    const pharmacistData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        username: formData.get('username'),
        password: formData.get('password')
    };

    // Check if fields are empty
    if (!pharmacistData.firstName.trim() || !pharmacistData.lastName.trim() ||
        !pharmacistData.username.trim() || !pharmacistData.password.trim()) {
        alert('Por favor, complete todos los campos requeridos');
        return;
    }

    try {
        const pharmacistId = document.getElementById('pharmacistId').value;

        if(pharmacistId){
            // Update existing pharmacist - use form submission
            const formElement = document.createElement('form');
            formElement.method = 'POST';
            formElement.action = `/pharmacists/update/${pharmacistId}`;

            // Add form data as hidden fields
            Object.keys(pharmacistData).forEach(key => {
                // Skip password if it's the placeholder value
                if (key === 'password' && pharmacistData[key] === '35345353453') {
                    return;
                }
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = pharmacistData[key];
                formElement.appendChild(input);
            });

            document.body.appendChild(formElement);
            formElement.submit();
        }else{
            // Create new pharmacist - use form submission
            const formElement = document.createElement('form');
            formElement.method = 'POST';
            formElement.action = '/pharmacists/save';

            // Add form data as hidden fields
            Object.keys(pharmacistData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = pharmacistData[key];
                formElement.appendChild(input);
            });

            document.body.appendChild(formElement);
            formElement.submit();
        }
    } catch (error) {
        console.error('Error saving pharmacist:', error);
        alert('Error al guardar el farmacéutico');
    }
}

function deletePharmacist() {
    if (selectedPharmacists.length === 0) {
        alert('Por favor seleccione al menos un farmacéutico para eliminar');
        return;
    }

    if (confirm(`¿Está seguro de que desea eliminar ${selectedPharmacists.length} farmacéutico(s)?`)) {
        selectedPharmacists.forEach(async (pharmacistId) => {
            try {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/pharmacists/delete/${pharmacistId}`;
                document.body.appendChild(form);
                form.submit();
            } catch (error) {
                console.error('Error deleting pharmacist:', error);
            }
        });
    }
}

async function deletePharmacistById(pharmacistId) {
    if (confirm('¿Está seguro de que desea eliminar este farmacéutico?')) {
        try {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/pharmacists/delete/${pharmacistId}`;
            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error('Error deleting pharmacist:', error);
            alert('Error al eliminar el farmacéutico');
        }
    }
}

async function viewPharmacist(pharmacistId) {
    try {
        const response = await fetch(`/api/pharmacists/${pharmacistId}`);
        const pharmacist = await response.json();

        displayPharmacistDetails(pharmacist);

        const modal = new bootstrap.Modal(document.getElementById('viewPharmacistModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading pharmacist details:', error);
        alert('Error al cargar los detalles del farmacéutico');
    }
}

function displayPharmacistDetails(pharmacist) {
    const content = document.getElementById('pharmacistDetails');

    const detailsHtml = `
        <div class="row">
            <div class="col-md-6">
                <h6>Información Personal</h6>
                <p><strong>ID:</strong> ${pharmacist.id}</p>
                <p><strong>Nombre:</strong> ${pharmacist.firstName}</p>
                <p><strong>Apellido:</strong> ${pharmacist.lastName}</p>
                <p><strong>Usuario:</strong> ${pharmacist.username}</p>
            </div>
            <div class="col-md-6">
                <h6>Estadísticas</h6>
                <p><strong>Ventas realizadas:</strong> <span class="badge bg-primary">-</span></p>
                <p><strong>Fecha de registro:</strong> <span class="badge bg-info">-</span></p>
                <p><strong>Estado:</strong> <span class="badge bg-success">Activo</span></p>
            </div>
        </div>
    `;

    content.innerHTML = detailsHtml;
}
