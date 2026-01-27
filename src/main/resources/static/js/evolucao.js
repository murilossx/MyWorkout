const API_URL = "http://localhost:8080";
let graficoAtual = null;

document.addEventListener("DOMContentLoaded", () => {
    carregarListaExercicios();
});

async function carregarListaExercicios() {
    const resp = await fetch(`${API_URL}/exercicios`);
    const exercicios = await resp.json();

    const select = document.getElementById('selectExercicio');
    exercicios.forEach(ex => {
        select.innerHTML += `<option value="${ex.id}">${ex.nome} (${ex.grupoMuscular})</option>`;
    });
}

async function carregarGrafico() {
    const idExercicio = document.getElementById('selectExercicio').value;
    if(!idExercicio) return;

    const resp = await fetch(`${API_URL}/treinos/evolucao/${idExercicio}`);
    const historico = await resp.json();

    if(historico.length == 0) {
        alert("Você ainda não treinou esse exercício.");
        if(graficoAtual) graficoAtual.destroy();
        return;
    }

    const labels = historico.map(h => {
        const data = new Date(h.dataHora);
        return data.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
    })
    
    const dadosPeso = historico.map(h => h.peso);
const ctx = document.getElementById('meuGrafico').getContext('2d');

    if (graficoAtual) {
        graficoAtual.destroy();
    }

    graficoAtual = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: labels, 
            datasets: [{
                label: 'Carga (kg)',
                data: dadosPeso, 
                borderColor: '#007bff', 
                backgroundColor: 'rgba(0, 123, 255, 0.1)', 
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: '#007bff',
                tension: 0.3, 
                fill: true 
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true, 
                    title: { display: true, text: 'Peso (Kg)' }
                }
            }
        }
    });
}