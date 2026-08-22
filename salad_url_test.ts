// Salad Cloud - Streaming Chat API Tests
// Run: npx ts-node salad_url_test.ts
//
// Endpoint 1: olive-paprika  -> llama3.2:1b      -> Ollama NDJSON format
// Endpoint 2: loganberry-alfalfa -> Tesleum/Claude-OSS -> OpenAI SSE format

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SHARED_API_KEY =
  "salad_cloud_user_X6l6HuAV3XhExToHyjoXdU0ubbRiEoHhQpzJgO7U79Q4gIzYo";

const ENDPOINT_LLAMA =
  "https://olive-paprika-pyvw9m4abf7dthbu.salad.cloud/api/chat";

const ENDPOINT_CLAUDE =
  "https://loganberry-alfalfa-c99f0nm5oszaje7g.salad.cloud/api/chat";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

/** Ollama NDJSON chunk (endpoint 1 - llama) */
interface OllamaChatChunk {
  model: string;
  created_at: string;
  message: { role: string; content: string };
  done: boolean;
  done_reason?: string;
  total_duration?: number;
  eval_count?: number;
}

/** OpenAI SSE chunk (endpoint 2 - Claude-OSS) */
interface OpenAIChatChunk {
  id?: string;
  object?: string;
  model?: string;
  choices?: Array<{
    index?: number;
    delta?: { role?: string; content?: string };
    finish_reason?: string | null;
  }>;
}

// ---------------------------------------------------------------------------
// Shared streaming reader
// ---------------------------------------------------------------------------

/**
 * Reads a ReadableStream line by line, yielding each complete line.
 * Correctly handles lines that are split across TCP chunks.
 */
async function* readLines(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder("utf-8");
  let leftover = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = leftover + decoder.decode(value, { stream: true });
      const lines = text.split("\n");
      leftover = lines.pop() ?? "";

      for (const line of lines) {
        if (line.trim()) yield line;
      }
    }
    if (leftover.trim()) yield leftover;
  } finally {
    reader.releaseLock();
  }
}

// ---------------------------------------------------------------------------
// Endpoint 1: llama3.2:1b via Ollama NDJSON
// ---------------------------------------------------------------------------

/**
 * Calls the Salad Cloud Ollama-compatible endpoint (olive-paprika).
 * Response format: NDJSON - one raw JSON object per line (no "data:" prefix).
 *
 * @param userMessage  The user prompt to send.
 * @param model        Ollama model name (default: llama3.2:1b).
 * @param maxTokens    Max tokens to generate (default: 128).
 * @returns            The full assistant reply as a string.
 */
async function testSaladChatStream(
  userMessage = "What is deep learning?",
  model = "llama3.2:1b",
  maxTokens = 128
): Promise<string> {
  const body = {
    model,
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ],
    stream: true,
    max_tokens: maxTokens,
  };

  console.log("\n" + "=".repeat(60));
  console.log("TEST 1 - Ollama NDJSON  |  llama3.2:1b");
  console.log("=".repeat(60));
  console.log(`Endpoint : ${ENDPOINT_LLAMA}`);
  console.log(`Model    : ${model}`);
  console.log(`Prompt   : ${userMessage}`);
  console.log("-".repeat(60));
  console.log("Response:\n");

  const response = await fetch(ENDPOINT_LLAMA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Salad-Api-Key": SHARED_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HTTP ${response.status} ${response.statusText}\n${err}`);
  }
  if (!response.body) throw new Error("Response body is null.");

  let fullText = "";

  for await (const line of readLines(response.body)) {
    try {
      const chunk: OllamaChatChunk = JSON.parse(line.trim());
      const token = chunk.message?.content ?? "";

      if (token) {
        process.stdout.write(token);
        fullText += token;
      }

      if (chunk.done) {
        const secs = ((chunk.total_duration ?? 0) / 1e9).toFixed(2);
        console.log("\n" + "-".repeat(60));
        console.log(`Done reason : ${chunk.done_reason ?? "stop"}`);
        console.log(`Tokens gen  : ${chunk.eval_count ?? "?"}`);
        console.log(`Duration    : ${secs}s`);
      }
    } catch {
      // skip malformed lines
    }
  }

  console.log(`Total chars : ${fullText.length}`);
  console.log("=".repeat(60));
  return fullText;
}

