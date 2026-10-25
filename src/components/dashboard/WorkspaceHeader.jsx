import { Container } from "@/components/layout/Container";
import { SampleBadge } from "@/components/ui/Badge";
import { InlineNotice } from "@/components/ui/InlineNotice";
import { getGreeting } from "@/utils/format";

/**
 * Shared dashboard header. Every figure and action in these workspaces is
 * prototype-only until authentication and APIs are connected.
 */
export function WorkspaceHeader({
  eyebrow,
  name,
  description,
  actions,
  noticeTitle = "Sample workspace",
  notice,
}) {
  const greeting = getGreeting();

  return (
    <header className="relative overflow-hidden border-b border-forest-900/10 bg-[linear-gradient(180deg,rgba(225,237,227,0.5),rgba(252,250,244,0))]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-[radial-gradient(circle,rgba(232,181,75,0.15),transparent_70%)]"
      />
      <Container className="relative pt-8 pb-7 sm:pt-11 sm:pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.17em] text-forest-600">
                <span aria-hidden="true" className="h-px w-5 bg-forest-400" />
                {eyebrow}
              </p>
              <SampleBadge label="Sample data" />
            </div>
            <h1 className="mt-3 text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] text-forest-950">
              {greeting},{" "}
              <span className="italic text-forest-800">{name}.</span>
            </h1>
            <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-ink-soft sm:text-[14px]">
              {description}
            </p>
          </div>

          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>
          ) : null}
        </div>

        <div className="mt-5">
          <InlineNotice tone="sample" title={noticeTitle}>
            {notice}
          </InlineNotice>
        </div>
      </Container>
    </header>
  );
}
