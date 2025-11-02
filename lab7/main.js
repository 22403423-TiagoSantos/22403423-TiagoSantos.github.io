if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}


const seccaoProdutos = document.querySelector('#produtos');
const seccaoCesto = document.querySelector('#itensCesto');
const precoTotalElemento = document.querySelector('#precoTotal');


function atualizarPrecoTotal() {
    const produtosCesto = JSON.parse(localStorage.getItem('produtos-selecionados'));
    const total = produtosCesto.reduce((acc, produto) => acc + produto.price, 0);
    precoTotalElemento.textContent = `Custo total: ${total} €`;
}


function criarProduto(produto) {
    const artigo = document.createElement('article');

    artigo.innerHTML = `
        <h3>${produto.title}</h3>
        <img src="${produto.image}" alt="${produto.title}">
        <p class="preco">Custo total: ${produto.price} €</p>
        <p class="descricao">${produto.description}</p>
        <button type="button">+ Adicionar ao Cesto</button>
    `;

    artigo.querySelector('button').addEventListener('click', () => {
        const produtosCesto = JSON.parse(localStorage.getItem('produtos-selecionados'));
        produtosCesto.push(produto);
        localStorage.setItem('produtos-selecionados', JSON.stringify(produtosCesto));
        atualizaCesto();
    });

    return artigo;
}


function criaProdutoCesto(produto, index) {
    const artigoCesto = document.createElement('article');
    artigoCesto.classList.add('produtoCesto');

    artigoCesto.innerHTML = `
        <h3>${produto.title}</h3>
        <img src="${produto.image}" alt="${produto.title}">
        <p class="preco">Custo total: ${produto.price} €</p>
        <button type="button">- Remover do Cesto</button>
    `;

    const botaoRemover = artigoCesto.querySelector('button');
    botaoRemover.addEventListener('click', () => {
        const produtosCestoAtual = JSON.parse(localStorage.getItem('produtos-selecionados'));
        produtosCestoAtual.splice(index, 1);
        localStorage.setItem('produtos-selecionados', JSON.stringify(produtosCestoAtual));
        atualizaCesto();
    });

    return artigoCesto;
}


function atualizaCesto() {
    seccaoCesto.innerHTML = '';
    const produtosCesto = JSON.parse(localStorage.getItem('produtos-selecionados'));

    produtosCesto.forEach((produto, index) => {
        const artigoCesto = criaProdutoCesto(produto, index);
        seccaoCesto.appendChild(artigoCesto);
    });

    atualizarPrecoTotal();
}


function carregarProdutos(listaProdutos) {
    seccaoProdutos.innerHTML = '';
    listaProdutos.forEach(produto => {
        const artigo = criarProduto(produto);
        seccaoProdutos.appendChild(artigo);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const filtroCategoria = document.querySelector('#filtroCategoria');
    const ordenarPreco = document.querySelector('#ordenarPreco');
    const inputPesquisa = document.querySelector('#inputPesquisa');

    let produtos = [];

    fetch("https://deisishop.pythonanywhere.com/categories")
        .then(response => response.json())
        .then(categorias => {
            console.log("Categorias:", categorias);
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria;
                option.textContent = categoria;
                filtroCategoria.append(option);
            });
        })
        .catch(error => console.error('Erro:', error));

    fetch("https://deisishop.pythonanywhere.com/products")
        .then(response => response.json())
        .then(data => {
            produtos = data;
            carregarProdutos(produtos);
        })
        .catch(error => console.error('Erro:', error));

    filtroCategoria.addEventListener('change', () => {
        const categoriaSelecionada = filtroCategoria.value;

        fetch("https://deisishop.pythonanywhere.com/products")
            .then(response => response.json())
            .then(produtos => {
                let produtosFiltrados = produtos;
                if (categoriaSelecionada !== "") {
                    produtosFiltrados = produtos.filter(produto => produto.category === categoriaSelecionada);
                }

                seccaoProdutos.innerHTML = '';
                carregarProdutos(produtosFiltrados);
            })
            .catch(error => console.error('Erro:', error));
    });

    function aplicarFiltros() {
        const categoriaSelecionada = filtroCategoria.value;
        const termoPesquisa = inputPesquisa.value.trim().toLowerCase();
        const ordem = ordenarPreco.value;

        let produtosFiltrados = produtos;

        if (categoriaSelecionada !== "") {
            produtosFiltrados = produtosFiltrados.filter(produto => produto.category === categoriaSelecionada);
        }

        if (termoPesquisa !== "") {
            produtosFiltrados = produtosFiltrados.filter(produto =>
                produto.title.toLowerCase().includes(termoPesquisa)
            );
        }

        if (ordem === 'asc') {
            produtosFiltrados.sort((a, b) => a.price - b.price);
        } else if (ordem === 'desc') {
            produtosFiltrados.sort((a, b) => b.price - a.price);
        }

        carregarProdutos(produtosFiltrados);
    }

    filtroCategoria.addEventListener('change', aplicarFiltros);
    ordenarPreco.addEventListener('change', aplicarFiltros);
    inputPesquisa.addEventListener('input', aplicarFiltros);

    atualizaCesto();
});

const botaoComprar = document.querySelector('#botaoComprar');
const verificaEstudante = document.querySelector('#verificaEstudante');
const inputCupao = document.querySelector('#inputCupao');
const respostaCompra = document.querySelector('#respostaCompra');
const custoTotal = document.querySelector('#custoTotal');
const referencia = document.querySelector('#referencia');

botaoComprar.addEventListener('click', () => {
    const produtosCesto = JSON.parse(localStorage.getItem('produtos-selecionados'));
    const idsProdutos = produtosCesto.map(produto => produto.id);
    const estudante = verificaEstudante.checked;
    const cupao = inputCupao.value.trim();

    const data = {
        products: idsProdutos,
        student: estudante,
        coupon: cupao
    };

    fetch('https://deisishop.pythonanywhere.com/buy/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            custoTotal.textContent = `Valor final a pagar (com eventuais descontos): ${data.totalCost} €`;
            referencia.textContent = `Referência de pagamento: ${data.reference} €`;
        });
});



