const form = document.querySelector('form');
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');
const expenseList = document.querySelector('ul');
const sizeList = document.querySelector('aside header p span');
const totalValue = document.querySelector('aside header h2');

// Formata o valor enquanto o usuário digita
amount.oninput = () => {
    let value = amount.value.replace(/\D/g, '');

    value = Number(value) / 100;

    amount.value = formatCurrencyBRL(value);
};

// Função para formatar valores para BRL (R$)
function formatCurrencyBRL(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Evento de envio do formulário
form.onsubmit = (e) => {
    e.preventDefault();

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date().toLocaleString()
    };

    // Recupera as despesas do localStorage e adiciona a nova
    const despesas = JSON.parse(localStorage.getItem('despesas')) || [];
    despesas.push(newExpense);
    localStorage.setItem('despesas', JSON.stringify(despesas));

    expenseAdd(newExpense);
    clearFields();
};

// Função para adicionar um item à lista de despesas
function expenseAdd(newExpense) {
    try {
        const expenseItem = document.createElement('li');
        expenseItem.classList.add("expense");
        expenseItem.setAttribute('data-id', newExpense.id); // Para identificar ao remover

        const expenseIcon = document.createElement('img');
        expenseIcon.setAttribute('src', `./img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute('alt', newExpense.category_name);

        const expenseInfo = document.createElement('div');
        expenseInfo.classList.add('expense-info');
        expenseInfo.innerHTML = `
            <strong>${newExpense.expense}</strong>
            <span>${newExpense.category_name}</span>
        `;

        const expenseAmount = document.createElement('span');
        expenseAmount.classList.add('expense-amount');
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace('R$', '')}`;

        const removeExpense = document.createElement('img');
        removeExpense.classList.add('remove-icon');
        removeExpense.setAttribute('src', './img/remove.svg');
        removeExpense.setAttribute('alt', 'Remover despesa');

        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeExpense);
        expenseList.append(expenseItem);

        updateTotal();
    } catch (error) {
        alert('Erro ao adicionar despesa');
        console.log(error);
    }
}

// Função para atualizar o total de despesas
function updateTotal() {
    try {
        const items = expenseList.children;

        sizeList.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}`;

        let total = 0;

        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector('.expense-amount');

            let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',', '.');

            value = parseFloat(value);

            if (isNaN(value)) {
                return alert('Erro ao calcular total');
            }

            total += value;
        }

        const symbolBRL = document.createElement('small');
        symbolBRL.textContent = 'R$';

        total = formatCurrencyBRL(total).toUpperCase().replace('R$', '');

        totalValue.innerHTML = "";
        totalValue.append(symbolBRL, total);
    } catch {
        alert('Erro ao atualizar total');
    }
}

// Função para carregar despesas do localStorage ao iniciar
function loadExpenses() {
    const despesas = JSON.parse(localStorage.getItem('despesas')) || [];

    despesas.forEach(expense => {
        expenseAdd(expense);
    });

    updateTotal();
}

// Remover despesa da lista e do localStorage
expenseList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-icon')) {
        const expenseItem = e.target.parentElement;
        const expenseId = expenseItem.getAttribute('data-id');

        // Remove do localStorage
        let despesas = JSON.parse(localStorage.getItem('despesas')) || [];
        despesas = despesas.filter(expense => expense.id.toString() !== expenseId);
        localStorage.setItem('despesas', JSON.stringify(despesas));

        // Remove do DOM
        expenseItem.remove();
        updateTotal();
    }
});

// Função para limpar os campos do formulário após adicionar despesa
function clearFields() {
    amount.value = '';
    expense.value = '';
    category.value = '';
    expense.focus();
}

// Carregar despesas ao iniciar a página
document.addEventListener('DOMContentLoaded', loadExpenses);
