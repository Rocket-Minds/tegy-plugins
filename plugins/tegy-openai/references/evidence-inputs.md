# Evidence inputs

Only attach material the user explicitly selected for this Tegy analysis.
Never send surrounding chat history, unrelated files, hidden host context, or
an entire directory.

## Exact text

For explicit text evidence, call `Tegy:add_context` with the exact UTF-8 text,
name, MIME type, chat id, and an opaque idempotency key. Retain the returned
context id for `Tegy:start_turn`. Do not claim the source file itself was
preserved when the host supplied only extracted text.

## Exact local bytes

Use this route only when the current host can access the exact local file bytes
and the user explicitly selected that file.

1. Resolve one exact file path. Do not expand a directory or wildcard.
2. Compute its byte length and lowercase SHA-256 locally without printing file
   contents.
3. Call `Tegy:create_upload` with that exact length, digest, file name, MIME
   type, chat id, and an opaque idempotency key.
4. Send one HTTP `PUT` to the returned one-use URL with exact
   `Content-Type`, `Content-Length`, and raw file bytes. Treat the URL like a
   credential: never print it, persist it, place it in a report, or reuse it.
5. Call `Tegy:get_upload`. Only a `completed` result may be supplied to
   `Tegy:start_turn` as an attachment id.

In a local shell host, ordinary `sha256sum`, `wc -c`, and a non-verbose
`curl --fail --silent --show-error --request PUT --header ... --data-binary
@FILE URL` are sufficient. Quote the resolved path and URL; never interpolate
untrusted prose as shell syntax.

If the host cannot access raw bytes, do not claim an exact-file upload. Ask the
user to provide exact text for `Tegy:add_context`, use Tegy's website upload,
or run the workflow from a local host such as Codex or Claude Code.
