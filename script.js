document.addEventListener("DOMContentLoaded", function () {
    let ricette = {};

    // Carica il file JSON con le ricette
    fetch("ricette.json")
        .then(response => response.json())
        .then(data => {
            ricette = data;
            popolaMenuRicette();
        });

    function popolaMenuRicette() {
        const selectRicetta = document.getElementById("selezionaRicetta");
        Object.keys(ricette).forEach(ricetta => {
            let option = document.createElement("option");
            option.value = ricetta;
            option.textContent = ricetta;
            selectRicetta.appendChild(option);
        });
    }

    document.getElementById("selezionaRicetta").addEventListener("change", function () {
        mostraIngredienti(this.value);
    });

    function mostraIngredienti(ricetta) {
        const dettagliRicetta = document.getElementById("dettagliRicetta");
        dettagliRicetta.innerHTML = "";

        if (!ricetta) return;

        const datiRicetta = ricette[ricetta];

        let html = `<h2>${ricetta}</h2>`;
        html += `<p><strong>Porzioni standard:</strong> ${datiRicetta.porzioni}</p>`;

        if (datiRicetta.teglia.forma !== "nessuna") {
            html += `<p><strong>Teglia:</strong> ${datiRicetta.teglia.forma}`;
            if (datiRicetta.teglia.forma === "rettangolare") {
                html += ` (${datiRicetta.teglia.larghezza}x${datiRicetta.teglia.lunghezza} cm)`;
            } else if (datiRicetta.teglia.forma === "tonda") {
                html += ` (diametro ${datiRicetta.teglia.diametro} cm)`;
            }
            html += `</p>`;
        }

        html += `<h3>Ingredienti</h3>`;
        html += `<ul>`;
        Object.keys(datiRicetta.ingredienti).forEach(ingrediente => {
            let datiIngrediente = datiRicetta.ingredienti[ingrediente];
            html += `<li>${ingrediente}: ${datiIngrediente.quantità} ${datiIngrediente.unità}</li>`;
        });
        html += `</ul>`;

        // Form per modificare la quantità
        html += `<h3>Modifica quantità</h3>`;
        html += `
            <label for="fattore">Scegli il criterio:</label>
            <select id="criterio">
                <option value="porzioni">Numero di porzioni</option>
                <option value="teglia">Dimensione della teglia</option>
                <option value="ingrediente">Ingrediente limitante</option>
            </select>
            <input type="number" id="valore" placeholder="Inserisci il valore">
            <select id="ingredienteLimitante" style="display: none;">
                ${Object.keys(datiRicetta.ingredienti).map(ing => `<option value="${ing}">${ing}</option>`).join("")}
            </select>
            <button onclick="calcolaIngredienti()">Calcola</button>
        `;

        dettagliRicetta.innerHTML = html;
    }

window.calcolaIngredienti = function () {
    const ricettaSelezionata = document.getElementById("selezionaRicetta").value;
    if (!ricettaSelezionata) return;

    const criterio = document.getElementById("criterio").value;
    const valore = parseFloat(document.getElementById("valore").value);
    const datiRicetta = ricette[ricettaSelezionata];

    let fattoreScala = 1;

    if (criterio === "porzioni") {
        fattoreScala = valore / datiRicetta.porzioni;
    } else if (criterio === "teglia" && datiRicetta.teglia.forma !== "nessuna") {
        if (datiRicetta.teglia.forma === "rettangolare") {
            let areaBase = datiRicetta.teglia.larghezza * datiRicetta.teglia.lunghezza;
            fattoreScala = valore / areaBase;
        } else if (datiRicetta.teglia.forma === "tonda") {
            let areaBase = Math.PI * Math.pow(datiRicetta.teglia.diametro / 2, 2);
            fattoreScala = valore / areaBase;
        }
    } else if (criterio === "ingrediente") {
    

    };

    document.getElementById("criterio").addEventListener("change", function () {
        if (this.value === "ingrediente") {
            document.getElementById("ingredienteLimitante").style.display = "inline-block";
        } else {
            document.getElementById("ingredienteLimitante").style.display = "none";
        }
    });
});
