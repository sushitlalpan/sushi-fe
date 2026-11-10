// Info icon + modal showing record metadata. Fields that are missing on the record are hidden.
const RowInfo = (function () {
    const FIELDS = [
        { key: 'createUser', label: 'Creado por' },
        { key: 'createdAt', label: 'Fecha de creación', date: true },
        { key: 'lastUpdatedUser', label: 'Actualizado por' },
        { key: 'lastUpdatedAt', label: 'Última actualización', date: true }
    ];

    let overlay = null;

    function formatDate(value) {
        const date = new Date(value);
        if (isNaN(date.getTime())) return String(value);
        return date.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
    }

    function close() {
        if (overlay) overlay.hidden = true;
    }

    function ensureModal() {
        if (overlay) return;
        overlay = document.createElement('div');
        overlay.className = 'info-modal-overlay';
        overlay.hidden = true;
        overlay.innerHTML = `
            <div class="info-modal" role="dialog" aria-modal="true" aria-labelledby="infoModalTitle">
                <div class="info-modal-header">
                    <h3 id="infoModalTitle">Información del registro</h3>
                    <button type="button" class="info-modal-close" aria-label="Cerrar">&times;</button>
                </div>
                <dl class="info-modal-body"></dl>
            </div>`;
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
        overlay.querySelector('.info-modal-close').addEventListener('click', close);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
        document.body.appendChild(overlay);
    }

    function open(meta) {
        ensureModal();
        const body = overlay.querySelector('.info-modal-body');
        body.innerHTML = '';
        let shown = 0;
        FIELDS.forEach(field => {
            const value = meta[field.key];
            if (value === undefined || value === null || value === '') return;
            const dt = document.createElement('dt');
            dt.textContent = field.label;
            const dd = document.createElement('dd');
            dd.textContent = field.date ? formatDate(value) : value;
            body.append(dt, dd);
            shown++;
        });
        if (shown === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'No hay información disponible para este registro.';
            body.appendChild(empty);
        }
        overlay.hidden = false;
    }

    // meta: { createUser, createdAt, lastUpdatedUser, lastUpdatedAt }
    function createButton(meta) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'info-btn';
        button.title = 'Ver información del registro';
        button.setAttribute('aria-label', 'Ver información del registro');
        button.textContent = 'ℹ️';
        button.addEventListener('click', () => open(meta));
        return button;
    }

    return { createButton };
})();
