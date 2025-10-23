import { produtos } from './produtos.js';


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
    carregarProdutos(produtos);
    atualizaCesto();
});
