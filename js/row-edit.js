// Inline row editing for the table pages (superadmin only). Only one row can be edited at a time.
const RowEdit = (function () {
    let editingId = null;

    function isEditing() {
        return editingId !== null;
    }

    // Call before any action that would re-render or reload the table
    function guard() {
        if (!isEditing()) return true;
        alert('Guarda los cambios de la fila en edición antes de continuar.');
        return false;
    }

    function reset() {
        editingId = null;
    }

    function dateValue(value) {
        return value ? String(value).slice(0, 10) : '';
    }

    function lockOtherControls(tbody, rowEl) {
        tbody.querySelectorAll('button, input, select').forEach(el => {
            const keep = rowEl.contains(el) && (el.classList.contains('row-edit-input') || el.classList.contains('branch-select') || el.classList.contains('edit-btn'));
            if (!keep && !el.classList.contains('info-btn')) el.disabled = true;
        });
    }

    function buildPayload(rowEl, rowData, config) {
        const payload = {};
        config.fields.forEach(field => {
            const input = rowEl.querySelector(`.row-edit-input[data-field="${field.api}"]`);
            if (!input) return;
            const original = rowData[field.key];
            if (field.type === 'number') {
                if (input.value === '') return;
                const value = Number(input.value);
                if (value !== Number(original || 0)) payload[field.api] = value;
            } else if (field.type === 'date') {
                if (input.value && input.value !== dateValue(original)) payload[field.api] = input.value;
            } else if (input.value !== String(original ?? '')) {
                payload[field.api] = input.value;
            }
        });
        const branchSelect = rowEl.querySelector('.branch-select');
        if (branchSelect && branchSelect.value && String(branchSelect.value) !== String(rowData.branchId)) {
            payload.branch_id = branchSelect.value;
        }
        return payload;
    }

    // config: { columnOffset, fields: [{ col, key, api, type: 'text'|'number'|'date', step }], save(id, payload), onSaved(), tbody }
    function createEditButton(rowEl, rowData, config) {
        const button = document.createElement('button');
        button.textContent = 'Editar';
        button.className = 'edit-btn';
        button.disabled = isEditing();
        let cancelBtn = null;

        async function save() {
            const payload = buildPayload(rowEl, rowData, config);
            if (Object.keys(payload).length === 0) {
                // Nothing changed: skip the API call so metadata isn't touched
                reset();
                config.onCancel();
                return;
            }
            const dateField = config.fields.find(field => field.type === 'date' && payload[field.api]);
            if (dateField && !confirmFutureDate(payload[dateField.api])) return;
            button.disabled = true;
            if (cancelBtn) cancelBtn.disabled = true;
            button.textContent = 'Guardando...';
            try {
                await config.save(rowData.id, payload);
                reset();
                await config.onSaved();
            } catch (error) {
                console.error('Error saving row:', error);
                alert(`Error al guardar los cambios: ${error.message || error}`);
                button.disabled = false;
                if (cancelBtn) cancelBtn.disabled = false;
                button.textContent = 'Guardar';
            }
        }

        function startEdit() {
            editingId = rowData.id;
            config.fields.forEach(field => {
                const cell = rowEl.cells[config.columnOffset + field.col];
                if (!cell) return;
                const input = document.createElement('input');
                input.className = 'row-edit-input';
                input.type = field.type;
                input.dataset.field = field.api;
                if (field.type === 'number') input.step = field.step || 'any';
                const original = rowData[field.key];
                input.value = field.type === 'date' ? dateValue(original) : (original ?? '');
                cell.textContent = '';
                cell.appendChild(input);
            });
            lockOtherControls(config.tbody, rowEl);

            // Swap the delete button for a cancel button while editing
            const deleteBtn = rowEl.querySelector('.delete-btn');
            if (deleteBtn) {
                cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancelar';
                cancelBtn.className = 'cancel-btn';
                cancelBtn.onclick = () => {
                    reset();
                    config.onCancel();
                };
                deleteBtn.replaceWith(cancelBtn);
            }

            button.textContent = 'Guardar';
            button.className = 'edit-btn save-btn';
            button.disabled = false;
            button.onclick = save;
        }

        button.onclick = startEdit;
        return button;
    }

    // Shows a save icon inside the observation cell only while the input differs from the last saved value
    function attachObservationSave(cell, input, onSave) {
        let savedValue = input.value;
        const icon = document.createElement('span');
        icon.className = 'obs-save-icon';
        icon.textContent = '💾';
        icon.title = 'Guardar observación';
        icon.hidden = true;
        cell.appendChild(icon);

        input.addEventListener('input', () => {
            icon.hidden = input.value === savedValue;
            cell.classList.toggle('has-save', !icon.hidden);
        });

        icon.addEventListener('click', async () => {
            if (isEditing() || icon.classList.contains('saving')) return;
            icon.classList.add('saving');
            try {
                await onSave(input.value);
                savedValue = input.value;
                icon.hidden = true;
                cell.classList.remove('has-save');
            } catch (error) {
                console.error('Error updating observation:', error);
                alert('Error al guardar la observación');
            } finally {
                icon.classList.remove('saving');
            }
        });
    }

    return { isEditing, guard, reset, createEditButton, attachObservationSave };
})();
