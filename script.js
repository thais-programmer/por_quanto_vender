// lista de transacoes
const listaDeTransacoes = document.querySelector('#transactions')

// preco do produto
const preco = document.querySelector('#money-plus')

// custo que tenho com o produto
const custo = document.querySelector('#money-minus')

// valor do lucro que terei com a venda do produto
const lucro = document.querySelector('#balance')

// formulario para incluir as transacoes
const form = document.querySelector('#form')

// nome da transacao, uso este nome para saber do que estou tratando. ex: desconto
const nomeDaTransacao = document.querySelector('#text')

// valor da transacao, uso este valor para poder fazer os calculos
const valorDaTransacao = document.querySelector('#amount')

// armazenamento, usado para persistir os dados das transcoes
const armazenamento = JSON.parse(localStorage.getItem('transactions'))

// transacoes que estao armazenado no local storage
let transactions = localStorage.getItem('transactions') !== null ? armazenamento : []

// funcao que remove uma transacao
const removerTransacao = id => {
  // encontro as transacoes diferente do id
  transactions  = transactions.filter(transacao => transacao.id !== id)

  // agora eu atualizo as transacoes, neste casado teram somente os ids diferente do id informado
  atualizarArmazenamento()

  // inicializo o app
  iniciar()
}

// funcao usado para adicionar uma transacao na tela
const adicionarTransacaoNaTela = ({ amount, name, id }) => {
  // regra para indicar se a transacao é uma despesa ou valor de venda
  const operator = amount < 0 ? '-' : '+'

  // regra para troca no css a cor da transacao
  const cssClass = amount < 0 ? 'minus' : 'plus'

  // valor da transacao
  const amountWithoutOperator = Math.abs(amount)

  // montando lista para exibir uma transacao
  const li = document.createElement('li')
  li.classList.add(cssClass)
  li.innerHTML = `
    ${name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removerTransacao(${id})">x</button>
  `

  // adicionando a transacao na tela do app
  listaDeTransacoes.append(li)
}

// soma todas as minhas despesas
const despesas = transactionsAmounts => Math.abs(transactionsAmounts
  .filter(value => value < 0)
  .reduce((accumulator, value) => accumulator + value, 0))
  .toFixed(2)

// soma o valor de venda e possiveis acrecimos
const precoDeVenda = transactionsAmounts => transactionsAmounts
  .filter(value => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2)

// esta funcao calcula o lucro de venda
const lucroDeVenda = transactionsAmounts => transactionsAmounts
  .reduce((accumulator, transaction) => accumulator + transaction, 0)
  .toFixed(2)

// atualiza o qudro informativo
const atualizaQuandroDeValores = () => {
  const transactionsAmounts = transactions.map(({amount}) => amount)

  // soma o lucro de venda
  const calculoDoLucro = lucroDeVenda(transactionsAmounts)

  // calcula o preco de venda
  const calculoDoPreco = precoDeVenda(transactionsAmounts)

  // soma o custo do produto
  const calculoDoCusto = despesas(transactionsAmounts)

  // atualiza o lucro
  lucro.textContent = `R$ ${calculoDoLucro}`

  // atualia o preco de venda
  preco.textContent = `R$ ${calculoDoPreco}`

  // atualiza o 
  custo.textContent = `R$ ${calculoDoCusto}`
}

// inicia o app
const iniciar = () => {
  // limpa a lista de transacao
  listaDeTransacoes.innerHTML = ''

  // adicionar transacao por transacao
  transactions.forEach(adicionarTransacaoNaTela)

  // aualiza o quadro de valores
  atualizaQuandroDeValores()
} 

// inicia o aplicativo
iniciar()

// atualiza o armazenamento das transacoes
const atualizarArmazenamento = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

// esta funcao gera um id para o para identificar as transacoes
const generateID = () => new Date().getTime()

// esta funcao adicionar uma transacao na lista de transacoes
const adicionarTransacao = (transacao, valor) => {
  transactions.push({
    id: generateID(), 
    name: transacao, 
    amount: Number(valor) 
  })
}

// limpa os imputs para eu poder incluir uma nova transacao
const limparInputs = () => {
  nomeDaTransacao.value = ''
  valorDaTransacao.value = ''
}

// incluir uma nova transacao
const novaTransacao = event => {
  // zero o evento de submit do form, para evitar o repaint na tela
  event.preventDefault()

  // pego os valores o formulario e incluo na variaveis
  const transacao = nomeDaTransacao.value.trim()
  const valor = valorDaTransacao.value.trim()

  // para eu poder incluir uma nova transacao, os valoes devem ser preenchidos corretamente
  const seAhTransacaoForErrada = transacao === '' || valor === ''

  // se a validacao for falsy, eu notifico o usuario
  if(seAhTransacaoForErrada) {
    alert('Por favor, preencha tanto o nome quanto o valor da transação')
    return
  }

  // adiono uma nova transacao
  adicionarTransacao(transacao, valor)

  // atualizao a tela, pedindo para reiniciar o app
  iniciar()

  // atualizo o armazenamento
  atualizarArmazenamento()

  // limpo os inputs
  limparInputs()
}

// adiciono o evento de submit para eu rodar o evento de nova transacao
form.addEventListener('submit', novaTransacao)