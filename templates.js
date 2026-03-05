
const Templates = (() => {

function getNiveauLabel(niveau) {
const labels = { 1: 'Débutant', 2: 'Élémentaire', 3: 'Intermédiaire', 4: 'Avancé', 5: 'Expert' };
return labels[niveau] || '';
}

function getLangueLabel(niveau) {
const labels = { A1: 'A1 - Débutant', A2: 'A2 - Élémentaire', B1: 'B1 - Intermédiaire', B2: 'B2 - Avancé', C1: 'C1 - Autonome', C2: 'C2 - Maîtrise', natif: 'Langue natale' };
return labels[niveau] || niveau;
}

function renderStars(niveau) {
let html = '<span class="stars">';
for (let i = 1; i <= 5; i++) {
html += `<span class="star ${i <= niveau ? 'filled' : ''}">★</span>`;
}
html += '</span>';
return html;
}

function renderDots(niveau) {
let html = '<span class="dots">';
for (let i = 1; i <= 5; i++) {
html += `<span class="dot ${i <= niveau ? 'filled' : ''}"></span>`;
}
html += '</span>';
return html;
}

function renderModerne(data) {
const p = data.personal;
const fullName = `${p.firstName} ${p.lastName}`.trim() || 'Votre Nom';

let photoHtml = '';
if (p.photo) {
photoHtml = `<div class="cv-photo"><img src="${p.photo}" alt="Photo de profil"/></div>`;
}

let experiencesHtml = '';
if (data.experiences.length > 0) {
experiencesHtml = `
<section class="cv-section">
<h3 class="section-title"><span class="section-icon">💼</span> Expériences Professionnelles</h3>
${data.experiences.map(exp => `
<div class="cv-item">
<div class="cv-item-header">
<div>
<strong class="cv-item-title">${exp.poste || ''}</strong>
<span class="cv-item-company">${exp.entreprise || ''}</span>
</div>
<span class="cv-item-date">${exp.dateDebut || ''} – ${exp.dateFin || 'Présent'}</span>
</div>
${exp.lieu ? `<div class="cv-item-lieu">📍 ${exp.lieu}</div>` : ''}
${exp.description ? `<p class="cv-item-desc">${exp.description}</p>` : ''}
</div>
`).join('')}
</section>`;
}

let formationsHtml = '';
if (data.formations.length > 0) {
formationsHtml = `
<section class="cv-section">
<h3 class="section-title"><span class="section-icon">🎓</span> Formations</h3>
${data.formations.map(f => `
<div class="cv-item">
<div class="cv-item-header">
<div>
<strong class="cv-item-title">${f.diplome || ''}</strong>
<span class="cv-item-company">${f.etablissement || ''}</span>
</div>
<span class="cv-item-date">${f.dateDebut || ''} – ${f.dateFin || ''}</span>
</div>
${f.mention ? `<span class="mention-badge">Mention : ${f.mention}</span>` : ''}
${f.description ? `<p class="cv-item-desc">${f.description}</p>` : ''}
</div>
`).join('')}
</section>`;
}

let competencesHtml = '';
if (data.competences.length > 0) {
competencesHtml = `
<section class="cv-section cv-section-side">
<h3 class="section-title"><span class="section-icon">⚡</span> Compétences</h3>
${data.competences.map(c => `
<div class="competence-item">
<div class="competence-header">
<span class="competence-name">${c.nom || ''}</span>
<span class="competence-level-text">${getNiveauLabel(c.niveau)}</span>
</div>
<div class="competence-bar"><div class="competence-fill" style="width:${(c.niveau / 5) * 100}%"></div></div>
</div>
`).join('')}
</section>`;
}

let languesHtml = '';
if (data.langues.length > 0) {
languesHtml = `
<section class="cv-section cv-section-side">
<h3 class="section-title"><span class="section-icon"> </span> Langues</h3>
${data.langues.map(l => `
<div class="langue-item">
<span class="langue-nom">${l.nom || ''}</span>
<span class="langue-niveau">${getLangueLabel(l.niveau)}</span>
</div>
`).join('')}
</section>`;
}

let interetsHtml = '';
if (data.interets.length > 0) {
interetsHtml = `
<section class="cv-section cv-section-side">
<h3 class="section-title"><span class="section-icon">✨</span> Centres d'intérêt</h3>
<div class="interets-list">
${data.interets.map(i => `<span class="interet-tag">${i.nom || ''}</span>`).join('')}
</div>
</section>`;
}

return `
<div class="cv-template cv-moderne">
<header class="cv-header-moderne">
<div class="header-content">
${photoHtml}
<div class="header-info">
<h1 class="cv-name">${fullName}</h1>
${p.title ? `<h2 class="cv-title">${p.title}</h2>` : ''}
<div class="cv-contacts">
${p.email ? `<span>✉ ${p.email}</span>` : ''}
${p.phone ? `<span> ${p.phone}</span>` : ''}
${p.city ? `<span> ${p.address ? p.address + ', ' : ''}${p.city}</span>` : ''}
${p.linkedin ? `<span>🔗 ${p.linkedin}</span>` : ''}
${p.website ? `<span>🌐 ${p.website}</span>` : ''}
</div>
</div>
</div>
</header>
<div class="cv-body-moderne">
<aside class="cv-sidebar">
${competencesHtml}
${languesHtml}
${interetsHtml}
</aside>
<main class="cv-main">
${p.summary ? `<section class="cv-section"><h3 class="section-title"><span class="section-icon">👤</span> Profil</h3><p class="cv-summary">${p.summary}</p></section>` : ''}
${experiencesHtml}
${formationsHtml}
</main>
</div>
</div>`;
}

function renderClassique(data) {
const p = data.personal;
const fullName = `${p.firstName} ${p.lastName}`.trim() || 'Votre Nom';

let photoHtml = '';
if (p.photo) {
photoHtml = `<div class="cv-photo-classique"><img src="${p.photo}" alt="Photo"/></div>`;
}

let experiencesHtml = '';
if (data.experiences.length > 0) {
experiencesHtml = `
<section class="cv-section-classique">
<h3 class="section-title-classique">EXPÉRIENCES PROFESSIONNELLES</h3>
<div class="section-divider"></div>
${data.experiences.map(exp => `
<div class="cv-item-classique">
<div class="cv-item-left">
<div class="cv-item-date-classique">${exp.dateDebut || ''}<br>${exp.dateFin ? '– ' + exp.dateFin : '– Présent'}</div>
${exp.lieu ? `<div class="cv-item-lieu-classique">${exp.lieu}</div>` : ''}
</div>
<div class="cv-item-right">
<strong class="cv-item-title-classique">${exp.poste || ''}</strong>
<em class="cv-item-company-classique">${exp.entreprise || ''}</em>
${exp.description ? `<p class="cv-item-desc-classique">${exp.description}</p>` : ''}
</div>
</div>
`).join('')}
</section>`;
}

let formationsHtml = '';
if (data.formations.length > 0) {
formationsHtml = `
<section class="cv-section-classique">
<h3 class="section-title-classique">FORMATIONS</h3>
<div class="section-divider"></div>
${data.formations.map(f => `
<div class="cv-item-classique">
<div class="cv-item-left">
<div class="cv-item-date-classique">${f.dateDebut || ''}<br>${f.dateFin ? '– ' + f.dateFin : ''}</div>
</div>
<div class="cv-item-right">
<strong class="cv-item-title-classique">${f.diplome || ''}</strong>
<em class="cv-item-company-classique">${f.etablissement || ''}</em>
${f.mention ? `<span class="mention-classique">Mention ${f.mention}</span>` : ''}
${f.description ? `<p class="cv-item-desc-classique">${f.description}</p>` : ''}
</div>
</div>
`).join('')}
</section>`;
}

let competencesHtml = '';
if (data.competences.length > 0) {
competencesHtml = `
<section class="cv-section-classique">
<h3 class="section-title-classique">COMPÉTENCES</h3>
<div class="section-divider"></div>
<div class="competences-grid-classique">
${data.competences.map(c => `
<div class="competence-classique">
<span>${c.nom || ''}</span>
${renderDots(c.niveau)}
</div>
`).join('')}
</div>
</section>`;
}

let languesHtml = '';
if (data.langues.length > 0) {
languesHtml = `
<section class="cv-section-classique">
<h3 class="section-title-classique">LANGUES</h3>
<div class="section-divider"></div>
<div class="langues-grid-classique">
${data.langues.map(l => `
<div class="langue-classique">
<strong>${l.nom || ''}</strong>
<span>${getLangueLabel(l.niveau)}</span>
</div>
`).join('')}
</div>
</section>`;
}

let interetsHtml = '';
if (data.interets.length > 0) {
interetsHtml = `
<section class="cv-section-classique">
<h3 class="section-title-classique">CENTRES D'INTÉRÊT</h3>
<div class="section-divider"></div>
<div class="interets-classique">
${data.interets.map(i => `<span class="interet-classique">${i.nom || ''}</span>`).join('')}
</div>
</section>`;
}

return `
<div class="cv-template cv-classique">
<header class="cv-header-classique">
<div class="header-classique-inner">
${photoHtml}
<div class="header-classique-text">
<h1 class="cv-name-classique">${fullName}</h1>
${p.title ? `<h2 class="cv-title-classique">${p.title}</h2>` : ''}
<div class="cv-contacts-classique">
${p.email ? `<span> ${p.email}</span>` : ''}
${p.phone ? `<span>${p.phone}</span>` : ''}
${p.city ? `<span> ${p.address ? p.address + ', ' : ''}${p.city}</span>` : ''}
${p.linkedin ? `<span>LinkedIn: ${p.linkedin}</span>` : ''}
</div>
</div>
</div>
</header>
<div class="cv-body-classique">
${p.summary ? `
<section class="cv-section-classique">
<h3 class="section-title-classique">PROFIL</h3>
<div class="section-divider"></div>
<p class="cv-summary-classique">${p.summary}</p>
</section>` : ''}
${experiencesHtml}
${formationsHtml}
${competencesHtml}
${languesHtml}
${interetsHtml}
</div>
</div>`;
}

function render(data) {
const tpl = data.template || 'moderne';
if (tpl === 'classique') return renderClassique(data);
return renderModerne(data);
}

return { render, renderModerne, renderClassique };
})();