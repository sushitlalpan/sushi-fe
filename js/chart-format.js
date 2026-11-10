// Fixed 20-color palette: the original 8 colors, then darker and lighter shades of them
const CHART_COLORS = [
    '#e94a7e', '#f0d44c', '#41c5d3', '#9b59b6', '#3498db', '#e67e22', '#2ecc71', '#e74c3c',
    '#ce193c', '#ddd513', '#2685a2', '#7b3b87', '#1d5da5', '#a86d13', '#208e5d', '#bf3e18',
    '#f18ab9', '#f6d68e', '#7be0dd', '#b08bcc'
];

// Limits numbers shown on chart axes to two decimal places. Must load after Chart.js.
(function () {
    const format = value => Number(value).toLocaleString('es-MX', { maximumFractionDigits: 2 });
    ['linear', 'radialLinear'].forEach(scale => {
        if (Chart.defaults.scales[scale]) Chart.defaults.scales[scale].ticks.callback = format;
    });
})();
