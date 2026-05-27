"use client";

export type ArtifactVariant = "default" | "ok" | "live";

export interface ArtifactEntry {
  key: string;
  val: string;
  variant?: ArtifactVariant;
}

export interface SystemArtifactProps {
  title: string;
  entries: ArtifactEntry[];
}

export function SystemArtifact({ title, entries }: SystemArtifactProps) {
  return (
    <div className="artifact">
      <div className="artifact-header">{title}</div>
      <div className="flex flex-col">
        {entries.map(({ key, val, variant = "default" }) => (
          <div key={key} className="artifact-row">
            <span className="artifact-key">{key}</span>
            <span
              className={`artifact-val${variant !== "default" ? ` ${variant}` : ""}`}
            >
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
