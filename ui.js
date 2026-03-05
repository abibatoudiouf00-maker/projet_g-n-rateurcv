
const UI = (() => {

  function createDynamicItem(containerId, type, fieldsConfig, onUpdate) {
    const container = document.getElementById(containerId);
    const id = Date.now(); 

   
    const newItem = { id };
    fieldsConfig.forEach(f => newItem[f.name] = '');
    if (type === 'competence') newItem.niveau = 3;
    
    const currentData = CVData.get();
    if (type === 'experience') currentData.experiences.push(newItem);
    if (type === 'formation') currentData.formations.push(newItem);
    if (type === 'competence') currentData.competences.push(newItem);
    if (type === 'langue') currentData.langues.push(newItem);

    const itemDiv = document.createElement('div');
    itemDiv.className = 'dynamic-item is-editing';
    itemDiv.id = `item-${id}`;

    let inputsHtml = fieldsConfig.map(f => {
      if (f.type === 'textarea') {
        return `<div class="form-group"><label>${f.label}</label><textarea placeholder="${f.placeholder}" oninput="UI.updateSubItem('${type}', ${id}, '${f.name}', this.value)"></textarea></div>`;
      }
      return `<div class="form-group"><label>${f.label}</label><input type="${f.type}" placeholder="${f.placeholder}" oninput="UI.updateSubItem('${type}', ${id}, '${f.name}', this.value)"></div>`;
    }).join('');

    itemDiv.innerHTML = `
      <div class="dynamic-item-form">
        <div class="form-row" style="grid-template-columns: 1fr 1fr;">${inputsHtml}</div>
        <button class="btn btn-danger btn-sm" onclick="UI.removeSubItem('${type}', ${id})">🗑 Supprimer</button>
      </div>
    `;

    container.appendChild(itemDiv);
    App.refreshPreview();
  }

  return {
    
    initTabs: () => {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
      });
    },

    
    initExperiences: () => {
      document.getElementById('add-experience').addEventListener('click', () => {
        createDynamicItem('experiences-list', 'experience', [
          { name: 'poste', label: 'Poste', type: 'text', placeholder: 'ex: Développeur PHP' },
          { name: 'entreprise', label: 'Entreprise', type: 'text', placeholder: 'ex: Orange SN' },
          { name: 'dateDebut', label: 'Début', type: 'text', placeholder: 'MM/AAAA' },
          { name: 'dateFin', label: 'Fin', type: 'text', placeholder: 'Présent' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Détaillez vos missions...' }
        ]);
      });
    },

   
    initFormations: () => {
      document.getElementById('add-formation').addEventListener('click', () => {
        createDynamicItem('formations-list', 'formation', [
          { name: 'diplome', label: 'Diplôme', type: 'text', placeholder: 'ex: Master Informatique' },
          { name: 'etablissement', label: 'Établissement', type: 'text', placeholder: 'ex: UCAD' },
          { name: 'dateDebut', label: 'Début', type: 'text', placeholder: '2020' },
          { name: 'dateFin', label: 'Fin', type: 'text', placeholder: '2022' }
        ]);
      });
    },

   
    initCompetences: () => {
        document.getElementById('add-competence').addEventListener('click', () => {
            const container = document.getElementById('competences-list');
            const id = Date.now();
            const newItem = { id, nom: '', niveau: 3 };
            CVData.get().competences.push(newItem);

            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.id = `item-${id}`;
            div.innerHTML = `
                <div class="competence-row" style="padding:10px; display:flex; gap:10px; align-items:center;">
                    <input type="text" class="comp-nom" placeholder="Compétence" oninput="UI.updateSubItem('competence', ${id}, 'nom', this.value)">
                    <select onchange="UI.updateSubItem('competence', ${id}, 'niveau', this.value)">
                        <option value="1">Débutant</option>
                        <option value="2">Élémentaire</option>
                        <option value="3" selected>Intermédiaire</option>
                        <option value="4">Avancé</option>
                        <option value="5">Expert</option>
                    </select>
                    <button class="btn-icon" onclick="UI.removeSubItem('competence', ${id})">🗑</button>
                </div>
            `;
            container.appendChild(div);
        });
    },

   
    updateSubItem: (type, id, field, value) => {
      const list = type === 'experience' ? CVData.get().experiences : 
                   type === 'formation' ? CVData.get().formations : 
                   type === 'competence' ? CVData.get().competences : [];
      
      const item = list.find(i => i.id === id);
      if (item) {
        item[field] = value;
        CVData.save();
        App.refreshPreview();
      }
    },

    removeSubItem: (type, id) => {
      const data = CVData.get();
      if (type === 'experience') data.experiences = data.experiences.filter(i => i.id !== id);
      if (type === 'formation') data.formations = data.formations.filter(i => i.id !== id);
      if (type === 'competence') data.competences = data.competences.filter(i => i.id !== id);
      
      document.getElementById(`item-${id}`).remove();
      CVData.save();
      App.refreshPreview();
    },

    initPhotoUpload: () => { },
    initLangues: () => {  },
    initInterets: () => {  },
    initTemplateSelector: () => {
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                CVData.get().template = card.dataset.template;
                CVData.save();
                App.refreshPreview();
            });
        });
    }
  };
})();