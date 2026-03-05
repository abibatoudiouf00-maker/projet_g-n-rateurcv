
let cvData = {
    nom: "", email: "", phone: "", experiences: []
};

function addEntry(containerId) {
    const id = Date.now();
    const html = `
        <div class="dynamic-entry" id="entry-${id}">
            <input type="text" placeholder="Poste" oninput="updateExp(${id}, 'role', this.value)">
            <input type="text" placeholder="Entreprise" oninput="updateExp(${id}, 'company', this.value)">
            <span class="remove-btn" onclick="removeEntry(${id})">Supprimer</span>
        </div>
    `;
    document.getElementById(containerId).insertAdjacentHTML('beforeend', html);
    cvData.experiences.push({ id, role: "", company: "" });
}

function removeEntry(id) {
    document.getElementById(`entry-${id}`).remove();
    cvData.experiences = cvData.experiences.filter(e => e.id !== id);
    renderPreview();
}

function updateExp(id, field, value) {
    const exp = cvData.experiences.find(e => e.id === id);
    if(exp) exp[field] = value;
    renderPreview();
}


document.getElementById('cv-form').addEventListener('input', (e) => {
    cvData.nom = document.getElementById('nom').value;
    cvData.email = document.getElementById('email').value;
    cvData.phone = document.getElementById('phone').value;
    
    validateSénégal(cvData.phone);
    renderPreview();
    localStorage.setItem('cv_save', JSON.stringify(cvData));
});

function validateSénégal(phone) {
    const regex = /^(70|75|76|77|78|33)[0-9]{7}$/;
    const msg = document.getElementById('error-msg');
    msg.innerText = regex.test(phone) ? "" : "Format Sénégalais invalide (ex: 771234567)";
}


function renderPreview() {
    const paper = document.getElementById('cv-paper');
    const template = document.getElementById('select-template').value;
    paper.className = `template-${template}`;

    paper.innerHTML = `
        <h1 style="margin-bottom:0">${cvData.nom || 'VOTRE NOM'}</h1>
        <p style="color:gray">${cvData.email} | ${cvData.phone}</p>
        <hr>
        <div class="section">
            <h3>EXPÉRIENCES PROFESSIONNELLES</h3>
            ${cvData.experiences.map(exp => `
                <div style="margin-bottom:10px">
                    <strong>${exp.role || 'Poste'}</strong> - ${exp.company || 'Entreprise'}
                </div>
            `).join('')}
        </div>
    `;
}

document.getElementById('btn-pdf').addEventListener('click', () => {
    const element = document.getElementById('cv-paper');
    html2pdf().set({ margin: 0, filename: 'mon_cv.pdf' }).from(element).save();
});


window.onload = () => {
    const saved = localStorage.getItem('cv_save');
    if(saved) {
        
    }
};