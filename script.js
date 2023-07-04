class CalculadoraProdutos {
  constructor() {
    this.produtos = [];
    this.quantidades = [];
    this.descontos = [];
    this.total = 0;
    this.quantidade_total = 0;

    this.descontos_por_quantidade = {
      3: 5,
      4: 5,
      5: 8,
      6: 8,
      7: 10,
      8: 10,
      9: 10
    };

    this.valores = {
      "Heal Bone 15x40": 210,
      "Heal Bone 20x30": 260,
      "Heal Bone 30x40": 300,
      "Bone Heal 15x40": 230,
      "Bone Heal 20x30": 280
    };

    this.container = document.querySelector('.calculadora');
    this.produtosContainer = this.container.querySelector('.produtos');
    this.btnAdicionar = this.container.querySelector('.btn-adicionar');
    this.relatorioText = this.container.querySelector('#relatorio-text');
    this.valorTotal = this.container.querySelector('#valor-total');
    this.quantidadeTotal = this.container.querySelector('#quantidade-total');
    this.selectPagamento = this.container.querySelector('#select-pagamento');
    this.inputFrete = this.container.querySelector('#input-frete');
    this.inputPrazo = this.container.querySelector('#input-prazo');
    this.mensagem = this.container.querySelector('#mensagem-text');

    this.btnAdicionar.addEventListener('click', this.adicionarProduto.bind(this));
    this.selectPagamento.addEventListener('change', this.atualizarCalculos.bind(this));
    this.inputFrete.addEventListener('input', this.atualizarCalculos.bind(this));
    this.inputPrazo.addEventListener('input', this.atualizarCalculos.bind(this));

    this.adicionarProduto();
    this.atualizarCalculos();
  }

  adicionarProduto() {
    const produtoContainer = document.createElement('div');
    produtoContainer.classList.add('produto');

    const modeloDropdown = document.createElement('select');
    for (const modelo of Object.keys(this.valores)) {
      const option = document.createElement('option');
      option.value = modelo;
      option.textContent = modelo;
      modeloDropdown.appendChild(option);
    }
    produtoContainer.appendChild(modeloDropdown);

    const quantidadeEntry = document.createElement('input');
    quantidadeEntry.type = 'text';
    quantidadeEntry.style.width = '50px';
    produtoContainer.appendChild(quantidadeEntry);

    const descontoEntry = document.createElement('input');
    descontoEntry.type = 'text';
    descontoEntry.style.width = '50px';
    descontoEntry.readOnly = true;
    produtoContainer.appendChild(descontoEntry);

    const botaoRemover = document.createElement('button');
    botaoRemover.textContent = 'Remover';
    botaoRemover.addEventListener('click', () => this.removerProduto(produtoContainer));
    produtoContainer.appendChild(botaoRemover);

    this.produtosContainer.appendChild(produtoContainer);

    this.produtos.push(modeloDropdown);
    this.quantidades.push(quantidadeEntry);
    this.descontos.push(descontoEntry);

    modeloDropdown.addEventListener('change', () => {
      this.atualizarCalculos();
      this.atualizarMensagem();
    });
    quantidadeEntry.addEventListener('input', () => {
      this.atualizarCalculos();
      this.atualizarMensagem();
    });
    this.atualizarMensagem();
  }

  atualizarCalculos() {
    this.total = 0;
    this.quantidade_total = 0;

    for (const quantidade of this.quantidades) {
      const quantidadeStr = quantidade.value;
      if (!isNaN(quantidadeStr)) {
        this.quantidade_total += parseInt(quantidadeStr);
      }
    }

    this.relatorioText.value = "Relatório de Produtos:\n\n";

    for (const [index, produto] of this.produtos.entries()) {
      const modelo = produto.value;
      const quantidade = this.quantidades[index].value;
      const desconto = this.descontos[index];

      if (!isNaN(quantidade)) {
        const quantidadeInt = parseInt(quantidade);

        if (modelo in this.valores) {
          const valorProduto = this.valores[modelo];
          const descontoQuantidade = this.obterDescontoQuantidade(this.quantidade_total);
          const descontoPagamento = this.obterDescontoPagamento();
          const descontoTotal = descontoQuantidade + descontoPagamento;
          const valorUnitario = valorProduto - (valorProduto * descontoTotal / 100);
          const valorQuantidade = valorProduto - (valorProduto * descontoQuantidade / 100);
          const valorUnitarioSemDesconto = valorProduto;
          const valorTotal = quantidadeInt * valorUnitario;

          desconto.value = `${descontoTotal}%`;

          this.total += valorTotal;

          this.relatorioText.value += `Produto: ${modelo}\n`;
          this.relatorioText.value += `Quantidade: ${quantidade}\n`;
          this.relatorioText.value += `Valor Unitário: R$${valorUnitarioSemDesconto.toFixed(2)}\n`;
          this.relatorioText.value += `Valor Unitário (com desconto): R$${valorQuantidade.toFixed(2)}\n`;
          this.relatorioText.value += `Valor Total: R$${valorTotal.toFixed(2)}\n\n`;
        }
      }
    }

    const frete = parseFloat(this.inputFrete.value) || 0;
    const prazo = parseInt(this.inputPrazo.value) || 0;

    this.total += frete;

    this.relatorioText.value += `Quantidade total: ${this.quantidade_total}\n\n`;
    this.relatorioText.value += `Frete: R$${frete.toFixed(2)}\n`;
    this.relatorioText.value += `Valor Final: R$${this.total.toFixed(2)}\n\n`;
    this.relatorioText.value += `Prazo de Entrega: ${prazo} dias\n\n`;
    this.relatorioText.value += `Orçamento válido por 7 dias`;

    this.atualizarMensagem();
  }

  atualizarMensagem() {
    const quantidade = this.quantidade_total;
    const valorTotal = this.total.toFixed(2);
    const frete = parseFloat(this.inputFrete.value) || 0;
    const prazo = parseInt(this.inputPrazo.value) || 0;
    const opcaoPagamento = this.selectPagamento.value;
    const mensagemContainer = this.mensagem;
  
    if (quantidade === 0) {
      mensagemContainer.textContent = 'Adicione produtos para visualizar a mensagem.';
    } else {
      let mensagemTexto = '';
  
      for (let i = 0; i < this.produtos.length; i++) {
        const modelo = this.produtos[i].value;
        const quantidade = parseInt(this.quantidades[i].value);
        const desconto = this.descontos[i];
  
        if (modelo in this.valores) {
          const valorProduto = this.valores[modelo];
          const descontoQuantidade = this.obterDescontoQuantidade(this.quantidade_total);
          const descontoPagamento = this.obterDescontoPagamento();
          const descontoTotal = descontoQuantidade + descontoPagamento;
          const valorUnitario = valorProduto - (valorProduto * descontoTotal / 100);
          const valorQuantidade = valorProduto - (valorProduto * descontoQuantidade / 100);
          const valorUnitarioSemDesconto = valorProduto;
          const valorTotal = quantidade * valorUnitario;
  
          desconto.value = `${descontoTotal}%`;

          if (descontoQuantidade > 0 && descontoPagamento > 0) {
            mensagemTexto = `${quantidade} unidade(s) ${modelo} = ~R$${valorUnitarioSemDesconto.toFixed(2)}~ R$${valorUnitario.toFixed(2)} cada.\n`;
          }  else if (descontoQuantidade > 0) {
            mensagemTexto += `${quantidade} unidade(s) ${modelo} = ~R$${valorUnitarioSemDesconto.toFixed(2)}~ R$${valorQuantidade.toFixed(2)} cada.\n`;
          } else if (descontoPagamento > 0) {
            mensagemTexto += `${quantidade} unidade(s) ${modelo} = ~R$${valorUnitarioSemDesconto.toFixed(2)}~ R$${valorUnitario.toFixed(2)} cada.\n`;
          } else {
            mensagemTexto += `${quantidade} unidade(s) ${modelo} = R$${valorUnitarioSemDesconto.toFixed(2)} cada.\n`;
          }
        }
      }
  
      if (frete > 0) {
        mensagemTexto += `Valor do frete: R$${frete.toFixed(2)}.\n`;
      }
  
      mensagemTexto += `Valor total: R$${valorTotal}.\n`;
  
      if (opcaoPagamento === 'Pix' || opcaoPagamento === 'Transferência') {
        mensagemTexto += `*Desconto de 5% mediante forma de pagamento via ${opcaoPagamento}.*\n`;
      }
  
      if (prazo > 0) {
        mensagemTexto += `Prazo de entrega: ${prazo} dias úteis.\n`;
      }
  
      mensagemTexto += `Orçamento válido por 7 dias.`;
  
      mensagemContainer.textContent = mensagemTexto;
    }
  }  
  
  removerProduto(produtoContainer) {
    const index = Array.from(this.produtosContainer.children).indexOf(produtoContainer);
    this.produtos.splice(index, 1);
    this.quantidades.splice(index, 1);
    this.descontos.splice(index, 1);
    produtoContainer.remove();
    this.atualizarCalculos();
    this.atualizarMensagem();
  }

  obterDescontoQuantidade(quantidadeTotal) {
    let descontoPercentual = 0;
    for (const [quantidade, desconto] of Object.entries(this.descontos_por_quantidade)) {
      if (quantidadeTotal >= parseInt(quantidade)) {
        descontoPercentual = desconto;
      }
    }
    return descontoPercentual;
  }

  obterDescontoPagamento() {
    let descontoPagamento = 0;
    const opcaoPagamento = this.selectPagamento.value;
    if (opcaoPagamento === 'Pix' || opcaoPagamento === 'Transferência') {
      descontoPagamento = 5;
    }
    return descontoPagamento;
  }
}

new CalculadoraProdutos();
