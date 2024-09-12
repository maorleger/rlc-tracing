const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const {
  createAzureSdkInstrumentation,
} = require("@azure/opentelemetry-instrumentation-azure-sdk");

// Set-up and configure a Node Tracer Provider using OpenTelemetry
const opentelemetry = require("@opentelemetry/api");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} = require("@opentelemetry/tracing");

const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

registerInstrumentations({
  instrumentations: [createAzureSdkInstrumentation()],
});

console.log("Tracing initialized");
