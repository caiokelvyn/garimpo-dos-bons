const params = new URLSearchParams(window.location.search);
const categoria = params.get("cat");

const titulo = document.getElementById("tituloCategoria");
const tituloPagina = document.getElementById("tituloPagina");
const vitrine = document.getElementById("vitrine");
const busca = document.getElementById("busca");

let listaProdutos = [];

fetch("produtos.json")
    .then(res => res.json())
    .then(dados => {

        if (!dados[categoria]) {
            titulo.textContent = "Categoria não encontrada";
            return;
        }

        listaProdutos = dados[categoria];

        const nomeCategoria =
            categoria.charAt(0).toUpperCase() + categoria.slice(1);

        titulo.textContent = nomeCategoria;
        tituloPagina.textContent = nomeCategoria + " - Vitrine de Ofertas";

        mostrarProdutos(listaProdutos);

        busca.addEventListener("input", () => {

            const texto = busca.value.toLowerCase();

            const filtrados = listaProdutos.filter(produto =>
                produto.nome.toLowerCase().includes(texto)
            );

            mostrarProdutos(filtrados);

        });

    });

function mostrarProdutos(produtos) {

    vitrine.innerHTML = "";

    if (produtos.length === 0) {
        vitrine.innerHTML = "<h2>Nenhum produto encontrado.</h2>";
        return;
    }

    produtos.forEach(produto => {

        vitrine.innerHTML += `
            <article class="card">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <div class="card-content">
                    <h2>${produto.nome}</h2>
                    <p class="preco">R$ ${produto.preco}</p>
                    <a href="${produto.link}" target="_blank" class="botao">
                        🛒 Comprar Agora
                    </a>
                </div>
            </article>
        `;

    });

}