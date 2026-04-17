import Link from "next/link"
import { getPb } from "@/lib/pb"
import type { DailyBrief, Item, BriefConfig } from "@/lib/types"
import { BriefFeed } from "@/components/BriefFeed"
import { RefreshButton } from "@/components/RefreshButton"
import { DateNav } from "@/components/DateNav"
import { ConfigTabs } from "@/components/ConfigTabs"

async function getData(date: string | undefined, configId: string | undefined) {
  const pb = await getPb()
  const today = new Date().toISOString().split("T")[0]

  // Load all configs
  const allConfigs = (await pb.collection("brief_configs").getFullList({ sort: "created" })) as unknown as BriefConfig[]
  const config = allConfigs.find((c) => c.id === configId) ?? allConfigs[0] ?? null

  if (!config) return { brief: null, items: [], today, dates: [], configs: allConfigs, config: null }

  // Dates for this config
  const allBriefs = await pb
    .collection("brief_daily")
    .getFullList({ filter: pb.filter("brief_config_id = {:cid}", { cid: config.id }), sort: "-date", fields: "id,date,item_count,brief_config_id" })
  const dates = allBriefs.map((b) => b.date as string)

  const targetDate = date ?? today
  let brief: DailyBrief | null = null

  try {
    brief = (await pb
      .collection("brief_daily")
      .getFirstListItem(
        pb.filter("date = {:date} && brief_config_id = {:cid}", { date: targetDate, cid: config.id })
      )) as unknown as DailyBrief
  } catch {
    if (allBriefs.length > 0) brief = allBriefs[0] as unknown as DailyBrief
  }

  if (!brief) return { brief: null, items: [], today, dates, configs: allConfigs, config }

  const itemRecords = await pb.collection("brief_items").getFullList({
    filter: pb.filter("brief_date = {:date} && brief_config_id = {:cid}", { date: brief.date, cid: config.id }),
    sort: "-relevance_score",
  })

  return { brief, items: itemRecords as unknown as Item[], today, dates, configs: allConfigs, config }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; config?: string }>
}) {
  const { date, config: configId } = await searchParams
  const { brief, items, today, dates, configs, config } = await getData(date, configId)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Daily Brief</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshButton />
            <Link
              href={`/settings${config ? `?config=${config.id}` : ""}`}
              className="text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Config switcher (only when multiple configs exist) */}
        {configs.length > 1 && config && (
          <ConfigTabs configs={configs} activeConfigId={config.id} />
        )}

        {/* Date navigation */}
        {dates.length > 0 && (
          <DateNav dates={dates} activeDate={brief?.date ?? today} configId={config?.id} />
        )}

        {!brief ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg mb-4">No brief yet</p>
            <p className="text-gray-600 text-sm">
              Hit <strong className="text-gray-400">Refresh</strong> to fetch content, or wait for the cron.
            </p>
          </div>
        ) : (
          <>
            {brief.date !== today && !date && (
              <div className="mb-6 text-xs text-amber-500 bg-amber-950/30 border border-amber-800 rounded-lg px-4 py-2">
                Showing brief from {brief.date} — today&apos;s hasn&apos;t been fetched yet.
              </div>
            )}
            <BriefFeed brief={brief} items={items} />
          </>
        )}
      </div>
    </div>
  )
}
