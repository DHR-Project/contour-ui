import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComponent, getAllSlugs } from "@/lib/docs/component-registry";
import { getComponentSpec } from "@/lib/docs/component-specs";
import { ComponentDemo } from "@/components/docs/component-demos";
import { ComponentDetailBreadcrumb } from "@/components/docs/component-detail-breadcrumb";
import { Text } from "@/components/ui/text";
import {
  DocsSection,
  DocsTable,
  DocsCode,
  DocsCallout,
  DoDontPair,
  ComponentStatusBadge,
} from "@/components/docs/docs-ui";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return { title: "Not Found" };
  return {
    title: component.name,
    description: component.description,
  };
}

export default async function ComponentDetailPage({ params }: Props) {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) notFound();

  const spec = getComponentSpec(slug);

  return (
    <div className="flex flex-col gap-(--gap-section)">
      <ComponentDetailBreadcrumb title={component.name} />

      {/* Header */}
      <header className="flex flex-col gap-(--space-3)">
        <div className="flex items-start gap-(--space-3) flex-wrap">
          <Text as="h1" textStyle="large-title" weight="semibold">
            {component.name}
          </Text>
          <div className="mt-(--space-2)">
            <ComponentStatusBadge
              status={component.status}
              deferredReason={component.deferredReason}
            />
          </div>
        </div>
        <Text textStyle="body" color="secondary" className="max-w-prose">
          {spec?.description ?? component.description}
        </Text>
      </header>

      {/* Deferred notice */}
      {component.status === "deferred" && (
        <DocsCallout kind="note">
          <strong>Deferred:</strong>{" "}
          {component.deferredReason ??
            "This component is not yet implemented and is waiting on a dependency to be built first."}
        </DocsCallout>
      )}

      {/* Spec-only notice */}
      {component.status === "spec-only" && (
        <DocsCallout kind="note">
          The spec for this component is complete and locked. Implementation has not started yet.
          The documentation below reflects the final design intent.
        </DocsCallout>
      )}

      {/* Live demo -- only for components with a real implementation. The
          slug -> demo lookup happens inside ComponentDemo itself (a client
          component) rather than here on the server: a Server Component that
          imports and indexes a plain object exported from a "use client"
          file gets `undefined` back, since only function/component exports
          survive the RSC client-reference boundary. */}
      {component.status === "complete" && (
        <DocsSection id="demo" title="Demo">
          <ComponentDemo slug={slug} />
        </DocsSection>
      )}

      {spec && (
        <>
          {/* Anatomy */}
          {spec.anatomy && spec.anatomy.length > 0 && (
            <DocsSection id="anatomy" title="Anatomy">
              <ul className="flex flex-col gap-(--space-2)">
                {spec.anatomy.map((item) => (
                  <li key={item.name} className="flex flex-col gap-(--space-1)">
                    <Text textStyle="footnote" weight="semibold">
                      {item.name}
                    </Text>
                    <Text textStyle="footnote" color="secondary">
                      {item.description}
                    </Text>
                  </li>
                ))}
              </ul>
            </DocsSection>
          )}

          {/* Props */}
          {spec.props && spec.props.length > 0 && (
            <DocsSection id="props" title="Props">
              <DocsTable
                caption={`${component.name} props`}
                columns={[
                  { key: "name", label: "Prop", width: "140px" },
                  { key: "type", label: "Type" },
                  { key: "default", label: "Default", width: "120px" },
                  { key: "description", label: "Description" },
                ]}
                rows={spec.props.map((p) => ({
                  name: <DocsCode>{p.name}</DocsCode>,
                  type: (
                    <span className="font-mono text-caption-1 text-label-secondary break-all">
                      {p.type}
                    </span>
                  ),
                  default: p.default ? (
                    <DocsCode>{p.default}</DocsCode>
                  ) : (
                    <span className="text-label-tertiary">—</span>
                  ),
                  description: (
                    <span className="text-label-secondary">{p.description}</span>
                  ),
                }))}
              />
            </DocsSection>
          )}

          {/* States */}
          {spec.states && spec.states.length > 0 && (
            <DocsSection id="states" title="States">
              <DocsTable
                caption={`${component.name} states`}
                columns={[
                  { key: "state", label: "State", width: "160px" },
                  { key: "description", label: "Behavior" },
                ]}
                rows={spec.states.map((s) => ({
                  state: <DocsCode>{s.state}</DocsCode>,
                  description: (
                    <span className="text-label-secondary">{s.description}</span>
                  ),
                }))}
              />
            </DocsSection>
          )}

          {/* Do / Don't */}
          {spec.doDont && spec.doDont.length > 0 && (
            <DocsSection id="do-dont" title="Do / Don't">
              <div className="flex flex-col gap-(--space-6)">
                {spec.doDont.map((pair, i) => (
                  <DoDontPair
                    key={i}
                    do={<Text textStyle="footnote" color="secondary">{pair.do}</Text>}
                    dont={<Text textStyle="footnote" color="secondary">{pair.dont}</Text>}
                  />
                ))}
              </div>
            </DocsSection>
          )}

          {/* Design Tokens */}
          {spec.tokens && spec.tokens.length > 0 && (
            <DocsSection id="tokens" title="Design Tokens">
              <DocsTable
                caption={`${component.name} design tokens`}
                columns={[
                  { key: "name", label: "Token", width: "260px" },
                  { key: "section", label: "Section", width: "80px" },
                  { key: "description", label: "Description" },
                ]}
                rows={spec.tokens.map((t) => ({
                  name: <DocsCode>{t.name}</DocsCode>,
                  section: t.section ? (
                    <span className="text-caption-1 text-label-tertiary font-mono">
                      {t.section}
                    </span>
                  ) : (
                    <span className="text-label-tertiary">—</span>
                  ),
                  description: (
                    <span className="text-label-secondary">{t.description ?? "—"}</span>
                  ),
                }))}
              />
            </DocsSection>
          )}

          {/* Notes */}
          {spec.notes && (
            <DocsSection id="notes" title="Notes">
              <DocsCallout kind="note">
                <p className="text-body text-label-secondary">{spec.notes}</p>
              </DocsCallout>
            </DocsSection>
          )}
        </>
      )}

      {/* Fallback: no spec data yet */}
      {!spec && (
        <DocsCallout kind="note">
          Detailed spec documentation for this component is coming soon.
        </DocsCallout>
      )}
    </div>
  );
}
