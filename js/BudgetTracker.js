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

    async load() {
        try {
            const apiUrl = "http://localhost:3000/quote";

            const response = await fetch(apiUrl);

            // Verifique se a solicitação foi bem-sucedida (status 200)
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                // Verifica se 'data' é uma matriz antes de iterar sobre ela
                if (Array.isArray(responseData.data)) {
                    const entries = responseData.data;

                    for (const entry of entries) {
                        this.addEntry(entry);
                    }

                    this.updateSummary();
                } else {
                    console.error("Os dados da API não contêm uma matriz:", responseData);
                }
            } else {
                console.error("Falha ao carregar dados da API:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Erro ao carregar dados da API:", error);
        }
    }


    updateSummary() {

    }

    save() {

    }

    addEntry(entry = {}) {
        this.root.querySelector(".entries").insertAdjacentHTML("beforeend", BudgetTracker.apply);
    }

    getEntryRows() {

    }

    onNewEntryBtnClick() {

    }

    onDeleteEntryBtnClick() {

    }
}