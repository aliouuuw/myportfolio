import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aliou Wade — Product Systems Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#111",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "80px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "2px",
            background: "#e5e5e5",
            marginBottom: "32px",
          }}
        />
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#f5f5f5",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: "16px",
            fontFamily: "serif",
          }}
        >
          Aliou Wade
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "#888",
            letterSpacing: "0px",
            fontFamily: "sans-serif",
          }}
        >
          Product Systems Engineer
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