// ---------------------------------------------------------------------------
// Endpoint 2: Tesleum/Claude-OSS via OpenAI-compatible SSE
// ---------------------------------------------------------------------------

/**
 * Calls the Salad Cloud OpenAI-compatible endpoint (loganberry-alfalfa).
 * Response format: Server-Sent Events with "data: {...}" prefix per line.
 *
 * @param userMessage  The user prompt to send.
 * @param model        Model name (default: Tesleum/Claude-OSS).
 * @param maxTokens    Max tokens to generate (default: 128).
 * @returns            The full assistant reply as a string.
 */
async function testSaladClaudeStream(
  userMessage = "What is deep learning?",
  model = "Tesleum/Claude-OSS",
  maxTokens = 128
): Promise<string> {
  const body = {
    model,
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ],
    stream: true,
    max_tokens: maxTokens,
  };

  console.log("\n" + "=".repeat(60));
  console.log("TEST 2 - OpenAI SSE  |  Tesleum/Claude-OSS");
  console.log("=".repeat(60));
  console.log(`Endpoint : ${ENDPOINT_CLAUDE}`);
  console.log(`Model    : ${model}`);
  console.log(`Prompt   : ${userMessage}`);
  console.log("-".repeat(60));
  console.log("Response:\n");

  const response = await fetch(ENDPOINT_CLAUDE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Salad-Api-Key": SHARED_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HTTP ${response.status} ${response.statusText}\n${err}`);
  }
  if (!response.body) throw new Error("Response body is null.");

  let fullText = "";

  for await (const line of readLines(response.body)) {
    const trimmed = line.trim();

    // OpenAI SSE stream end sentinel
    if (trimmed === "data: [DONE]") break;

    if (trimmed.startsWith("data: ")) {
      const jsonStr = trimmed.slice("data: ".length);
      try {
        const chunk: OpenAIChatChunk = JSON.parse(jsonStr);
        const token = chunk.choices?.[0]?.delta?.content ?? "";
        if (token) {
          process.stdout.write(token);
          fullText += token;
        }
        if (chunk.choices?.[0]?.finish_reason) {
          console.log("\n" + "-".repeat(60));
          console.log(`Finish reason : ${chunk.choices[0].finish_reason}`);
        }
      } catch {
        // skip malformed SSE lines
      }
    }
  }

  console.log(`Total chars : ${fullText.length}`);
  console.log("=".repeat(60));
  return fullText;
}

// ---------------------------------------------------------------------------
// Run both tests sequentially (independent - one failure won't abort the other)
// ---------------------------------------------------------------------------

async function runAll() {
  let anyFailed = false;

  // Test 1 - Ollama NDJSON / llama3.2:1b
  try {
    const result1 = await testSaladChatStream();
    if (!result1.trim()) {
      console.warn("WARNING: Test 1 returned empty response.");
      anyFailed = true;
    }
  } catch (err: any) {
    console.error(`\nTest 1 FAILED: ${err.message ?? err}`);
    anyFailed = true;
  }

  // Test 2 - OpenAI SSE / Tesleum/Claude-OSS
  try {
    const result2 = await testSaladClaudeStream();
    if (!result2.trim()) {
      console.warn("WARNING: Test 2 returned empty response.");
      anyFailed = true;
    }
  } catch (err: any) {
    console.error(`\nTest 2 FAILED: ${err.message ?? err}`);
    anyFailed = true;
  }

  console.log("\n" + "=".repeat(60));
  console.log(anyFailed ? "Some tests FAILED." : "All tests PASSED.");
  console.log("=".repeat(60));

  if (anyFailed) process.exit(1);
}

runAll();

