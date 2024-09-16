"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessError = void 0;
exports.BusinessLogicException = BusinessLogicException;
function BusinessLogicException(message, type) {
    this.message = message;
    this.type = type;
}
var BusinessError;
(function (BusinessError) {
    BusinessError[BusinessError["NOT_FOUND"] = 0] = "NOT_FOUND";
    BusinessError[BusinessError["PRECONDITION_FAILED"] = 1] = "PRECONDITION_FAILED";
    BusinessError[BusinessError["BAD_REQUEST"] = 2] = "BAD_REQUEST";
})(BusinessError || (exports.BusinessError = BusinessError = {}));
//# sourceMappingURL=business-errors.js.map