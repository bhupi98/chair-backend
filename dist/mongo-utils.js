"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMongoOperation = handleMongoOperation;
async function handleMongoOperation(operation, errorMessage) {
    try {
        return await operation;
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            console.error('MongoDB Validation Error:', error.message);
        }
        else if (error.name === 'CastError') {
            console.error('MongoDB Cast Error:', error.message);
        }
        else {
            console.error(`${errorMessage}:`, error.message);
        }
        throw new Error(errorMessage);
    }
}
//# sourceMappingURL=mongo-utils.js.map