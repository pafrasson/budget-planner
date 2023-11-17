export default class BudgetTracker {
    constructor(querySelectorString) {
        this.root = document.querySelector(querySelectorString);
        this.root.innerHTML = BudgetTracker.html();

        this.root.querySelector(".new-entry").addEventListener("click", () => {
            this.onNewEntryBtnClick();
        });

        this.load();
    }

    static html() {
        return `
        <table class="budget-tracker">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Quantidade</th>
                </tr>
            </thead>
            <tbody class="entries"></tbody>
            <tbody>
                <tr>
                    <td colspan="5" class="controls">
                        <button type="button" class="new-entry">Adicionar</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5" class="summary">
                        <strong>Total:</strong>
                        <span class="total">R$0.00</span>
                    </td>
                </tr>
            </tfoot>
        </table>
        `;
    }

    static entryHtml() {
        return `
        <tr>
            <td>
                <input class="input input-date" type="date">
            </td>
            <td>
                <input class="input input-description" type="text" placeholder="ex:(compras, conta de luz, etc.)">
            </td>
            <td>
                <select class="input input-tipo">
                    <option value="income">Renda</option>
                    <option value="expense">Gasto</option>   
                </select>
            </td>
            <td>
                <input class="input input-amount" type="number">
            </td>
            <td>
                <button type="button" class="delete-entry">&#10005;</button>
            </td>
        </tr>
        `;
    }

    load() {
        // Faz uma chamada GET para obter os dados JSON
        fetch('http://localhost:3000/quote')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Converte os dados para uma string JSON e armazena no localStorage
                localStorage.setItem('entries', JSON.stringify(data));

                // Lê os dados do localStorage e converte de volta para um objeto JavaScript
                entries = JSON.parse(localStorage.getItem('entries') || "[]");

                console.log('Dados carregados com sucesso:', entries);

                // Coloque o código que depende dos dados da API aqui, dentro do segundo bloco then
                for (const entry of entries) {
                    this.addEntry(entry);
                }
                this.updateSummary();
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    }


    updateSummary() {

    }

    save() {

    }

    addEntry(entry = {}) {

    }

    getEntryRows() {

    }

    onNewEntryBtnClick() {

    }

    onDeleteEntryBtnClick() {

    }
}