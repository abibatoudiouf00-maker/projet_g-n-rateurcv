
let TPL = 'm', COLOR = '#c9914a', PHOTO = '';

const G = id => (document.getElementById(id) || {}).value || '';
const S = (id, v) => { const e = document.getElementById(id); if (e) e.value = v || ''; };
const X = s => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const uid = () => Math.random().toString(36).slice(2, 7);

function rmCard(id) { const e = document.getElementById(id); if (e) { e.remove(); Store.save(); } }

function setStars(el, val, cardId) {
    document.querySelectorAll('#' + cardId + ' .star').forEach((s, i) => s.classList.toggle('on', i < val));
    const h = document.querySelector('#' + cardId + ' [data-k="lv"]'); if (h) h.value = val;
    Store.save();
}

function cards(pfx) {
    return [...document.querySelectorAll('[id^="' + pfx + '"]')].map(c => {
        const o = {}; c.querySelectorAll('[data-k]').forEach(el => o[el.dataset.k] = el.value);
        const lits = c.querySelectorAll('.star.on'); if (lits.length) o.lv = lits.length;
        return o;
    });
}

function toast(msg, type = 'info') {
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg; t.className = 'show ' + type;
    clearTimeout(t._x); t._x = setTimeout(() => t.className = '', 3200);
}

const Store = {
    K: 'cvpro1',
    def: () => ({ name: '', job: '', email: '', phone: '', city: '', web: '', summary: '', interests: '', photo: '', tpl: 'm', color: '#c9914a', exp: [], edu: [], skills: [], langs: [] }),

    load() {
        try { const r = localStorage.getItem(this.K); return r ? { ...this.def(), ...JSON.parse(r) } : this.def(); }
        catch { return this.def(); }
    },

    collect() {
        return {
            name: G('f-name'), job: G('f-job'), email: G('f-email'), phone: G('f-phone'),
            city: G('f-city'), web: G('f-web'), summary: G('f-summary'), interests: G('f-interests'),
            photo: PHOTO, tpl: TPL, color: COLOR,
            exp: cards('exp-'), edu: cards('edu-'), skills: cards('sk-'), langs: cards('lg-')
        };
    },

    restore(d) {
        S('f-name', d.name); S('f-job', d.job); S('f-email', d.email); S('f-phone', d.phone);
        S('f-city', d.city); S('f-web', d.web); S('f-summary', d.summary); S('f-interests', d.interests);
    },

    save() {
        const d = this.collect();
        try { localStorage.setItem(this.K, JSON.stringify(d)); } catch { }
        Render.draw(d);
    },

    clear() { localStorage.removeItem(this.K); }
};

const Style = {
    tpl(v, el) {
        TPL = v;
        document.querySelectorAll('.tcard').forEach(c => c.classList.toggle('on', c.dataset.tpl === v));
        Store.save();
    },
    color(v, el) {
        COLOR = v;
        document.querySelectorAll('.csw').forEach(c => c.classList.toggle('on', c.dataset.c === v));
        Store.save();
    },
    restoreAll(tpl, color) {
        TPL = tpl || 'm'; COLOR = color || '#c9914a';
        document.querySelectorAll('.tcard').forEach(c => c.classList.toggle('on', c.dataset.tpl === TPL));
        document.querySelectorAll('.csw').forEach(c => c.classList.toggle('on', c.dataset.c === COLOR));
    }
};

