const form = document.querySelector('form');
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');
const expenseList = document.querySelector('ul');
const sizeList = document.querySelector('aside header p span');
const totalValue = document.querySelector('aside header h2');

amount.oninput = () => {
    let value = amount.value.replace(/\D/g, '');

    value = Number(value) / 100;

    amount.value = formatCurrencyBRL(value);
}

function formatCurrencyBRL(value) {
    value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return value;
}

form.onsubmit = (e) => {
    e.preventDefault();

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date().toLocaleString()
    }

    console.log(newExpense);

    expenseAdd(newExpense);
}

function expenseAdd(newExpense) {
    try {
        const expenseItem = document.createElement('li');
        expenseItem.classList.add("expense")

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

        const despesas =  localStorage.setItem(newExpense.id, JSON.stringify(newExpense));
     

        clearFields();
        updateTotal();
    } catch (error) {
        alert('Erro ao adicionar despesa');
        console.log(error);
    }
}

function updateTotal() {
    try {
        const items = expenseList.children;
        console.log(items);

        console.log(items.length);

        sizeList.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}`;

        let total = 0;

        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector('.expense-amount');

            let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',', '.');

            value = parseFloat(value);

            if (isNaN(value)) {
                return alert('Erro ao calcular total');
            }

            total += Number(value);
            console.log(total);
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

expenseList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-icon')) {
        e.target.parentElement.remove();
        updateTotal();
    }
});

function clearFields (){
    amount.value = '';
    expense.value = '';
    category.value = '';

    expense.focus();
}