"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = handleErrors;
const common_1 = require("@nestjs/common");
async function handleErrors(operation, context = '') {
    try {
        return await operation;
    }
    catch (error) {
        console.error(`Error in ${context}:`, error);
        if (error.response) {
            throw new common_1.HttpException(error.response.data?.message || 'API Request Failed', common_1.HttpStatus.BAD_GATEWAY);
        }
        throw new common_1.HttpException(`Internal server error during ${context}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
//# sourceMappingURL=handleErrors.js.map