const listaDeTransacoes = document.querySelector('#transactions')
const exibicaoDeRenda = document.querySelector('#money-plus')
const exibicaoDeDespesas = document.querySelector('#money-minus')
const equilibrioDeExibicao = document.querySelector('#balance')
const form = document.querySelector('#form')
const nomeDaTransacao = document.querySelector('#text')
const valorDaTransacao = document.querySelector('#amount')

const armazenamento = JSON.parse(localStorage
  .getItem('transactions'))
let transactions = localStorage
  .getItem('transactions') !== null ? armazenamento : []

const removeTransaction = ID => {
  transactions  = transactions.filter(transaction => 
    transaction.id !== ID)
  atualizarArmazenamento()
  iniciar()
}

const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? '-' : '+'
  const cssClass = amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(amount)
  const li = document.createElement('li')

  li.classList.add(cssClass)
  li.innerHTML = `
    ${name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `
  listaDeTransacoes.append(li)
}

const despesas = transactionsAmounts => Math.abs(transactionsAmounts
  .filter(value => value < 0)
  .reduce((accumulator, value) => accumulator + value, 0))
  .toFixed(2)

const renda = transactionsAmounts => transactionsAmounts
  .filter(value => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2)

const saldo = transactionsAmounts => transactionsAmounts
  .reduce((accumulator, transaction) => accumulator + transaction, 0)
  .toFixed(2)

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({amount}) => amount)
  const total = saldo(transactionsAmounts)
  const income = renda(transactionsAmounts)
  const expense = despesas(transactionsAmounts)

  equilibrioDeExibicao.textContent = `R$ ${total}`
  exibicaoDeRenda.textContent = `R$ ${income}`
  exibicaoDeDespesas.textContent = `R$ ${expense}`
}

const iniciar = () => {
  listaDeTransacoes.innerHTML = ''
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()
} 

iniciar()

const atualizarArmazenamento = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const adicionarTransacao = (transacao, valor) => {
  transactions.push({
    id: generateID(), 
    name: transacao, 
    amount: Number(valor) 
  })
}

const limparInputs = () => {
  nomeDaTransacao.value = ''
  valorDaTransacao.value = ''
}

const novaTransacao = event => {
  event.preventDefault()

  const transacao = nomeDaTransacao.value.trim()
  const valor = valorDaTransacao.value.trim()
  const isSomeInputEmpty = transacao === '' || valor === ''

  if(isSomeInputEmpty) {
    alert('Por favor, preencha tanto o nome quanto o valor da transação')
    return
  }


  adicionarTransacao(transacao, valor)
  iniciar()
  atualizarArmazenamento()
  limparInputs()
}

form.addEventListener('submit', novaTransacao)