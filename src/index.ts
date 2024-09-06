import "dotenv/config";
import "./tracing";

import Translator from "@azure-rest/ai-translation-document";
import { DefaultAzureCredential } from "@azure/identity";

import { trace, context } from "@opentelemetry/api";

const client = Translator(
  process.env.TRANSLATOR_ENDPOINT!,
  new DefaultAzureCredential()
);

async function main() {
  const tracer = trace.getTracer("main");
  await tracer.startActiveSpan("main", async (span) => {
    span.setAttribute("customAttribute", "customValue");

    const formats = await client
      .path("/document/formats")
      .get({ tracingOptions: { tracingContext: context.active() } });
    console.log({ formats });
  });
}

main().catch((err) => {
  console.error("Error running sample:", err);
});
