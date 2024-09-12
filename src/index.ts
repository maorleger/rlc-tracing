import "dotenv/config";
import "./tracing";

import Translator, { isUnexpected } from "@azure-rest/ai-translation-document";
import { DefaultAzureCredential } from "@azure/identity";

import { trace, context } from "@opentelemetry/api";

const client = Translator(
  process.env.TRANSLATOR_ENDPOINT!,
  new DefaultAzureCredential()
);

/**
 * Demonstrates using OpenTelemetry with a wrapper span
 */
function withWrapperSpan() {
  // As an end user I create a wrapper span
  const tracer = trace.getTracer("main");
  return tracer.startActiveSpan("main", async (span) => {
    const formats = await client.path("/document/formats").get(); // parent span will be automatically propagated
    if (isUnexpected(formats)) {
      throw new Error("Unexpected response");
    }

    span.end();
  });
}

function withManualSpanPropagation() {
  // Without a wrapper span, you can still pass the active context
  return client
    .path("/document/formats")
    .get({ tracingOptions: { tracingContext: context.active() } });
}

function basicTracing() {
  // Or using automatic span propagation (no need to pass anything)
  return client.path("/document/formats").get();
}

async function main() {
  await basicTracing();
  await withManualSpanPropagation();
  await withWrapperSpan();
}

main().catch((err) => {
  console.error("Error running sample:", err);
});
