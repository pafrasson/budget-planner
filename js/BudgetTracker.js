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
                    <th>Valor</th>
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
                <select class="input input-type">
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
            <td>
                <button type="button" class="save-entry">&#128190;</button>
            </td>
        </tr>
        `;
    }

    async load() {
        try {
            const apiUrl = "http://localhost:3000/quote";
            const response = await fetch(apiUrl);

            if (response.ok) {
                const responseData = await response.json();

                const entries = responseData.data ?? [];
                console.log(entries);

                for (const entry of entries) {
                    this.addEntry(entry);
                }

                this.updateSummary();
            } else {
                console.error("Falha ao carregar dados da API:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Erro ao carregar dados da API:", error);
        }
    }

    updateSummary() {
        const total = this.getEntryRows().reduce((total, row) => {
            const amount = row.querySelector(".input-amount").value;
            const isExpense = row.querySelector(".input-type").value === "expense";
            const modifier = isExpense ? -1 : 1;

            return total + (amount * modifier);
        }, 0);

        const totalFormatted = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(total);

        this.root.querySelector(".total").textContent = totalFormatted;
    }

    save() {
        /*const data = this.getEntryRows().map(row => {
            const dateValue = row.querySelector(".input-date").value;
            const descriptionValue = row.querySelector(".input-description").value;
            const typeValue = row.querySelector(".input-type").value;
            const amountValue = parseFloat(row.querySelector(".input-amount").value);

            if (dateValue && descriptionValue && typeValue && amountValue) {
                // Construir o objeto para enviar para a API
                var dataToSend = {
                    "date": dateValue,
                    "description": descriptionValue,
                    "type": typeValue,
                    "amount": amountValue
                };

                // Enviar dados para a API (substitua a URL pela sua API endpoint)
                $.ajax({
                    url: 'http://localhost:3000/quote',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(dataToSend),
                    success: function (response) {
                        console.log('Dados enviados com sucesso:', response);
                    },
                    error: function (error) {
                        console.error('Erro ao enviar dados:', error);
                    }
                });
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        });

        this.updateSummary();*/
    }

    addEntry(entry = {}) {
        this.root.querySelector(".entries").insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());

        const row = this.root.querySelector(".entries tr:last-of-type");

        row.querySelector(".input-date").value = entry.date || new Date().toISOString().replace(/T.*/, "");
        row.querySelector(".input-description").value = entry.description || "";
        row.querySelector(".input-type").value = entry.type || "income";
        row.querySelector(".input-amount").value = entry.amount;
        row.setAttribute("data-entry-id", entry.ID || "");

        row.querySelector(".delete-entry").addEventListener("click", e => {
            const entryId = e.target.closest("tr").getAttribute("data-entry-id");
            this.onDeleteEntryBtnClick(entryId);
        });
        row.querySelector(".save-entry").addEventListener("click", e => {
            this.onSaveEntryBtnClick(e);
        });

        row.querySelectorAll(".input").forEach(input => {
            input.addEventListener("change", () => this.save());
        });
    }

    getEntryRows() {
        return Array.from(this.root.querySelectorAll(".entries tr"));
    }

    onNewEntryBtnClick() {
        this.addEntry();
    }

    onDeleteEntryBtnClick(entryId) {
        const apiUrl = `http://localhost:3000/quote/${entryId}`;

        fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (response.ok) {
                    // Remove the entry from the UI
                    const entryRow = this.root.querySelector(`tr[data-entry-id="${entryId}"]`);
                    entryRow.remove();

                    // Update the summary or perform other necessary actions
                    this.updateSummary();
                } else {
                    console.error("Failed to delete entry from API:", response.status, response.statusText);
                }
            })
            .catch(error => {
                console.error("Error deleting entry from API:", error);
            });
        this.updateSummary();
    }

    createPostBody(data) {
        return {
            date: data.date,
            description: data.description,
            type: data.type,
            amount: data.amount
        };
    }

    onSaveEntryBtnClick(e) {
        const entryRow = e.target.closest("tr");
        const entryId = entryRow.getAttribute("data-entry-id") || null; // If updating an existing entry

        const apiUrl = entryId ? `http://localhost:3000/quote/${entryId}` : "http://localhost:3000/quote";

        const entryData = {
            date: entryRow.querySelector(".input-date").value,
            description: entryRow.querySelector(".input-description").value,
            type: entryRow.querySelector(".input-type").value,
            amount: entryRow.querySelector(".input-amount").value,
        };

        fetch(apiUrl, {
            method: entryId ? "PUT" : "POST", // Use PUT for updating existing entries
            headers: {
                "Content-Type": "application/json",
                // Add other headers if needed
            },
            body: JSON.stringify(entryData),
        })
            .then(response => {
                if (response.ok) {
                    // If successful, update the UI or perform other necessary actions
                    if (!entryId) {
                        // If it's a new entry, update the entry ID in the UI
                        response.json().then(data => {
                            entryRow.setAttribute("data-entry-id", data.ID);
                        });
                    }

                    // Update the summary or perform other necessary actions
                    this.updateSummary();
                } else {
                    console.error("Failed to save entry to API:", response.status, response.statusText);
                }
            })
            .catch(error => {
                console.error("Error saving entry to API:", error);
            });
        this.updateSummary();
    }
}