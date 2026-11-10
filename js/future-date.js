// Asks for confirmation when a record date (YYYY-MM-DD or ISO string) is after today.
function confirmFutureDate(dateValue) {
    if (!dateValue) return true;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    // The date part of the value is what the user picked, so compare it as text
    if (String(dateValue).slice(0, 10) <= today) return true;
    return confirm('La fecha del registro es futura. ¿Deseas continuar de todos modos?');
}
