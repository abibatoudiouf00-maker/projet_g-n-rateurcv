const App = (() => {
let previewDebounce = null;
function refreshPreview() {
clearTimeout(previewDebounce);
previewDebounce = setTimeout(() => {
const data = CVData.get();
const html = Templates.render(data);
const preview = document.getElementById('cv-preview');
if (preview) {
preview.innerHTML = html;
preview.className = 'cv-preview-container';
preview.dataset.template = data.template;
}
}, 120);
}
function bindPersonalFields() {
const fields = ['firstName','lastName','title','email','phone','address','city','linkedin','website','summary'];
fields.forEach(field => {
const el = document.getElementById(`p-${field}`);
if (!el) return;
el.addEventListener('input', () => {
CVData.updatePersonal(field, el.value);
if (field === 'email' && el.value) {
const r = Validator.validateEmail(el.value);
if (!r.valid) Validator.showError(el, r.message);
else Validator.clearError(el);
}
if (field === 'phone' && el.value) {
const r = Validator.validatePhoneSN(el.value);
if (!r.valid) Validator.showError(el, r.message);
else Validator.clearError(el);
}
refreshPreview();
});
});
}
function restorePersonalFields() {
const p = CVData.get().personal;
const fields = ['firstName','lastName','title','email','phone','address','city','linkedin','website','summary'];
fields.forEach(field => {
const el = document.getElementById(`p-${field}`);
if (el && p[field]) el.value = p[field];
});
if (p.photo) {
const preview = document.getElementById('photo-preview');
const dropzone = document.getElementById('photo-dropzone');
if (preview) { preview.src = p.photo; preview.style.display = 'block'; }
if (dropzone) dropzone.classList.add('has-photo');
}
}
function initPasswordSection() {
const pwdInput = document.getElementById('auth-password');
const pwdConfirm = document.getElementById('auth-password-confirm');
const saveBtn = document.getElementById('save-password');
if (!pwdInput || !saveBtn) return;

const stored = CVData.get().auth?.password;
if (stored) { pwdInput.value = stored; if (pwdConfirm) pwdConfirm.value = stored; }

saveBtn.addEventListener('click', () => {
Validator.clearAllErrors(document.getElementById('tab-parametres'));
const pwd = pwdInput.value;
const r = Validator.validatePassword(pwd);
if (!r.valid) { Validator.showError(pwdInput, r.message); return; }
if (pwdConfirm && pwdConfirm.value !== pwd) {
Validator.showError(pwdConfirm, 'Les mots de passe ne correspondent pas.'); return;
}
CVData.setPassword(pwd);
showToast('Mot de passe enregistré !', 'success');
});
}

function initExportPDF() {
const btn = document.getElementById('export-pdf');
if (!btn) return;

btn.addEventListener('click', () => {
const data = CVData.get();
const errors = Validator.validatePersonalForm(data.personal);
if (errors.length > 0) {
document.querySelector('[data-tab="personnel"]')?.click();
errors.forEach(err => {
const el = document.getElementById(`p-${err.field}`);
if (el) Validator.showError(el, err.message);
});
showToast('Veuillez corriger les erreurs avant d\'exporter.', 'error');
return;
}

btn.textContent = 'Génération...';
btn.disabled = true;
const iframe = document.createElement('iframe');
iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;';
document.body.appendChild(iframe);

const cvHtml = Templates.render(data);
const doc = iframe.contentDocument;
const styleLinks = Array.from(document.styleSheets)
.map(ss => {
try {
return Array.from(ss.cssRules).map(r => r.cssText).join('\n');
} catch(e) { return ''; }
}).join('\n');

doc.open();
doc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Georgia', serif; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
${styleLinks}
@page { margin: 0; size: A4; }
.cv-template { width: 210mm; min-height: 297mm; margin: 0; padding: 0; page-break-inside: avoid; }
</style>
</head>
<body>${cvHtml}</body>
</html>`);
doc.close();

setTimeout(() => {
iframe.contentWindow.print();
setTimeout(() => {
document.body.removeChild(iframe);
btn.textContent = '📄 Exporter en PDF';
btn.disabled = false;
}, 1000);
}, 800);
});
}

function initResetBtn() {
const btn = document.getElementById('reset-data');
if (!btn) return;
btn.addEventListener('click', () => {
if (confirm('Effacer toutes les données ? Cette action est irréversible.')) {
CVData.reset();
showToast('Données effacées. Rechargement...', 'info');
setTimeout(() => location.reload(), 1200);
}
});
}

function showToast(message, type = 'info') {
const toast = document.createElement('div');
toast.className = `toast toast-${type}`;
toast.textContent = message;
document.body.appendChild(toast);
setTimeout(() => toast.classList.add('show'), 10);
setTimeout(() => {
toast.classList.remove('show');
setTimeout(() => toast.remove(), 400);
}, 3000);
}

function initMobilePreviewToggle() {
const toggleBtn = document.getElementById('toggle-preview');
const previewPanel = document.getElementById('preview-panel');
if (!toggleBtn || !previewPanel) return;
toggleBtn.addEventListener('click', () => {
previewPanel.classList.toggle('preview-visible');
toggleBtn.textContent = previewPanel.classList.contains('preview-visible') ? '✏️ Éditer' : '👁 Aperçu';
});
}

function init() {
CVData.load();
UI.initTabs();
UI.initPhotoUpload();
bindPersonalFields();
restorePersonalFields();
UI.initExperiences();
UI.initFormations();
UI.initCompetences();
UI.initLangues();
UI.initInterets();
UI.initTemplateSelector();
initPasswordSection();
initExportPDF();
initResetBtn();
initMobilePreviewToggle();
refreshPreview();
const hasData = CVData.get().personal.firstName || CVData.get().experiences.length > 0;
if (hasData) {
showToast('✅ Données restaurées depuis votre dernière session.', 'success');
}
setInterval(() => {
const indicator = document.getElementById('save-indicator');
if (indicator) {
indicator.textContent = '✓ Sauvegardé';
indicator.classList.add('saved');
setTimeout(() => indicator.classList.remove('saved'), 2000);
}
}, 5000);
}

return { init, refreshPreview };
})();

document.addEventListener('DOMContentLoaded', App.init);