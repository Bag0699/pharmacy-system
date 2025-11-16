document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default for date filters
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateTo').value = today;

    // Set first day of month as default for date from
    const firstDay = new Date();
    firstDay.setDate(1);
    document.getElementById('dateFrom').value = firstDay.toISOString().split('T')[0];

    // Check for success message in URL parameters and remove it from URL
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    if (success === 'true') {
        // Show success message
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success alert-dismissible fade show';
        successAlert.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            ¡Venta registrada exitosamente!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insert at the top of the container
        const container = document.querySelector('.container');
        container.insertBefore(successAlert, container.firstChild);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            successAlert.remove();
        }, 5000);

        // Remove success parameter from URL to prevent showing on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
});

function clearFilters() {
    // Clear all filter inputs
    document.getElementById('searchInput').value = '';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';

    // Show all rows
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.display = '';
    });
}

function filterSales() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;

    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        // Skip the "No hay ventas registradas" row
        if (row.cells.length === 1 && row.cells[0].colSpan === 6) {
            row.style.display = searchTerm || dateFrom || dateTo ? 'none' : '';
            return;
        }

        // Get data from cells (0: ID, 1: Cliente, 2: Farmacéutico, 3: Fecha, 4: Total, 5: Acciones)
        const customerName = row.cells[1] ? row.cells[1].textContent.toLowerCase() : '';
        const pharmacistName = row.cells[2] ? row.cells[2].textContent.toLowerCase() : '';
        const saleDateCell = row.cells[3] ? row.cells[3].textContent : '';

        // Extract just the date part (already formatted as YYYY-MM-DD in the HTML)
        const dateOnly = saleDateCell;

        const matchesSearch = !searchTerm || customerName.includes(searchTerm) || pharmacistName.includes(searchTerm);
        const matchesDateFrom = !dateFrom || dateOnly >= dateFrom;
        const matchesDateTo = !dateTo || dateOnly <= dateTo;

        row.style.display = matchesSearch && matchesDateFrom && matchesDateTo ? '' : 'none';
    });
}

async function viewSaleDetails(saleId) {
    try {
        // Fetch the sale details page as HTML
        const response = await fetch(`/sales/${saleId}`);
        const htmlContent = await response.text();

        // Parse the HTML to extract the table content
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Find the table with sale details
        const detailsTable = doc.querySelector('.table');

        if (detailsTable) {
            // Display the details in the modal
            const content = document.getElementById('saleDetailsContent');
            content.innerHTML = `
                <div class="alert alert-info">
                    <h6><i class="bi bi-receipt me-2"></i>Detalles de la Venta #${saleId}</h6>
                </div>
                <div class="table-responsive">
                    ${detailsTable.outerHTML}
                </div>
                <div class="mt-3">
                    <small class="text-muted">
                        <i class="bi bi-info-circle me-1"></i>
                        Mostrando los productos vendidos en esta venta
                    </small>
                </div>
            `;
        } else {
            const content = document.getElementById('saleDetailsContent');
            content.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    No se encontraron detalles para esta venta
                </div>
            `;
        }

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('saleDetailsModal'));
        modal.show();
    } catch (error) {
        console.error('Error:', error);
        const content = document.getElementById('saleDetailsContent');
        content.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-x-circle me-2"></i>
                Error al cargar los detalles de la venta
            </div>
        `;
        const modal = new bootstrap.Modal(document.getElementById('saleDetailsModal'));
        modal.show();
    }
}

function displaySaleDetails(sale, saleDetails) {
    const content = document.getElementById('saleDetailsContent');

    const detailsHtml = `
        <div class="row mb-4">
            <div class="col-md-6">
                <h6>Información de la Venta</h6>
                <p><strong>ID:</strong> ${sale.id}</p>
                <p><strong>Fecha:</strong> ${new Date(sale.saleDate).toLocaleString()}</p>
                <p><strong>Total:</strong> $${sale.totalAmount.toFixed(2)}</p>
            </div>
            <div class="col-md-6">
                <h6>Participantes</h6>
                <p><strong>Cliente:</strong> ${sale.customer.firstName} ${sale.customer.lastName}</p>
                <p><strong>Farmacéutico:</strong> ${sale.pharmacist.firstName} ${sale.pharmacist.lastName}</p>
            </div>
        </div>
        
        <h6>Productos Vendidos</h6>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Medicamento</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${saleDetails.map(detail => `
                        <tr>
                            <td>${detail.medicine.name}</td>
                            <td>${detail.quantity}</td>
                            <td>$${detail.unitPrice.toFixed(2)}</td>
                            <td>$${detail.totalAmount.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr class="table-primary">
                        <th colspan="3">Total:</th>
                        <th>$${sale.totalAmount.toFixed(2)}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;

    content.innerHTML = detailsHtml;
}

function printSaleDetails() {
    const modalContent = document.getElementById('saleDetailsContent').innerHTML;
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Detalles de Venta</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 20px; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h3 class="text-center mb-4">Detalles de Venta</h3>
            ${modalContent}
            <div class="text-center mt-4 no-print">
                <button onclick="window.print()" class="btn btn-primary">Imprimir</button>
                <button onclick="window.close()" class="btn btn-secondary">Cerrar</button>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
}

// Search functionality - real-time search
document.getElementById('searchInput').addEventListener('keyup', function(e) {
    filterSales();
});

// Date filter functionality
document.getElementById('dateFrom').addEventListener('change', filterSales);
document.getElementById('dateTo').addEventListener('change', filterSales);
