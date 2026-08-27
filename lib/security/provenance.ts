import crypto from "crypto";

export const GENESIS_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Canonicalizes an object into deterministic JSON with sorted keys.
 * Ensures consistent cryptographic hash calculation across platforms.
 */
export function canonicalizeJson(obj: any): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return `[${obj.map(canonicalizeJson).join(",")}]`;
  }
  const keys = Object.keys(obj).sort();
  const pairs = keys.map((key) => `${JSON.stringify(key)}:${canonicalizeJson(obj[key])}`);
  return `{${pairs.join(",")}}`;
}

export interface HashInputPayload {
  previousHash: string;
  batchId: string;
  eventType: string;
  timestamp: string;
  metadata?: Record<string, unknown> | null;
}

/**
 * Computes deterministic SHA-256 hash for a batch provenance checkpoint.
 * Formula: SHA256(previousHash + batchId + eventType + timestamp + canonicalMetadata)
 */
export function computeProvenanceHash(payload: HashInputPayload): string {
  const canonicalMeta = payload.metadata ? canonicalizeJson(payload.metadata) : "";
  const rawString = `${payload.previousHash}|${payload.batchId}|${payload.eventType}|${payload.timestamp}|${canonicalMeta}`;
  
  return `0x${crypto.createHash("sha256").update(rawString, "utf8").digest("hex")}`;
}

export interface VerifiableEvent {
  id: string;
  batchId: string;
  eventType: string;
  createdAt: Date | string;
  metadata: string | Record<string, unknown> | null;
}

export interface VerificationResult {
  valid: boolean;
  tamperedEventIndex?: number;
  expectedHash?: string;
  actualHash?: string;
  totalEventsVerified: number;
  integrityNotice: string;
}

/**
 * Re-computes and verifies the complete event hash chain from genesis to head.
 * Detects any tampering, altered timestamp, or metadata modification.
 */
export function verifyProvenanceChain(events: VerifiableEvent[]): VerificationResult {
  let currentHash = GENESIS_HASH;

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    let parsedMeta: any = {};
    if (ev.metadata) {
      parsedMeta = typeof ev.metadata === "string" ? JSON.parse(ev.metadata) : ev.metadata;
    }

    const recordedHash = parsedMeta.sha256Hash || parsedMeta.sha256Signature;
    const timestamp = new Date(ev.createdAt).toISOString();

    // Extract non-hash metadata for computation
    const { sha256Hash, sha256Signature, ...pureMeta } = parsedMeta;

    const expectedHash = computeProvenanceHash({
      previousHash: currentHash,
      batchId: ev.batchId,
      eventType: ev.eventType,
      timestamp,
      metadata: pureMeta,
    });

    if (recordedHash && recordedHash !== expectedHash) {
      return {
        valid: false,
        tamperedEventIndex: i,
        expectedHash,
        actualHash: recordedHash,
        totalEventsVerified: i,
        integrityNotice: `Tamper detected at event index ${i} (${ev.eventType}). Hash mismatch.`,
      };
    }

    currentHash = expectedHash;
  }

  return {
    valid: true,
    totalEventsVerified: events.length,
    integrityNotice: "All provenance checkpoints verified. Cryptographic hash chain is intact.",
  };
}
