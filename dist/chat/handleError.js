"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
function handleError(client, message, error, type, payload) {
    console.error(message, error?.message);
    client.emit('error', { message, name: type, payload });
    client.disconnect(true);
}
//# sourceMappingURL=handleError.js.map