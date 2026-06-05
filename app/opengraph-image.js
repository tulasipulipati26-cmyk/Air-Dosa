import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AirDosa — AI-Powered Instant Dosa Drone Delivery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #07090e 0%, #131722 50%, #0a1628 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 30%, rgba(255, 122, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 240, 255, 0.12) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#00f0ff",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Flight Status: Active &amp; Cruising
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#f3f4f6",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Air
            <span style={{ color: "#ff7a00" }}>Dosa</span>
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: "#9ca3af",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Hypersonic Dosa Delivery — From Tawa to Terrace
          </div>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #ff8a00, #ff3d00)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 50,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              Order Now
            </div>
            <div
              style={{
                border: "2px solid rgba(0, 240, 255, 0.5)",
                color: "#00f0ff",
                padding: "14px 32px",
                borderRadius: 50,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              Under 5 Minutes
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
