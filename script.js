document.addEventListener('DOMContentLoaded', function() {

    // --- Animación del diagrama al hacer scroll ---
    const diagramItems = document.querySelectorAll('.diagram-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5 });
    diagramItems.forEach(item => observer.observe(item));

    // --- Lógica del interruptor de Audiencia (Público/Técnico) ---
    const toggle = document.getElementById('audience-toggle');
    const explanationBox = document.getElementById('explanation-box');
    const techDetails = document.querySelectorAll('.tech-details');
    const publicoLabel = document.getElementById('publico-label');
    const tecnicoLabel = document.getElementById('tecnico-label');

    const explanations = {
        publico: `
            <h3 class="font-bold text-lg text-brand-green">Para el Público General:</h3>
            <p class="mt-2 text-slate-600">
                El sistema es como un organismo vivo. Las <strong>plantas (Campo de Generación)</strong> actúan como el estómago, creando la energía. La <strong>Batería Inteligente</strong> es el pulmón, almacenando esa energía para cuando se necesite. Y las <strong>Luces y Cámaras</strong> son los músculos, que usan la energía para iluminar y proteger el parque.
            </p>`,
        tecnico: `
            <h3 class="font-bold text-lg text-indigo-600">Para Técnicos Eléctricos:</h3>
            <p class="mt-2 text-slate-600">
                Se propone una micro-red DC. El <strong>MFC Array</strong> genera una salida de bajo voltaje DC, optimizada por un controlador de carga MPPT. El <strong>BESS (Tesla Powerwall)</strong> acumula la energía y gestiona el suministro. Las <strong>cargas</strong> (iluminación LED, CCTV) se alimentan preferiblemente desde un bus DC para maximizar la eficiencia, minimizando las pérdidas por conversión DC-AC-DC.
            </p>`
    };

    function updateAudienceView() {
        if (toggle.checked) { // Vista para Técnicos
            explanationBox.innerHTML = explanations.tecnico;
            techDetails.forEach(el => el.classList.remove('hidden'));
            tecnicoLabel.classList.remove('text-slate-400');
            tecnicoLabel.classList.add('text-indigo-600');
            publicoLabel.classList.add('text-slate-400');
            publicoLabel.classList.remove('text-brand-lime');
        } else { // Vista para Público General
            explanationBox.innerHTML = explanations.publico;
            techDetails.forEach(el => el.classList.add('hidden'));
            publicoLabel.classList.remove('text-slate-400');
            publicoLabel.classList.add('text-brand-lime');
            tecnicoLabel.classList.add('text-slate-400');
            tecnicoLabel.classList.remove('text-indigo-600');
        }
    }

    toggle.addEventListener('change', updateAudienceView);
    updateAudienceView(); // Llamada inicial para establecer el estado por defecto

    // --- Lógica del Gráfico de Potencial Energético ---
    const slider = document.getElementById('area-slider');
    const areaValue = document.getElementById('area-value');
    const ctx = document.getElementById('energyPotentialChart').getContext('2d');
    
    const WATT_PER_LED = 10; // 10W por bombillo LED
    
    const potentialData = {
        labels: ['Escenario Conservador (1 W/m²)', 'Escenario Optimista (3 W/m²)'],
        datasets: [{
            label: 'Bombillos LED alimentados 24/7',
            backgroundColor: ['#a3e635', '#4d7c0f'], /* lime-500, green-800 */
            borderColor: '#f1f5f9', /* slate-100 */
            borderWidth: 2,
            borderRadius: 5,
            data: [],
        }]
    };

    const energyChart = new Chart(ctx, {
        type: 'bar',
        data: potentialData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Potencial de Alimentación Continua de Bombillos LED (10W)',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.parsed.x} bombillos`
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de Bombillos LED (10W)'
                    }
                },
                y: {
                    ticks: {
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });

    function updateChart() {
        const area = slider.value;
        areaValue.textContent = area;

        const powerConservative = area * 1; // 1 W/m^2
        const powerOptimistic = area * 3; // 3 W/m^2

        const ledsConservative = Math.floor(powerConservative / WATT_PER_LED);
        const ledsOptimistic = Math.floor(powerOptimistic / WATT_PER_LED);
        
        energyChart.data.datasets[0].data = [ledsConservative, ledsOptimistic];
        energyChart.update();
    }
    
    slider.addEventListener('input', updateChart);
    updateChart(); // Llamada inicial para dibujar el gráfico

    // --- Lógica para el estado activo del enlace de navegación con el scroll ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 70) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});
