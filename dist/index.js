"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./tracing");
const ai_translation_document_1 = __importDefault(require("@azure-rest/ai-translation-document"));
const identity_1 = require("@azure/identity");
const api_1 = require("@opentelemetry/api");
const client = (0, ai_translation_document_1.default)(process.env.TRANSLATOR_ENDPOINT, new identity_1.DefaultAzureCredential());
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const tracer = api_1.trace.getTracer("main");
        yield tracer.startActiveSpan("main", (span) => __awaiter(this, void 0, void 0, function* () {
            span.setAttribute("customAttribute", "customValue");
            const formats = yield client
                .path("/document/formats")
                .get({ tracingOptions: { tracingContext: api_1.context.active() } });
            console.log({ formats });
        }));
    });
}
main().catch((err) => {
    console.error("Error running sample:", err);
});
