const form = document.getElementById('cv-form');
const preview = document.getElementById('cv-render');
form.addEventListener('input', () => {
    updatePreview();
    saveData();
});
function updatePreview() {
    const name = document.getElementById('fullname').value || "Votre Nom";
    const email = document.getElementById('email').value || "email@exemple.com";
    const phone = document.getElementById('phone').value || "77 000 00 00";

    preview.innerHTML = `
        <div class="cv-header">
            <h1>${name}</h1>
            <p>${email} | ${phone}</p>
        </div>
        <div class="cv-body">
            <h3>Expériences</h3>
            <div id="exp-render"></div>
        </div>
    `;
}

function saveData() {
    const data = {
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    localStorage.setItem('cv_data', JSON.stringify(data));
}

window.onload = () => {
    const saved = localStorage.getItem('cv_data');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('fullname').value = data.fullname || '';
    
        updatePreview();
    }
};

document.getElementById('download-btn').addEventListener('click', () => {
    const element = document.getElementById('cv-render');
    html2pdf().from(element).save('mon-cv.pdf');
});