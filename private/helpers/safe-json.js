export function safeJson(obj) {
    if (!obj) return 'null';
    return JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>');
}