const listaDeTransacoes = document.querySelector('#transactions')
const exibicaoDeRenda = document.querySelector('#money-plus')
const exibicaoDeDespesas = document.querySelector('#money-minus')
const equilibrioDeExibicao = document.querySelector('#balance')
const form = document.querySelector('#form')
const nomeDaTransacao = document.querySelector('#text')
const valorDaTransacao = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'))
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
  transactions  = transactions.filter(transaction => 
    transaction.id !== ID)
  updateLocalStorage()
  init()
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

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
  .filter(value => value < 0)
  .reduce((accumulator, value) => accumulator + value, 0))
  .toFixed(2)

const getIncome = transactionsAmounts => transactionsAmounts
  .filter(value => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
  .reduce((accumulator, transaction) => accumulator + transaction, 0)
  .toFixed(2)

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({amount}) => amount)
  const total = getTotal(transactionsAmounts)
  const income = getIncome(transactionsAmounts)
  const expense = getExpenses(transactionsAmounts)

  equilibrioDeExibicao.textContent = `R$ ${total}`
  exibicaoDeRenda.textContent = `R$ ${income}`
  exibicaoDeDespesas.textContent = `R$ ${expense}`
}

const init = () => {
  listaDeTransacoes.innerHTML = ''
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()
} 

init()

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(), 
    name: transactionName, 
    amount: Number(transactionAmount) 
  })
}

const cleanInputs = () => {
  nomeDaTransacao.value = ''
  valorDaTransacao.value = ''
}

const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = nomeDaTransacao.value.trim()
  const transactionAmount = valorDaTransacao.value.trim()
  const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

  if(isSomeInputEmpty) {
    alert('Por favor, preencha tanto o nome quanto o valor da transação')
    return
  }


  addToTransactionsArray(transactionName, transactionAmount)
  init()
  updateLocalStorage()
  cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)