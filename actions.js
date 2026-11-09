
/* =========================================
   LOAN SIMULATOR - ACTIONS.JS
========================================= */

// =========================================
// 1. TRANSLATIONS
// =========================================

const translations = {
    en: {
        subtitle: "Smart financial planning",
        language: "Language",
        eyebrow: "FINANCIAL TOOLS",
        mainTitle: "Calculate your loan",
        description: "Estimate your monthly payments and understand the total cost of your loan.",
        loanDetails: "Loan details",
        amountLabel: "Loan amount",
        interestLabel: "Interest rate (%)",
        rateTypeLabel: "Interest rate type",
        monthlyRate: "Effective Monthly (E.M.)",
        annualRate: "Effective Annual (E.A.)",
        monthsLabel: "Loan term (months)",
        calculate: "Calculate loan",
        resultsEyebrow: "YOUR RESULTS",
        resultsTitle: "Loan summary",
        monthlyPayment: "Estimated monthly payment",
        monthlyNote: "Fixed monthly installment",
        principal: "Loan amount",
        totalInterest: "Total interest",
        totalPayment: "Total payment",
        monthlyRateResult: "Effective monthly rate",
        print: "Print simulation",
        exportPDF: "Export PDF",
        tableTitle: "Amortization schedule",
        tableDescription: "Monthly breakdown of your loan payments.",
        period: "Month",
        payment: "Payment",
        principalColumn: "Principal",
        interestColumn: "Interest",
        balance: "Remaining balance",
        disclaimer: "This simulation is an estimate and does not include additional fees, insurance or taxes.",
        footerText: "Financial planning made simple.",
        errorAmount: "Please enter a valid loan amount greater than zero.",
        errorRate: "Please enter a valid interest rate (zero or greater).",
        errorMonths: "Please enter a valid loan term in whole months.",
        errorCalculation: "Unable to calculate this loan. Please check your values.",
        pdfTitle: "LOAN SIMULATION",
        pdfSummary: "LOAN SUMMARY",
        pdfMonthly: "Monthly payment",
        pdfPrincipal: "Loan amount",
        pdfInterest: "Total interest",
        pdfTotal: "Total payment",
        pdfRate: "Monthly effective rate",
        pdfTable: "AMORTIZATION SCHEDULE",
        pdfMonth: "Month",
        pdfPayment: "Payment",
        pdfPrincipalColumn: "Principal",
        pdfInterestColumn: "Interest",
        pdfBalance: "Balance",
        pdfDisclaimer: "Estimate only. Excludes additional fees, insurance and taxes."
    },

    es: {
        subtitle: "Planificación financiera inteligente",
        language: "Idioma",
        eyebrow: "HERRAMIENTAS FINANCIERAS",
        mainTitle: "Calcula tu préstamo",
        description: "Calcula tus cuotas mensuales y conoce el costo total de tu préstamo.",
        loanDetails: "Detalles del préstamo",
        amountLabel: "Monto del préstamo",
        interestLabel: "Tasa de interés (%)",
        rateTypeLabel: "Tipo de tasa de interés",
        monthlyRate: "Efectiva Mensual (E.M.)",
        annualRate: "Efectiva Anual (E.A.)",
        monthsLabel: "Plazo del préstamo (meses)",
        calculate: "Calcular préstamo",
        resultsEyebrow: "TUS RESULTADOS",
        resultsTitle: "Resumen del préstamo",
        monthlyPayment: "Cuota mensual estimada",
        monthlyNote: "Cuota mensual fija",
        principal: "Monto del préstamo",
        totalInterest: "Intereses totales",
        totalPayment: "Pago total",
        monthlyRateResult: "Tasa efectiva mensual",
        print: "Imprimir simulación",
        exportPDF: "Exportar PDF",
        tableTitle: "Tabla de amortización",
        tableDescription: "Desglose mensual de los pagos de tu préstamo.",
        period: "Mes",
        payment: "Cuota",
        principalColumn: "Capital",
        interestColumn: "Interés",
        balance: "Saldo restante",
        disclaimer: "Esta simulación es una estimación y no incluye comisiones adicionales, seguros ni impuestos.",
        footerText: "Planificación financiera simplificada.",
        errorAmount: "Por favor, ingresa un monto válido mayor que cero.",
        errorRate: "Por favor, ingresa una tasa de interés válida (cero o mayor).",
        errorMonths: "Por favor, ingresa un plazo válido en meses enteros.",
        errorCalculation: "No fue posible calcular el préstamo. Revisa los valores ingresados.",
        pdfTitle: "SIMULACIÓN DE PRÉSTAMO",
        pdfSummary: "RESUMEN DEL PRÉSTAMO",
        pdfMonthly: "Cuota mensual",
        pdfPrincipal: "Monto del préstamo",
        pdfInterest: "Intereses totales",
        pdfTotal: "Pago total",
        pdfRate: "Tasa efectiva mensual",
        pdfTable: "TABLA DE AMORTIZACIÓN",
        pdfMonth: "Mes",
        pdfPayment: "Cuota",
        pdfPrincipalColumn: "Capital",
        pdfInterestColumn: "Interés",
        pdfBalance: "Saldo",
        pdfDisclaimer: "Solo estimación. No incluye comisiones adicionales, seguros ni impuestos."
    }
};

