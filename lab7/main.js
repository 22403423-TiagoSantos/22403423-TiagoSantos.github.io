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
    listaProdutos.forEach(produto => {
        const artigo = criarProduto(produto);
        seccaoProdutos.appendChild(artigo);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const filtroCategoria = document.querySelector('#filtroCategoria');

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
            console.log('Produtos:', data);
            carregarProdutos(data);
        })
        .catch(error => console.error('Erro:', error))

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

    ordenarPreco.addEventListener('change', () => {

        const produtosArtigos = seccaoProdutos.querySelectorAll('article');


        const produtosArray = [...produtosArtigos];


        produtosArray.sort((a, b) => {
            const precoA = a.querySelector('.preco');
            const precoB = b.querySelector('.preco');

            if (ordenarPreco.value === 'asc') {
                return precoA - precoB;
            }
            if (ordenarPreco.value === 'desc') {
                return precoB - precoA;
            }
            return 0;
        });


        seccaoProdutos.innerHTML = '';
        produtosArray.forEach(produto => seccaoProdutos.append(produto));
    });


    atualizaCesto();
});
