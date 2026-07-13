const categorias = [
    "automotivo",
    "ferramentas",
    "casa",
    "sapatos",
    "perfumes",
    "maquiagens",
    "cabelo",
    "unha",
    "skincare",
    "hidratantes"
];

let produtos = {};
let editando = null;

categorias.forEach(categoria => {
    produtos[categoria] = [];
});

const nome = document.getElementById("nome");
const preco = document.getElementById("preco");
const imagem = document.getElementById("imagem");
const link = document.getElementById("link");
const categoria = document.getElementById("categoria");

const btnAdicionar = document.getElementById("btnAdicionar");
const btnExportar = document.getElementById("btnExportar");

const listaProdutos = document.getElementById("listaProdutos");
const buscar = document.getElementById("buscar");

const inputImportar = document.getElementById("inputImportar");

btnAdicionar.addEventListener("click", salvarProduto);
btnExportar.addEventListener("click", exportarJSON);

if(inputImportar){
    inputImportar.addEventListener("change", importarJSON);
}

buscar.addEventListener("input", renderizar);

carregarLocalStorage();

function carregarLocalStorage(){

    const dados = localStorage.getItem("produtos");

    if(dados){

        produtos = JSON.parse(dados);

        categorias.forEach(cat=>{

            if(!produtos[cat]){
                produtos[cat]=[];
            }

        });

    }

    renderizar();

}

function salvarLocalStorage(){

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}

function limparFormulario(){

    nome.value="";
    preco.value="";
    imagem.value="";
    link.value="";
    categoria.selectedIndex=0;

    editando=null;

    btnAdicionar.textContent="Adicionar Produto";

}
function salvarProduto(){

    if(
        nome.value.trim()==="" ||
        preco.value.trim()==="" ||
        imagem.value.trim()==="" ||
        link.value.trim()===""
    ){
        alert("Preencha todos os campos.");
        return;
    }

    const produto = {
        nome: nome.value.trim(),
        preco: preco.value.trim(),
        imagem: imagem.value.trim(),
        link: link.value.trim()
    };

    if(editando){

        produtos[editando.categoria][editando.indice] = produto;

    }else{

        produtos[categoria.value].push(produto);

    }

    salvarLocalStorage();

    limparFormulario();

    renderizar();

}

function renderizar(){

    listaProdutos.innerHTML = "";

    const pesquisa = buscar.value.toLowerCase();

    let quantidade = 0;

    categorias.forEach(cat=>{

        produtos[cat].forEach((produto,indice)=>{

            if(!produto.nome.toLowerCase().includes(pesquisa)){
                return;
            }

            quantidade++;

            const card = document.createElement("div");

            card.className = "card";

            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}">

                <div class="card-info">

                    <span class="categoria">
                        ${cat}
                    </span>

                    <h3>${produto.nome}</h3>

                    <div class="preco">
                        R$ ${produto.preco}
                    </div>

                    <a
                        href="${produto.link}"
                        target="_blank"
                        class="link">

                        Abrir no Mercado Livre

                    </a>

                    <div class="acoes-card">

                        <button
                            class="btnEditar"
                            onclick="editarProduto('${cat}',${indice})">

                            ✏️ Editar

                        </button>

                        <button
                            class="btnExcluir"
                            onclick="excluirProduto('${cat}',${indice})">

                            🗑 Excluir

                        </button>

                    </div>

                </div>
            `;

            listaProdutos.appendChild(card);

        });

    });

    if(quantidade===0){

        listaProdutos.innerHTML=`
            <p style="
                text-align:center;
                font-size:18px;
                color:#777;
                grid-column:1/-1;
            ">
                Nenhum produto encontrado.
            </p>
        `;

    }

}

function editarProduto(cat,indice){

    const produto = produtos[cat][indice];

    editando = {
        categoria: cat,
        indice: indice
    };

    nome.value = produto.nome;
    preco.value = produto.preco;
    imagem.value = produto.imagem;
    link.value = produto.link;
    categoria.value = cat;

    btnAdicionar.textContent = "Salvar Alterações";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

function excluirProduto(cat,indice){

    const confirmar = confirm(
        "Deseja excluir este produto?"
    );

    if(!confirmar){
        return;
    }

    produtos[cat].splice(indice,1);

    salvarLocalStorage();

    renderizar();

}
function exportarJSON() {

    const json = JSON.stringify(produtos, null, 4);

    const blob = new Blob(
        [json],
        {
            type: "application/json"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "produtos.json";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}

function importarJSON(event) {

    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function(e) {

        try {

            const dados = JSON.parse(e.target.result);

            categorias.forEach(cat => {

                if (!Array.isArray(dados[cat])) {
                    dados[cat] = [];
                }

            });

            produtos = dados;

            salvarLocalStorage();

            renderizar();

            alert("Produtos importados com sucesso!");

        } catch (erro) {

            alert("O arquivo JSON é inválido.");

            console.error(erro);

        }

    };

    leitor.readAsText(arquivo);

    event.target.value = "";

}