// =========================================
// 2. APPLICATION STATE
// =========================================

let currentLanguage = localStorage.getItem("loanLanguage") || "en";
let currentSimulation = null;

const elements = {
    language: document.getElementById("languageSelect"),
    amount: document.getElementById("amount"),
    interestRate: document.getElementById("interestRate"),
    rateType: document.getElementById("rateType"),
    months: document.getElementById("months"),
    calculateButton: document.getElementById("calculateButton"),
    printButton: document.getElementById("printButton"),
    pdfButton: document.getElementById("pdfButton"),
    errorMessage: document.getElementById("errorMessage"),
    resultsSection: document.getElementById("resultsSection"),
    monthlyPayment: document.getElementById("monthlyPaymentValue"),
    principal: document.getElementById("principalValue"),
    interest: document.getElementById("interestValue"),
    totalPayment: document.getElementById("totalPaymentValue"),
    monthlyRate: document.getElementById("monthlyRateValue"),
    amortizationBody: document.getElementById("amortizationBody")
};

// =========================================
// 3. LANGUAGE MANAGEMENT
// =========================================

function updateLanguage(language) {
    currentLanguage = language;

    document.documentElement.lang = language;
    localStorage.setItem("loanLanguage", language);

    const dictionary = translations[language];

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;

        if (dictionary[key]) {
            element.textContent = dictionary[key];
        }
    });

    elements.language.value = language;

    if (currentSimulation) {
        renderResults(currentSimulation);
    }
}

// =========================================
// 4. NUMBER FORMATTING
// =========================================

