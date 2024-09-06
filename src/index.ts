import "dotenv/config";
import "./tracing";

import Translator, { isUnexpected } from "@azure-rest/ai-translation-document";
import { DefaultAzureCredential } from "@azure/identity";

import { trace, context } from "@opentelemetry/api";

const client = Translator(
  process.env.TRANSLATOR_ENDPOINT!,
  new DefaultAzureCredential()
);

async function main() {
  const tracer = trace.getTracer("main");
  await tracer.startActiveSpan("main", async (span) => {
    const formats = await client
      .path("/document/formats")
      .get({ tracingOptions: { tracingContext: context.active() } });
    if (isUnexpected(formats)) {
      throw new Error("Unexpected response");
    }

    span.end();
  });
}

main().catch((err) => {
  console.error("Error running sample:", err);
});