const Dyn = {
    exp(d = {}) {
        const id = 'exp-' + uid();
        document.getElementById('list-exp').insertAdjacentHTML('beforeend', `
            <div class="card" id="${id}">
                <div class="card-h"><span class="card-lbl">✦ Expérience</span><button class="del" onclick="rmCard('${id}')">✕</button></div>
                <div class="g2">
                    <div class="f"><label>Poste</label><input data-k="pos" value="${X(d.pos)}" oninput="Store.save()"></div>
                    <div class="f"><label>Entreprise</label><input data-k="org" value="${X(d.org)}" oninput="Store.save()"></div>
                    <div class="f"><label>Début</label><input data-k="start" placeholder="Jan 2022" value="${X(d.start)}" oninput="Store.save()"></div>
                    <div class="f"><label>Fin</label><input data-k="end" placeholder="Présent" value="${X(d.end)}" oninput="Store.save()"></div>
                </div>
                <div class="f" style="margin-top:.5rem"><label>Description</label>
                    <textarea data-k="desc" rows="3" oninput="Store.save()">${X(d.desc)}</textarea>
                </div>
            </div>`);
    },

    edu(d = {}) {
        const id = 'edu-' + uid();
        document.getElementById('list-edu').insertAdjacentHTML('beforeend', `
            <div class="card" id="${id}">
                <div class="card-h"><span class="card-lbl">✦ Formation</span><button class="del" onclick="rmCard('${id}')">✕</button></div>
                <div class="g2">
                    <div class="f"><label>Diplôme</label><input data-k="deg" value="${X(d.deg)}" oninput="Store.save()"></div>
                    <div class="f"><label>Établissement</label><input data-k="sch" value="${X(d.sch)}" oninput="Store.save()"></div>
                    <div class="f"><label>Début</label><input data-k="start" value="${X(d.start)}" oninput="Store.save()"></div>
                    <div class="f"><label>Fin</label><input data-k="end" value="${X(d.end)}" oninput="Store.save()"></div>
                </div>
            </div>`);
    },

    skill(d = {}) {
        const id = 'sk-' + uid(); const lv = Number(d.lv) || 3;
        const stars = [1, 2, 3, 4, 5].map(i => `<span class="star${i <= lv ? ' on' : ''}" onclick="setStars(this,${i},'${id}')">★</span>`).join('');
        document.getElementById('list-skills').insertAdjacentHTML('beforeend', `
            <div class="card" id="${id}">
                <div class="card-h"><span class="card-lbl">✦ Compétence</span><button class="del" onclick="rmCard('${id}')">✕</button></div>
                <div class="g2">
                    <div class="f"><label>Nom</label><input data-k="nm" value="${X(d.nm)}" oninput="Store.save()"></div>
                    <div class="f"><label>Niveau</label><div class="stars">${stars}<input type="hidden" data-k="lv" value="${lv}"></div></div>
                </div>
            </div>`);
    },

    lang(d = {}) {
        const id = 'lg-' + uid();
        const lvls = ['Débutant', 'Intermédiaire', 'Courant', 'Bilingue', 'Langue maternelle'];
        document.getElementById('list-langs').insertAdjacentHTML('beforeend', `
            <div class="card" id="${id}">
                <div class="card-h"><span class="card-lbl">✦ Langue</span><button class="del" onclick="rmCard('${id}')">✕</button></div>
                <div class="g2">
                    <div class="f"><label>Langue</label><input data-k="nm" value="${X(d.nm)}" oninput="Store.save()"></div>
                    <div class="f"><label>Niveau</label>
                        <select data-k="lv" onchange="Store.save()">
                            ${lvls.map(l => `<option${d.lv === l ? ' selected' : ''}>${l}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>`);
    }
};
const Render = {
    draw(d) {
        const cv = document.getElementById('cv'); if (!cv) return;
        const c = d.color || COLOR;
        cv.innerHTML = (d.tpl || TPL) === 'e' ? this.exec(d, c) : this.mod(d, c);
    },

    mod(d, c) {
        const ph = d.photo ? `<img src="${d.photo}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.2);display:block;margin-bottom:.9rem">` : '';
        return `<div class="cvm">
            <div class="cvm-side">
                ${ph}
                <div class="cvm-name">${d.name || 'Votre Nom'}</div>
                <div class="cvm-job" style="color:${c}">${d.job || 'Titre professionnel'}</div>
                <div class="aside-sec">
                    <span class="aside-ttl" style="color:${c}">Contact</span>
                    ${d.email ? `<div class="aside-item">✉ ${d.email}</div>` : ''}
                    ${d.phone ? `<div class="aside-item">✆ ${d.phone}</div>` : ''}
                    ${d.city ? `<div class="aside-item">⌖ ${d.city}</div>` : ''}
                    ${d.web ? `<div class="aside-item">⌘ ${d.web}</div>` : ''}
                </div>
                ${d.skills?.length ? `<div class="aside-sec"><span class="aside-ttl" style="color:${c}">Compétences</span>
                    ${d.skills.map(s => `<div class="skill-row"><div class="skill-nm">${s.nm || ''}</div>
                    <div class="skill-bg"><div class="skill-fill" style="width:${(s.lv || 3) * 20}%;background:${c}"></div></div></div>`).join('')}
                </div>` : ''}
                ${d.langs?.length ? `<div class="aside-sec"><span class="aside-ttl" style="color:${c}">Langues</span>
                    ${d.langs.map(l => `<div class="lang-row"><span class="lang-nm">${l.nm || ''}</span><span class="lang-lv">${l.lv || ''}</span></div>`).join('')}
                </div>` : ''}
                ${d.interests ? `<div class="aside-sec"><span class="aside-ttl" style="color:${c}">Intérêts</span><div class="interest">${d.interests}</div></div>` : ''}
            </div>
            <div class="cvm-main">
                ${d.summary ? `<div class="main-sec"><div class="main-ttl" style="color:${c};border-color:${c}">Profil</div><div class="summary">${d.summary}</div></div>` : ''}
                ${d.exp?.length ? `<div class="main-sec"><div class="main-ttl" style="color:${c};border-color:${c}">Expériences</div>
                    ${d.exp.map(e => `<div class="entry">
                    <div class="entry-h"><span class="entry-t">${e.pos || ''}</span><span class="entry-d">${[e.start, e.end].filter(Boolean).join(' — ')}</span></div>
                    <div class="entry-s" style="color:${c}">${e.org || ''}</div>
                    <div class="entry-x">${e.desc || ''}</div>
                    </div>`).join('')}</div>` : ''}
                ${d.edu?.length ? `<div class="main-sec"><div class="main-ttl" style="color:${c};border-color:${c}">Formation</div>
                    ${d.edu.map(e => `<div class="entry">
                    <div class="entry-h"><span class="entry-t">${e.deg || ''}</span><span class="entry-d">${[e.start, e.end].filter(Boolean).join(' — ')}</span></div>
                    <div class="entry-s" style="color:${c}">${e.sch || ''}</div>
                    </div>`).join('')}</div>` : ''}
            </div>
        </div>`;
    },

    exec(d, c) {
        const dot = n => [1, 2, 3, 4, 5].map(i => `<div class="dot" style="background:${i <= n ? c : '#e0e0ee'}"></div>`).join('');
        const ph = d.photo ? `<img src="${d.photo}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;border:2px solid ${c};margin-right:.9rem">` : '';
        return `<div class="cve">
            <div class="cve-hdr" style="border-color:${c}">
                <div style="display:flex;align-items:center">${ph}
                <div>
                    <div class="cve-name">${d.name || 'Votre Nom'}</div>
                    <div class="cve-job" style="color:${c}">${d.job || 'Titre professionnel'}</div>
                </div>
                </div>
                <div>
                    ${d.email ? `<div class="cve-ct">✉ ${d.email}</div>` : ''}
                    ${d.phone ? `<div class="cve-ct">✆ ${d.phone}</div>` : ''}
                    ${d.city ? `<div class="cve-ct">⌖ ${d.city}</div>` : ''}
                    ${d.web ? `<div class="cve-ct">⌘ ${d.web}</div>` : ''}
                </div>
            </div>
            <div class="cve-body">
                <div class="cve-main">
                    ${d.summary ? `<div class="cve-summary" style="border-color:${c}">${d.summary}</div>` : ''}
                    ${d.exp?.length ? `<div class="cve-sec"><div class="cve-ttl" style="color:${c}">Expériences</div>
                        ${d.exp.map(e => `<div class="cve-entry">
                        <div class="cve-entry-h"><span class="cve-entry-t">${e.pos || ''}</span><span class="cve-entry-d">${[e.start, e.end].filter(Boolean).join(' — ')}</span></div>
                        <div class="cve-entry-s" style="color:${c}">${e.org || ''}</div>
                        <div class="cve-entry-x">${e.desc || ''}</div>
                        </div>`).join('')}</div>` : ''}
                    ${d.edu?.length ? `<div class="cve-sec"><div class="cve-ttl" style="color:${c}">Formation</div>
                        ${d.edu.map(e => `<div class="cve-entry">
                        <div class="cve-entry-h"><span class="cve-entry-t">${e.deg || ''}</span><span class="cve-entry-d">${[e.start, e.end].filter(Boolean).join(' — ')}</span></div>
                        <div class="cve-entry-s" style="color:${c}">${e.sch || ''}</div>
                        </div>`).join('')}</div>` : ''}
                </div>
                <div class="cve-side">
                    ${d.skills?.length ? `<div class="cve-sec"><div class="cve-ttl" style="color:${c}">Compétences</div>
                        ${d.skills.map(s => `<div class="cve-sk"><div class="cve-sknm">${s.nm || ''}</div><div class="dots">${dot(Number(s.lv) || 3)}</div></div>`).join('')}</div>` : ''}
                    ${d.langs?.length ? `<div class="cve-sec"><div class="cve-ttl" style="color:${c}">Langues</div>
                        ${d.langs.map(l => `<div class="cve-lg"><span class="cve-lgnm">${l.nm || ''}</span><span class="cve-lglv" style="color:${c}">${l.lv || ''}</span></div>`).join('')}</div>` : ''}
                    ${d.interests ? `<div class="cve-sec"><div class="cve-ttl" style="color:${c}">Intérêts</div><div class="entry-x">${d.interests}</div></div>` : ''}
                </div>
            </div>
        </div>`;
    }
};

// ═══════════════════════════════════════════════
// UI & APP LOGIC fatim
// ═══════════════════════════════════════════════
let _zoom = 0.85;
const UI = {
    z(d) {
        _zoom = Math.min(Math.max(_zoom + d, .35), 1.2);
        const cv = document.getElementById('cv'); if (cv) cv.style.transform = `scale(${_zoom.toFixed(2)})`;
        const lbl = document.getElementById('zval'); if (lbl) lbl.textContent = Math.round(_zoom * 100) + '%';
    }
};

const App = {
    step(n) {
        document.querySelectorAll('.sc').forEach((el, i) => el.classList.toggle('on', i === n));
        document.querySelectorAll('.step').forEach((el, i) => el.classList.toggle('on', i === n));
        document.querySelector('.ebody').scrollTop = 0;
    },

    photo(e) {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => {
            PHOTO = ev.target.result;
            const img = document.getElementById('photo-img'), ph = document.getElementById('photo-ph');
            img.src = PHOTO; img.style.display = 'block'; if (ph) ph.style.display = 'none';
            Store.save();
        };
        r.readAsDataURL(f);
    },

    rmPhoto() {
        PHOTO = '';
        const img = document.getElementById('photo-img'), ph = document.getElementById('photo-ph');
        if (img) { img.src = ''; img.style.display = 'none'; } if (ph) ph.style.display = '';
        document.getElementById('photo-input').value = '';
        Store.save();
    },

    reset() {
        if (!confirm('Réinitialiser toutes les données ?')) return;
        Store.clear(); location.reload();
    },

    init() {
        const d = Store.load();
        Store.restore(d);
        Style.restoreAll(d.tpl, d.color);

        document.querySelectorAll('.step').forEach(btn => {
            btn.onclick = () => App.step(parseInt(btn.dataset.i));
        });

        if (d.photo) {
            PHOTO = d.photo;
            const img = document.getElementById('photo-img'), ph = document.getElementById('photo-ph');
            img.src = d.photo; img.style.display = 'block'; if (ph) ph.style.display = 'none';
        }
        (d.exp || []).forEach(e => Dyn.exp(e));
        (d.edu || []).forEach(e => Dyn.edu(e));
        (d.skills || []).forEach(s => Dyn.skill(s));
        (d.langs || []).forEach(l => Dyn.lang(l));
        
        document.getElementById('cv').style.transform = `scale(${_zoom})`;
        
        if (!d.name) this._demo(); 
        else Render.draw(d); 
    },

    _demo() {
        S('f-name', 'Fatou Diallo'); S('f-job', 'Développeuse Full Stack');
        S('f-email', 'fatou.diallo@example.com'); S('f-phone', '77 234 56 78');
        S('f-city', 'Dakar, Sénégal'); S('f-web', 'linkedin.com/in/fatoudiallo');
        S('f-summary', 'Développeuse passionnée avec 4 ans d\'expérience. Spécialisée en React et Node.js.');
        S('f-interests', 'Open source · Voyages · Photographie');
        Dyn.exp({ pos: 'Développeuse Full Stack', org: 'Orange Digital Center', start: 'Jan 2022', end: 'Présent', desc: 'Développement React/Node.js.' });
        Dyn.edu({ deg: 'Master Génie Logiciel', sch: 'UCAD — École Polytechnique', start: '2018', end: '2021' });
        Dyn.skill({ nm: 'React / Next.js', lv: 5 }); Dyn.skill({ nm: 'Node.js', lv: 4 });
        Dyn.lang({ nm: 'Français', lv: 'Bilingue' }); Dyn.lang({ nm: 'Anglais', lv: 'Courant' });
        Store.save();
    }
};

const PDF = {
    go() {
        const el = document.getElementById('cv'); if (!el) return;
        const bk = el.style.transform; el.style.transform = 'scale(1)';
        html2pdf().set({
            margin: 0, filename: (G('f-name') || 'cv').replace(/\s/g, '_') + '_CV.pdf',
            image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
            .from(el).save().then(() => { el.style.transform = bk; toast('PDF téléchargé !', 'ok'); });
    }
};

const Server = {
    async save() {
        try {
            const r = await fetch('api/save.php?action=save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(Store.collect())
            });
            const j = await r.json();
            toast(j.success ? 'Sauvegardé sur le serveur' : 'Erreur serveur', j.success ? 'ok' : 'err');
        } catch { toast('Mode local — PHP non disponible', 'info'); }
    }
};

const Validate = {
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    phone: v => /^(\+221)?(7[05678]\d{7}|3[03]\d{7})$/.test(v.replace(/[\s\-]/g,'')),

    fld(id, fn, msg){
        const el=document.getElementById(id), er=document.getElementById('err-'+id.slice(2));
        if(!el) return true;
        const ok=fn(el.value.trim());
        if(er) er.textContent=ok?'':msg;
        el.style.borderColor=ok?'':'var(--er)';
        return ok;
    },

    all(){
        let ok=true;
        ok=this.fld('f-name', v=>v.length>=2, 'Nom requis (min. 2 caractères)')&&ok;
        ok=this.fld('f-email',v=>this.email(v), 'Adresse email invalide')&&ok;
        ok=this.fld('f-phone',v=>this.phone(v), 'Format sénégalais : 77 123 45 67')&&ok;
        if(ok){ Store.save(); toast('✓ CV généré avec succès !','ok'); }
        else { App.step(0); toast('Corrigez les erreurs en rouge','err'); }
        return ok;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());