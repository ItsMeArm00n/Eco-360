'use server';

// PLACEHOLDER / DEMO MODE
// This bypasses the actual AI verification to ensure the user flow works smoothly.
// It will always return "verified" regardless of the image content.

export async function verifyChallenge(imageBase64: string, challengeTitle: string, challengeDesc: string) {
  console.log(`[Mock Verify] Processing verification for: ${challengeTitle}`);
  
  // Simulate a short network delay to make it feel realistic
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log("[Mock Verify] Auto-verifying image.");

  // Return a success object structure identical to what the AI would return
  return {
    verified: true,
    reason: "Great shot! verification successful (Demo).",
    confidence: 0.99
  };
}
