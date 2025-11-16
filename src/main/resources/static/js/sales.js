document.addEventListener('DOMContentLoaded', function() {
    console.log('Módulo de ventas cargado');

    // Animación de entrada para las cards
    const cards = document.querySelectorAll('.sales-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
});