function formatNumber(value) {
    return new Intl.NumberFormat(
        currentLanguage === "es" ? "es-CO" : "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(value);
}

function formatCurrency(value) {
    const locale = currentLanguage === "es" ? "es-CO" : "en-US";

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatPercentage(value) {
    return `${formatNumber(value * 100)}%`;
}

// =========================================
// 5. INPUT VALIDATION
// =========================================

function validateInputs() {
    const amount = Number(elements.amount.value);
    const annualOrMonthlyRate = Number(elements.interestRate.value);
    const months = Number(elements.months.value);

    const dictionary = translations[currentLanguage];

    if (
        elements.amount.value.trim() === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return dictionary.errorAmount;
    }

    if (
        elements.interestRate.value.trim() === "" ||
        !Number.isFinite(annualOrMonthlyRate) ||
        annualOrMonthlyRate < 0
    ) {
        return dictionary.errorRate;
    }

    if (
        elements.months.value.trim() === "" ||
        !Number.isSafeInteger(months) ||
        months <= 0
    ) {
        return dictionary.errorMonths;
    }

    return null;
}

// =========================================
// 6. LOAN CALCULATION
// =========================================

function calculateLoan() {
    elements.errorMessage.textContent = "";

    const validationError = validateInputs();

    if (validationError) {
        elements.errorMessage.textContent = validationError;
        return;
    }

    const principal = Number(elements.amount.value);
    const enteredRate = Number(elements.interestRate.value) / 100;
    const months = Number(elements.months.value);
    const rateType = elements.rateType.value;

    let monthlyRate;

    // Convert Effective Annual Rate to Effective Monthly Rate.
    if (rateType === "annual") {
        monthlyRate = Math.pow(1 + enteredRate, 1 / 12) - 1;
    } else {
        monthlyRate = enteredRate;
    }

    // Calculate fixed monthly payment.
    let monthlyPayment;

    if (monthlyRate === 0) {
        monthlyPayment = principal / months;
    } else {
        monthlyPayment =
            principal *
            monthlyRate /
            (1 - Math.pow(1 + monthlyRate, -months));
    }

    if (!Number.isFinite(monthlyPayment)) {
        elements.errorMessage.textContent =
            translations[currentLanguage].errorCalculation;
        return;
    }

    let balance = principal;
    let totalInterest = 0;
    let totalPaid = 0;

    const schedule = [];

    // Generate amortization schedule.
    for (let month = 1; month <= months; month++) {

        const interestPayment = balance * monthlyRate;
        let principalPayment = monthlyPayment - interestPayment;

        // Adjust the final installment to eliminate rounding residue.
        if (month === months || principalPayment > balance) {
            principalPayment = balance;
        }

        const actualPayment = principalPayment + interestPayment;

        balance = Math.max(0, balance - principalPayment);

        totalInterest += interestPayment;
        totalPaid += actualPayment;

        schedule.push({
            month,
            payment: actualPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance
        });
    }

    currentSimulation = {
        principal,
        enteredRate,
        rateType,
        monthlyRate,
        months,
        monthlyPayment,
        totalInterest,
        totalPaid,
        schedule
    };

    renderResults(currentSimulation);
}

// =========================================
// 7. DISPLAY RESULTS
// =========================================

function renderResults(simulation) {

    elements.monthlyPayment.textContent =
        formatCurrency(simulation.monthlyPayment);

    elements.principal.textContent =
        formatCurrency(simulation.principal);

    elements.interest.textContent =
        formatCurrency(simulation.totalInterest);

    elements.totalPayment.textContent =
        formatCurrency(simulation.totalPaid);

    elements.monthlyRate.textContent =
        formatPercentage(simulation.monthlyRate);

    renderAmortizationTable(simulation.schedule);

    elements.resultsSection.hidden = false;
}

// =========================================
// 8. AMORTIZATION TABLE
// =========================================

function renderAmortizationTable(schedule) {

    elements.amortizationBody.innerHTML = "";

    const fragment = document.createDocumentFragment();

    schedule.forEach(row => {

        const tr = document.createElement("tr");

        const values = [
            row.month,
            formatCurrency(row.payment),
            formatCurrency(row.principal),
            formatCurrency(row.interest),
            formatCurrency(row.balance)
        ];

        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        fragment.appendChild(tr);
    });

    elements.amortizationBody.appendChild(fragment);
}

// =========================================
// 9. PRINT SIMULATION
// =========================================

function printSimulation() {

    if (!currentSimulation) {
        return;
    }

    window.print();
}

// =========================================
// 10. EXPORT PDF
// =========================================

function exportPDF() {

    if (!currentSimulation) {
        return;
    }

    if (!window.jspdf || typeof window.jspdf.jsPDF !== "function") {
        alert("PDF library could not be loaded. Check your internet connection.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    const dictionary = translations[currentLanguage];
    const simulation = currentSimulation;

    // Document title.
    doc.setFontSize(19);
    doc.setTextColor(20, 45, 65);
    doc.text(dictionary.pdfTitle, 14, 18);

    // Summary heading.
    doc.setFontSize(12);
    doc.text(dictionary.pdfSummary, 14, 30);

    const summaryData = [
        [dictionary.pdfMonthly, formatCurrency(simulation.monthlyPayment)],
        [dictionary.pdfPrincipal, formatCurrency(simulation.principal)],
        [dictionary.pdfInterest, formatCurrency(simulation.totalInterest)],
        [dictionary.pdfTotal, formatCurrency(simulation.totalPaid)],
        [dictionary.pdfRate, formatPercentage(simulation.monthlyRate)]
    ];

    doc.autoTable({
        startY: 35,
        head: [[
            dictionary.pdfSummary,
            currentLanguage === "es" ? "Valor" : "Value"
        ]],
        body: summaryData,
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [18, 55, 72]
        }
    });

    // Amortization table heading.
    const tableStartY = doc.lastAutoTable.finalY + 12;

    doc.setFontSize(12);
    doc.text(dictionary.pdfTable, 14, tableStartY);

    const tableData = simulation.schedule.map(row => [
        row.month,
        formatCurrency(row.payment),
        formatCurrency(row.principal),
        formatCurrency(row.interest),
        formatCurrency(row.balance)
    ]);

    doc.autoTable({
        startY: tableStartY + 5,
        head: [[
            dictionary.pdfMonth,
            dictionary.pdfPayment,
            dictionary.pdfPrincipalColumn,
            dictionary.pdfInterestColumn,
            dictionary.pdfBalance
        ]],
        body: tableData,
        theme: "striped",
        styles: {
            fontSize: 8,
            cellPadding: 2.5
        },
        headStyles: {
            fillColor: [18, 55, 72]
        },
        columnStyles: {
            0: { halign: "center" }
        }
    });

    // Disclaimer.
    const finalY = doc.lastAutoTable.finalY + 8;

    if (finalY > 185) {
        doc.addPage();
        doc.setFontSize(8);
        doc.text(dictionary.pdfDisclaimer, 14, 15);
    } else {
        doc.setFontSize(8);
        doc.text(dictionary.pdfDisclaimer, 14, finalY);
    }

    const fileName = currentLanguage === "es"
        ? "simulacion-prestamo.pdf"
        : "loan-simulation.pdf";

    doc.save(fileName);
}

// =========================================
// 11. EVENT LISTENERS
// =========================================

elements.calculateButton.addEventListener("click", calculateLoan);

elements.printButton.addEventListener("click", printSimulation);

elements.pdfButton.addEventListener("click", exportPDF);

elements.language.addEventListener("change", event => {
    updateLanguage(event.target.value);
});

// =========================================
// 12. INITIALIZATION
// =========================================

updateLanguage(
    currentLanguage === "es" ? "es" : "en"
);
