/**
 * Single soft accent wash behind the hero. No secondary blobs or grain.
 */
export function SpectralAtmosphere() {
  return (
    <div className="spectral-atmosphere" aria-hidden>
      <div className="spectral-glow" />
      <div className="spectral-vignette" />
    </div>
  );
}
