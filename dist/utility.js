"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMessageId = exports.convertStringToMongoID = exports.getTodayDate = void 0;
const dayjs = require("dayjs");
const mongoose = require("mongoose");
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
const uuid_1 = require("uuid");
const getTodayDate = () => {
    const today = dayjs().format("llll");
    return today;
};
exports.getTodayDate = getTodayDate;
const convertStringToMongoID = (id) => {
    return new mongoose.Types.ObjectId(id);
};
exports.convertStringToMongoID = convertStringToMongoID;
const generateMessageId = () => {
    return (0, uuid_1.v4)();
};
exports.generateMessageId = generateMessageId;
//# sourceMappingURL=utility.js.map