let selectedMedicines = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Medicines module loaded');
    setupEventListeners();
    setDefaultExpirationDate();
});

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterMedicines();
        }
    });

    // Checkbox selection
    document.querySelectorAll('.medicine-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedMedicines();
            updateRowSelection(this);
        });
    });
}

function setDefaultExpirationDate() {
    // Set default expiration date to 1 year from now
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() + 1);
    document.getElementById('expirationDate').value = defaultDate.toISOString().split('T')[0];
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.medicine-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
        updateRowSelection(checkbox);
    });

    updateSelectedMedicines();
}

function updateRowSelection(checkbox) {
    const row = checkbox.closest('tr');
    if (checkbox.checked) {
        row.classList.add('selected-row');
    } else {
        row.classList.remove('selected-row');
    }
}

function updateSelectedMedicines() {
    selectedMedicines = [];
    document.querySelectorAll('.medicine-checkbox:checked').forEach(checkbox => {
        selectedMedicines.push(checkbox.value);
    });

    // Update select all checkbox state
    const allCheckboxes = document.querySelectorAll('.medicine-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.medicine-checkbox:checked');
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
    document.getElementById('expirationFilter').value = '';

    // Show all rows
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.display = '';
    });
}

function filterMedicines() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const expirationFilter = document.getElementById('expirationFilter').value;
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const name = row.cells[2].textContent.toLowerCase(); // Name is in column 2 (0-indexed)
        const expirationDateText = row.cells[5].textContent.trim(); // Expiration date is in column 5

        // Check search condition
        const matchesSearch = name.includes(searchTerm);

        // Check expiration filter
        let matchesExpiration = true;
        if (expirationFilter) {
            const expirationDate = parseDate(expirationDateText);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            switch(expirationFilter) {
                case 'expired':
                    matchesExpiration = expirationDate < today;
                    break;
                case '1month':
                    const oneMonthFromNow = new Date(today);
                    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
                    matchesExpiration = expirationDate >= today && expirationDate <= oneMonthFromNow;
                    break;
                case '3months':
                    const oneMonthFromNow2 = new Date(today);
                    oneMonthFromNow2.setMonth(oneMonthFromNow2.getMonth() + 1);
                    const threeMonthsFromNow = new Date(today);
                    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
                    matchesExpiration = expirationDate > oneMonthFromNow2 && expirationDate <= threeMonthsFromNow;
                    break;
                case '3plus':
                    const threeMonthsFromNow2 = new Date(today);
                    threeMonthsFromNow2.setMonth(threeMonthsFromNow2.getMonth() + 3);
                    matchesExpiration = expirationDate > threeMonthsFromNow2;
                    break;
            }
        }

        // Show/hide row
        row.style.display = matchesSearch && matchesExpiration ? '' : 'none';
    });
}

// Helper function to parse date in DD/MM/YYYY format
function parseDate(dateString) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
        // DD/MM/YYYY format
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    // Try parsing as is (for other formats)
    return new Date(dateString);
}

function openAddModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-capsule me-2"></i>Agregar Medicina';
    document.getElementById('medicineForm').reset();
    document.getElementById('medicineId').value = '';
    setDefaultExpirationDate();
}

function openEditModal() {
    if (selectedMedicines.length === 0) {
        alert('Por favor seleccione una medicina para editar');
        return;
    }

    if (selectedMedicines.length > 1) {
        alert('Por favor seleccione solo una medicina para editar');
        return;
    }

    editMedicine(selectedMedicines[0]);
}

