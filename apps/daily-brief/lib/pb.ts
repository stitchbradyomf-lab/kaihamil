import PocketBase from "pocketbase"

// Each call creates a fresh client and authenticates as admin.
// In a serverless environment, auth state doesn't persist between requests.
export async function getPb(): Promise<PocketBase> {
  const pb = new PocketBase(process.env.POCKETBASE_URL)
  pb.autoCancellation(false)
  await pb.collection("_superusers").authWithPassword(
    process.env.POCKETBASE_ADMIN_EMAIL!,
    process.env.POCKETBASE_ADMIN_PASSWORD!
  )
  return pb
}
