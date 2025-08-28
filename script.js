const products = [
    { name: "Billing Software", img: "product/Billing_Software.png" },
    { name: "Portfolio", img: "product/Portfolio.png" },
    { name: "Product Catalog", img: "product/Product_Catalog.png" },
    { name: "Restaurant Menu", img: "product/Restaurant_Menu.png" }
];

function renderProducts(filter = "") {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";
    let anySelected = false;
    products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())).forEach((product, idx) => {
        grid.innerHTML += `
        <div class="product-card">
            <img src="${product.img}" alt="${product.name}">
            <div class="product-name">${product.name}</div>
            <div class="product-price">Consult With Us</div>
            <input type="checkbox" class="select-checkbox" id="select${idx}" data-name="${product.name}">
        </div>
        `;
    });
    setTimeout(() => attachCheckboxListeners(), 0);
}

function attachCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.select-checkbox');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateCustomerSection);
    });
    updateCustomerSection();
}

function updateCustomerSection() {
    const selected = getSelectedProducts();
    const section = document.getElementById('customerDetailsSection');
    section.style.display = selected.length > 0 ? 'flex' : 'none';
}

document.getElementById("searchBar").addEventListener("input", function(e) {
    renderProducts(e.target.value);
});

renderProducts();

// Proposal logic
function getSelectedProducts() {
    return Array.from(document.querySelectorAll('.select-checkbox:checked')).map(cb => cb.getAttribute('data-name'));
}

function getCustomerDetails() {
    return {
        name: document.getElementById('customerName').value || '',
        mobile: document.getElementById('customerMobile').value || '',
        email: document.getElementById('customerEmail').value || ''
    };
}

function showProposalPopup(selected) {
    const customer = getCustomerDetails();
    const popup = document.createElement('div');
    popup.className = 'proposal-popup';
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = '#fffbe6';
    popup.style.border = '2px solid #a67c52';
    popup.style.borderRadius = '18px';
    popup.style.padding = '32px 24px';
    popup.style.zIndex = '9999';
    popup.style.boxShadow = '0 2px 16px rgba(0,0,0,0.12)';
    popup.innerHTML = `
        <h2>Proposal Details</h2>
        <div style="margin-bottom: 16px;">Selected Items:<br><b>${selected.length ? selected.join(', ') : 'None'}</b></div>
        <div style="margin-bottom: 12px;">Customer Name: <b>${customer.name}</b><br>Mobile: <b>${customer.mobile}</b><br>Email: <b>${customer.email}</b></div>
        <button id="downloadPdfBtn" style="background:#a67c52;color:#fff;padding:10px 24px;border:none;border-radius:12px;font-size:1rem;cursor:pointer;">Download PDF Proposal</button>
        <button id="closePopupBtn" style="margin-left:16px;background:#ccc;color:#222;padding:10px 24px;border:none;border-radius:12px;font-size:1rem;cursor:pointer;">Close</button>
        <div style="margin-top:18px;font-size:0.95rem;color:#333;">Share this proposal with us through WhatsApp or Email. We will get back.<br>Phone: <b>+91 - 8910566564</b><br>Email: <b>contact.epsilon@gmail.com</b></div>
    `;
    document.body.appendChild(popup);
    document.getElementById('closePopupBtn').onclick = () => popup.remove();
    document.getElementById('downloadPdfBtn').onclick = () => downloadProposalPdf(selected, customer);
}

document.getElementById('placeProposalBtn').addEventListener('click', function() {
    const selected = getSelectedProducts();
    showProposalPopup(selected);
});

function downloadProposalPdf(selected, customer) {
    // Use jsPDF for PDF generation
    const doc = new window.jspdf.jsPDF();
    // Add beige background
    doc.setFillColor(245, 245, 220);
    doc.rect(0, 0, 210, 297, 'F');
    // Title
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(166, 124, 82); // Brown color
    doc.text('Epsilon IT - Product Proposal', 20, 30);
    // Proposal Number and Date/Time just below title
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    const proposalNum = 'P' + ('' + (now.getTime() % 10000)).padStart(4, '0');
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(34, 34, 34);
    doc.text(`Proposal No: ${proposalNum}`, 20, 40);
    doc.text(`Date: ${dateStr}  Time: ${timeStr}`, 20, 48);
    // Selected Items
    doc.setFont('times', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(34, 34, 34);
    doc.text('Selected Items:', 20, 65);
    doc.setFont('courier', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(166, 124, 82);
    doc.text(selected.length ? selected.join(', ') : 'None', 40, 80);
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(34, 34, 34);
    doc.text('Price: Consult With Us', 20, 100);
    // Improved Customer Details Section
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(166, 124, 82);
    doc.rect(15, 110, 180, 38, 'FD');
    doc.setFont('times', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(166, 124, 82);
    doc.text('Customer Details', 20, 122);
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(34, 34, 34);
    doc.text(`Name: ${customer.name}`, 20, 134);
    doc.text(`Mobile: ${customer.mobile}`, 100, 134);
    doc.text(`Email: ${customer.email}`, 20, 144);
    doc.setDrawColor(166, 124, 82);
    doc.line(15, 148, 195, 148);
    // Company Details Section
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(166, 124, 82);
    doc.rect(15, 150, 180, 45, 'FD');
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(166, 124, 82);
    doc.text('Company Details', 20, 160);
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(34, 34, 34);
    doc.text('Phone: +91 - 8910566564', 20, 170);
    doc.text('Email: contact.epsilon@gmail.com', 20, 180);
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.setTextColor(0, 102, 204); // Blue
    doc.text('Share this proposal with us through WhatsApp or Email. We will get back.', 20, 192, {maxWidth:170});
    // Tagline at the end
    doc.setFont('times', 'italic');
    doc.setFontSize(16);
    doc.setTextColor(166, 124, 82);
    doc.text('We deliver as promised ...', 20, 220, {maxWidth:170});
    doc.save('EpsilonIT_Proposal.pdf');
}

// Load jsPDF
(function() {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = function() {
        window.jspdf = window.jspdf || window.jspdf;
    };
    document.head.appendChild(script);
})();
    // Navigation bar button logic
    document.getElementById('ourProductBtn').addEventListener('click', function() {
        window.location.href = 'index.html'; // reloads landing page
    });

    document.getElementById('aboutUsBtn').addEventListener('click', function() {
        document.getElementById('aboutUsModal').style.display = 'block';
    });

    document.getElementById('closeAboutUs').addEventListener('click', function() {
        document.getElementById('aboutUsModal').style.display = 'none';
    });

    window.onclick = function(event) {
        var modal = document.getElementById('aboutUsModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    document.getElementById('howToOrderBtn').addEventListener('click', function() {
        document.getElementById('howToOrderModal').style.display = 'block';
    });

    document.getElementById('closeHowToOrder').addEventListener('click', function() {
        document.getElementById('howToOrderModal').style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        var modal = document.getElementById('howToOrderModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
