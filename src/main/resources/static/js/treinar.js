const API_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
    carregarRotinas();
})

async function carregarRotinas() {
    const resp = await fetch(`${API_URL}/rotinas`);
    const rotinas = await resp.json();

    const select = document.getElementById('selectRotina');
    rotinas.forEach(r => {
        select.innerHTML += `<option value="${r.id}">${r.nome}</option>`;
    });
}

async function iniciarTreino() {
    const idRotina = document.getElementById('selectRotina').value;
    const area = document.getElementById('areaTreino');

    if(!idRotina) {
        area.innerHTML = '<p style="text-align: center; color: #777;">Selecione uma rotina.</p>';
        return;
    }

    area.innerHTML = '<p>Carregando seu Treino...</p>';

    const resp = await fetch(`${API_URL}/rotinas/${idRotina}`);
    const rotina = await resp.json();
    area.innerHTML = "";

    if(rotina.exercicios.length == 0) {
        area.innerHTML = '<p>Essa rotina está vazia!</p>';
        return;
    }

    for(const ex of rotina.exercicios) {
        let ultimoPeso = '';
        let textoUltimo = 'Primeira Vez';
        try {
            const respHist = await fetch(`${API_URL}/treinos/ultimo/${ex.id}`);
            if(respHist.ok){
                const historico = await respHist.json();
                if(historico) {
                    ultimoPeso = historico.peso;
                    textoUltimo = `Última: ${historico.peso}kg`;
                }
            }
        } catch (e) { console.log("Sem histórico"); }

        let htmlSeriesHoje = '';
        try {
            const respHoje = await fetch(`${API_URL}/treinos/hoje/${ex.id}`);
            if(respHoje.ok) {
                const seriesHoje = await respHoje.json();
                seriesHoje.forEach((serie, index) => {
                    htmlSeriesHoje += gerarItemLista(serie, index + 1);
                });
            }
        } catch (e) { console.log("Erro ao buscar séries de hoje"); }

        area.innerHTML += `
            <div class="card-treino">
                <h3>${ex.nome}</h3>
                
                <div class="card-conteudo">
                    <div class="lado-esquerdo">
                        <div class="historico-mini"><span class="badge-ultimo">ℹ️ ${textoUltimo}</span></div>

                        <div class="controles-treino">
                            <div style="flex: 1;">
                                <label style="font-size: 0.8em;">Kg</label><br>
                                <input type="number" id="peso-${ex.id}" class="input-grande" value="${ultimoPeso}" placeholder="kg">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 0.8em;">Reps</label><br>
                                <input type="number" id="reps-${ex.id}" class="input-grande">
                            </div>
                            <div style="flex: 2;">
                                <label style="font-size: 0.8em;">&nbsp;</label><br>
                                <button class="btn-check" onclick="registrarSerie(this, ${ex.id}, ${idRotina})">✅ Feito</button>
                            </div>
                        </div>
                    </div>

                    <div class="lado-direito">
                        <strong style="color: #666; font-size: 0.9em;">Séries Hoje:</strong>
                        <ul id="lista-series-${ex.id}" class="lista-series">
                            ${htmlSeriesHoje}
                        </ul>
                    </div>
                </div>
                <div id="msg-${ex.id}" style="margin-top: 5px;"></div>
            </div>
        `;
    }
}


function gerarItemLista(dados, numeroSerie) {
    return `
        <li id="serie-${dados.id}" style="display: flex; justify-content: space-between; align-items: center;">
            <span>
                <strong>${numeroSerie}ª:</strong> ${dados.peso}kg <small>x</small> ${dados.repeticoes}
            </span>
            <button onclick="removerSerie(${dados.id})" class="btn-pequeno btn-transparente" title="Apagar registro">
                ✖
            </button>
        </li>
    `;
}

async function registrarSerie(btn, idExercicio, idRotina) {
    const pesoInput = document.getElementById(`peso-${idExercicio}`);
    const repsInput = document.getElementById(`reps-${idExercicio}`);
    const listaSeries = document.getElementById(`lista-series-${idExercicio}`);

    if(!pesoInput.value || !repsInput.value) {
        alert('Preencha o peso e repetições!');
        return;
    }

    const textoOriginal = btn.innerHTML;
    btn.innerHTML = "⏳...";
    btn.disabled = true;

    const numeroSerie = listaSeries.children.length + 1;

    const dadosEnvio = {
        peso: parseFloat(pesoInput.value),
        repeticoes: parseInt(repsInput.value),
        serie: numeroSerie,
        exercicio: {id: idExercicio},
        rotina: {id: idRotina}
    };
    
    try {
        const resp = await fetch(`${API_URL}/treinos/registrar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dadosEnvio)
        });

        if(resp.ok) {
            const treinoSalvo = await resp.json(); 
            listaSeries.innerHTML += gerarItemLista(treinoSalvo, numeroSerie);

            btn.style.backgroundColor = "#155724";
            setTimeout(() => {
                btn.innerHTML = textoOriginal;
                btn.disabled = false;
                btn.style.backgroundColor = "#28a745"; 
            }, 500);

        } else {
            alert("Erro ao salvar.");
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
        }
    } catch (e) {
        console.error(e);
        alert("Erro de conexão.");
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
}

async function removerSerie(idHistorico) {
    if(!confirm("Apagar esse registro?")) return;
    try {
        const resp = await fetch(`${API_URL}/treinos/${idHistorico}`, {
            method: 'DELETE'
        });

        if(resp.ok) {
            const item = document.getElementById(`serie-${idHistorico}`);
            if(item) item.remove();
        } else {
            alert("Erro ao apagar.");
        }
    } catch (e) {
        console.error(e);
    }
}