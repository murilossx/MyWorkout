const form = document.getElementById('formExercicio');
const lista = document.getElementById('listaExercicios');

async function carregarExercicios() {
    const filtro = document.getElementById('filtroGrupo');

    const grupoSelecionado = filtro ? filtro.value : ""; 

    let url = '/exercicios'; 

    if (grupoSelecionado) {
        url = `/exercicios/filtro?grupo=${grupoSelecionado}`;
    }

    try {
        const resposta = await fetch(url);
        const exercicios = await resposta.json();
        
        lista.innerHTML = ''; 

        if (exercicios.length === 0) {
            lista.innerHTML = '<p>Nenhum exercício encontrado neste grupo.</p>';
            return;
        }

        exercicios.forEach(ex => {
            lista.innerHTML += `
                <div class="card">
                    <h3>${ex.nome} <br><small style="font-size: 0.7em; color: #666;">(${ex.grupoMuscular})</small></h3>
                    <p>${ex.descricao || 'Sem descrição'}</p>
                    
                    ${ex.linkVideo ? `<a href="${ex.linkVideo}" target="_blank" style="color: #007bff; text-decoration: none; font-weight: bold;">▶ Ver Vídeo</a>` : ''}
                    
                    </div>
            `;
        });
    } catch (erro) {
        console.error("Erro ao buscar:", erro);
        lista.innerHTML = '<p>Erro ao carregar exercícios.</p>';
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const dados = {
        nome: document.getElementById('nome').value,
        grupoMuscular: document.getElementById('grupoMuscular').value,
        linkVideo: document.getElementById('linkVideo').value,
        descricao: document.getElementById('descricao').value
    };

    try {
        const resposta = await fetch('/exercicios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert("Exercício Salvo com Sucesso!");
            form.reset(); 
            carregarExercicios(); 
        } else {
            alert("Erro ao salvar.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro de conexão!");
    }
});

carregarExercicios();