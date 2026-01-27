const API_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
    carregarRotinas();
});

async function carregarRotinas() {
    const resp = await fetch(`${API_URL}/rotinas`);
    const rotinas = await resp.json();
    
    const select = document.getElementById('selectRotina');
    select.innerHTML = '<option value="">-- Selecione uma Rotina --</option>';
    
    rotinas.forEach(r => {
        select.innerHTML += `<option value="${r.id}">${r.nome}</option>`;
    });
}
async function criarRotina() {
    const nome = document.getElementById('nomeRotina').value;
    if(!nome) return alert("Digite um nome!");

    await fetch(`${API_URL}/rotinas`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nome: nome })
    });

    alert("Rotina criada!");
    document.getElementById('nomeRotina').value = '';
    carregarRotinas(); 
}

async function buscarExercicios() {
    const grupo = document.getElementById('filtroGrupo').value;
    if(!grupo) return;

    const resp = await fetch(`${API_URL}/exercicios/filtro?grupo=${grupo}`);
    const exercicios = await resp.json();

    const lista = document.getElementById('listaExercicios');
    lista.innerHTML = '';

    if(exercicios.length === 0) {
        lista.innerHTML = '<p>Nenhum exercício encontrado.</p>';
        return;
    }

    exercicios.forEach(ex => {
        lista.innerHTML += `
            <div class="card-exercicio">
                <strong>${ex.nome}</strong><br>
                <span class="tag">${ex.grupoMuscular}</span>
                <br><br>
                <button class="add-btn" onclick="adicionarNaRotina(${ex.id})">
                    + Adicionar
                </button>
            </div>
        `;
    });
}

async function adicionarNaRotina(idExercicio) {
    const idRotina = document.getElementById('selectRotina').value;
    
    if(!idRotina) {
        alert("⚠️ Por favor, selecione uma Rotina no Passo 2 antes de adicionar!");
        document.getElementById('selectRotina').focus();
        return;
    }

    const resp = await fetch(`${API_URL}/rotinas/${idRotina}/adicionar/${idExercicio}`, {
        method: 'POST'
    });

    if(resp.ok) {
        carregarItensDaRotina(); 
    } else {
        alert("Erro ao adicionar.");
    }
}
async function carregarItensDaRotina() {
    const idRotina = document.getElementById('selectRotina').value;
    const divItens = document.getElementById('itensRotina');

    if (!idRotina) {
        divItens.innerHTML = '<p style="color: #666;">(Os exercícios desta rotina aparecerão aqui)</p>';
        return;
    }

    divItens.innerHTML = 'Carregando exercícios...';

    const resp = await fetch(`${API_URL}/rotinas/${idRotina}`);
    const rotina = await resp.json();

    divItens.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
            <h3 style="margin: 0; font-size: 1.1em;">${rotina.nome}</h3>
            
            <div>
                <button onclick="renomearRotina(${rotina.id})" title="Renomear" class="btn-pequeno" style="background: white; border: 1px solid #ccc; color: #333;">
                    ✏️
                </button>
                <button onclick="apagarRotina(${rotina.id})" title="Excluir Rotina" class="btn-pequeno remover-btn">
                    🗑️
                </button>
            </div>
        </div>
    `;

    if (rotina.exercicios.length === 0) {
        divItens.innerHTML += '<p>Nenhum exercício nessa rotina ainda.</p>';
        return;
    }

    let htmlLista = '<ul style="list-style: none; padding: 0;">';
    
    rotina.exercicios.forEach(ex => {
        htmlLista += `
            <li style="background: white; margin-bottom: 8px; padding: 10px; border-radius: 6px; border: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${ex.nome}</strong> 
                    <br>
                    <small style="color: #888;">${ex.grupoMuscular}</small>
                </div>
                
                <button onclick="removerDaRotina(${rotina.id}, ${ex.id})" title="Remover" class="btn-pequeno btn-transparente">
                    ❌
                </button>
            </li>
        `;
    });
    
    htmlLista += '</ul>';
    divItens.innerHTML += htmlLista;
}

async function removerDaRotina(idRotina, idExercicio) {
    const resp = await fetch(`${API_URL}/rotinas/${idRotina}/remover/${idExercicio}`, {
        method: 'DELETE'
    });

    if(resp.ok) {
        carregarItensDaRotina();
    } else {
        alert("Erro ao remover o exercício da rotina.");
    }
}

async function renomearRotina(id) {
    const novoNome = prompt("Digite o novo nome da rotina:")

    if(novoNome && novoNome.trim() !== "") {
        const resp = await fetch(`${API_URL}/rotinas/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nome: novoNome})
        });
    

    if(resp.ok) {
        alert("Rotina renomeada!");
        carregarRotinas();
        setTimeout(() => carregarItensDaRotina(), 100)
    } else {
        alert("Erro ao renomear.");
    }
  }
}

async function apagarRotina(id) {
    if(confirm("Deseja apagar a rotina?")){
    const resp = await fetch(`${API_URL}/rotinas/${id}`, {
        method: 'DELETE'
    });

    if(resp.ok){
        alert("Rotina Apagada com Sucesso.");
        document.getElementById('selectRotina').value = "";
        document.getElementById('itensRotina').innerHTML = '<p style="color: #666;">(Os exercícios desta rotina aparecerão aqui)</p>';
        carregarRotinas();
    } else {
        alert("Erro ao apagar.");
    }
  }
}