async function editMedicine(medicineId) {
    try {
        // Show loading state
        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-capsule me-2"></i>Editar Medicina';
        document.getElementById('medicineForm').reset();
        document.getElementById('medicineId').value = medicineId;

        // Since we can't use API (returns 500), we need to get data from the table row
        const rows = document.querySelectorAll('tbody tr');
        let medicineData = null;

        rows.forEach(row => {
            const idCell = row.cells[1].textContent;
            if (idCell === medicineId.toString()) {
                medicineData = {
                    id: medicineId,
                    name: row.cells[2].textContent,
                    price: row.cells[3].textContent.replace('$', ''),
                    stock: row.cells[4].textContent,
                    expirationDate: row.cells[6].textContent
                };
            }
        });

        if (medicineData) {
            document.getElementById('name').value = medicineData.name;
            document.getElementById('price').value = medicineData.price;
            document.getElementById('expirationDate').value = convertDateFormat(medicineData.expirationDate);
            document.getElementById('stock').value = medicineData.stock;

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('medicineModal'));
            modal.show();
        } else {
            // Fallback to redirect if data not found
            window.location.href = `/medicines/edit/${medicineId}`;
        }
    } catch (error) {
        console.error('Error loading medicine:', error);
        alert('Error al cargar los datos de la medicina');
    }
}

// Helper function to convert DD/MM/YYYY to YYYY-MM-DD for input field
function convertDateFormat(dateString) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateString;
}

async function saveMedicine() {
    const form = document.getElementById('medicineForm');

    // Check if form is valid
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);

    const medicineData = {
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        expirationDate: formData.get('expirationDate')
    };

    // Check if fields are empty or invalid
    if (!medicineData.name.trim()) {
        alert('Por favor, ingrese el nombre del medicamento');
        return;
    }

    if (isNaN(medicineData.price) || medicineData.price <= 0) {
        alert('Por favor, ingrese un precio válido mayor a 0');
        return;
    }

    if (isNaN(medicineData.stock) || medicineData.stock < 0) {
        alert('Por favor, ingrese un stock válido mayor o igual a 0');
        return;
    }

    if (!medicineData.expirationDate) {
        alert('Por favor, seleccione una fecha de vencimiento');
        return;
    }

    try {
        const medicineId = document.getElementById('medicineId').value;

        if (medicineId) {
            // Update existing medicine - use form submission
            const formElement = document.createElement('form');
            formElement.method = 'POST';
            formElement.action = `/medicines/update/${medicineId}`;

            // Add form data as hidden fields
            Object.keys(medicineData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = medicineData[key];
                formElement.appendChild(input);
            });

            document.body.appendChild(formElement);
            formElement.submit();
        } else {
            // Create new medicine - use form submission
            const formElement = document.createElement('form');
            formElement.method = 'POST';
            formElement.action = '/medicines/save';

            // Add form data as hidden fields
            Object.keys(medicineData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = medicineData[key];
                formElement.appendChild(input);
            });

            document.body.appendChild(formElement);
            formElement.submit();
        }

    } catch (error) {
        console.error('Error saving medicine:', error);
        alert('Error al guardar la medicina');
    }
}

function deleteMedicine() {
    if (selectedMedicines.length === 0) {
        alert('Por favor seleccione al menos una medicina para eliminar');
        return;
    }

    if (confirm(`¿Está seguro de que desea eliminar ${selectedMedicines.length} medicina(s)?`)) {
        selectedMedicines.forEach(async (medicineId) => {
            try {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/medicines/delete/${medicineId}`;
                document.body.appendChild(form);
                form.submit();
            } catch (error) {
                console.error('Error deleting medicine:', error);
            }
        });
    }
}

async function deleteMedicineById(medicineId) {
    if (confirm('¿Está seguro de que desea eliminar esta medicina?')) {
        try {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/medicines/delete/${medicineId}`;
            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error('Error deleting medicine:', error);
            alert('Error al eliminar la medicina');
        }
    }
}

async function viewMedicine(medicineId) {
    try {
        // For now, redirect to edit page to view details
        window.location.href = `/medicines/edit/${medicineId}`;
    } catch (error) {
        console.error('Error loading medicine details:', error);
        alert('Error al cargar los detalles de la medicina');
    }
}

