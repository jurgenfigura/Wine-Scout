import React, { useState, useRef } from "react";

function WineGlassIcon({ size = 26, color = "#F3D9A4", strokeWidth = 1.6 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 2.5H17C17 7.2 16.2 10.6 12 10.6C7.8 10.6 7 7.2 7 2.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M12 10.6V18.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M8.2 21H15.8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function BottleLineupIcon({ size = 26, color = "#F3D9A4" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* wine bottle: tall, slim, long neck */}
      <rect x="3.1" y="1.6" width="1.8" height="1.3" rx="0.4" fill={color} />
      <rect x="3.3" y="2.7" width="1.4" height="5.6" rx="0.3" fill={color} />
      <path
        d="M2.6 8.3 Q2.6 7.3 3.4 7.3 L4.6 7.3 Q5.4 7.3 5.4 8.3 L5.4 20.8 Q5.4 21.6 4.6 21.6 L3.4 21.6 Q2.6 21.6 2.6 20.8 Z"
        fill={color}
      />
      {/* whisky bottle: short, squat, wide shoulders */}
      <rect x="9.3" y="4" width="2.2" height="1.2" rx="0.4" fill={color} />
      <rect x="9.5" y="5.1" width="1.8" height="2.7" rx="0.3" fill={color} />
      <path
        d="M8.3 8.3 Q8.3 7.4 9.2 7.4 L12.1 7.4 Q13 7.4 13 8.3 L13 20.8 Q13 21.6 12.1 21.6 L9.2 21.6 Q8.3 21.6 8.3 20.8 Z"
        fill={color}
      />
      {/* beer bottle: medium, curved shoulder, tapered neck */}
      <rect x="16.2" y="1" width="1.8" height="1.2" rx="0.4" fill={color} />
      <rect x="16.4" y="2.1" width="1.4" height="4.4" rx="0.3" fill={color} />
      <path
        d="M15.4 8.4 Q15.4 6.9 16.4 6.6 L17.6 6.6 Q18.6 6.9 18.6 8.4 L18.6 20.8 Q18.6 21.6 17.8 21.6 L16.2 21.6 Q15.4 21.6 15.4 20.8 Z"
        fill={color}
      />
    </svg>
  );
}

function ConciergeIcon({ size = 22, color = "#F3D9A4" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* lens */}
      <circle
        cx="10"
        cy="10"
        r="9"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      {/* handle */}
      <line
        x1="16.4"
        y1="16.4"
        x2="23"
        y2="23"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* a bottle, seen through the lens */}
      <rect x="9.1" y="2.2" width="1.8" height="1.3" rx="0.35" fill={color} />
      <rect x="9.3" y="3.5" width="1.4" height="2.3" rx="0.3" fill={color} />
      <path
        d="M7.8 6.3 Q7.8 5.3 8.8 5.3 L11.2 5.3 Q12.2 5.3 12.2 6.3 L12.2 14.8 Q12.2 15.8 11.2 15.8 L8.8 15.8 Q7.8 15.8 7.8 14.8 Z"
        fill={color}
      />
    </svg>
  );
}

function GoogleIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 12 L4.2 7.5 A9 9 0 0 1 19.8 7.5 Z" fill="#EA4335" />
      <path d="M12 12 L19.8 7.5 A9 9 0 0 1 12 21 Z" fill="#FBBC05" />
      <path d="M12 12 L12 21 A9 9 0 0 1 4.2 7.5 Z" fill="#34A853" />
      <circle cx="12" cy="12" r="5.5" fill="#FFFFFF" />
      <circle cx="12" cy="12" r="4" fill="#4285F4" />
    </svg>
  );
}

const BLANK_ITEM = {
  brand: "",
  product: "",
  type: "",
  year: "",
  region: "",
  country: "",
};

export default function App() {
  const [image, setImage] = useState(null);
  const [labelThumb, setLabelThumb] = useState(null);
  const [itemData, setItemData] = useState(BLANK_ITEM);
  const [category, setCategory] = useState(""); // "wine" | "whisky" | "beer" | "cider" | "spirit" | "unknown" | ""
  const [status, setStatus] = useState("idle"); // idle | analyzing | done | error
  const [showOriginal, setShowOriginal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clipboardText, setClipboardText] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setImage(dataUrl);
      setLabelThumb(null);
      setItemData(BLANK_ITEM);
      setCategory("");
      setCopied(false);
      setClipboardText("");
      analyzeLabel(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImage(null);
    setLabelThumb(null);
    setItemData(BLANK_ITEM);
    setCategory("");
    setStatus("idle");
    setShowOriginal(false);
    setCopied(false);
    setClipboardText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopyAgain = async () => {
    if (!clipboardText) return;
    try {
      await navigator.clipboard.writeText(clipboardText);
    } catch (err) {
      console.error("Manual clipboard copy failed:", err);
    }
  };

  const handleShowOriginal = () => {
    setShowOriginal(true);
  };

  const handleCloseOriginal = () => {
    setShowOriginal(false);
  };

  const handleOpenGoogleSearch = () => {
    const query = [
      itemData.brand,
      itemData.product,
      itemData.type,
      itemData.year,
      itemData.region,
      itemData.country,
    ]
      .filter((v) => v && v.toLowerCase() !== "unknown")
      .join(" ");
    const url = query
      ? `https://www.google.com/search?q=${encodeURIComponent(query)}`
      : "https://www.google.com/";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Re-copies the current item's details to the clipboard, called
  // synchronously from a click handler so it runs inside a genuine user
  // gesture rather than deep in an async chain - this is the moment
  // browsers most reliably allow a clipboard write.
  const copyBeforeLinkOpen = () => {
    if (clipboardText && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(clipboardText).catch((err) => {
        console.error("Clipboard copy on link-open failed:", err);
      });
    }
  };

  const handleOpenWineEnthusiast = () => {
    copyBeforeLinkOpen();
    window.open(
      "https://www.wineenthusiast.com/ratings/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleOpenWineSpectator = () => {
    copyBeforeLinkOpen();
    window.open(
      "https://www.winespectator.com/ratings/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleOpenWhiskyAdvocate = () => {
    copyBeforeLinkOpen();
    window.open(
      "https://www.whiskyadvocate.com/ratings-reviews",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleOpenWineEnthusiastSpirits = () => {
    copyBeforeLinkOpen();
    window.open(
      "https://www.wineenthusiast.com/ratings/spirits/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Crops the original photo down to a bounding box (fractions 0-1 of the
  // image's width/height) using an offscreen canvas, and resolves with a
  // cropped image as a data URL.
  const cropToBoundingBox = (dataUrl, box) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const x = Math.max(0, Math.min(1, box.x ?? 0));
          const y = Math.max(0, Math.min(1, box.y ?? 0));
          const w = Math.max(0.05, Math.min(1 - x, box.width ?? 1));
          const h = Math.max(0.05, Math.min(1 - y, box.height ?? 1));

          const sx = x * img.naturalWidth;
          const sy = y * img.naturalHeight;
          const sw = w * img.naturalWidth;
          const sh = h * img.naturalHeight;

          const canvas = document.createElement("canvas");
          canvas.width = sw;
          canvas.height = sh;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
          resolve(canvas.toDataURL("image/jpeg", 0.92));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = reject;
      img.src = dataUrl;
    });

  const analyzeLabel = async (dataUrl) => {
    setStatus("analyzing");
    try {
      const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
      if (!match) throw new Error("Could not read image data");
      const mediaType = match[1];
      const base64Data = match[2];

      // This calls OUR OWN backend function at /api/analyze (see api/analyze.js).
      // That function holds the real Anthropic API key and talks to Anthropic
      // on our behalf, so the key is never exposed to the browser.
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaType, base64Data }),
      });

      if (!response.ok) throw new Error("Request failed");
      const data = await response.json();
      const textBlock = (data.content || []).find((b) => b.type === "text");
      if (!textBlock) throw new Error("No response text");
      const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const finalBrand = parsed.brand || "unknown";
      const finalProduct = parsed.product || "unknown";
      const finalYear = parsed.year || "unknown";
      const finalType = parsed.type || "unknown";
      const finalRegion = parsed.region || "unknown";
      const finalCountry = parsed.country || "unknown";

      const allowedCategories = [
        "wine",
        "whisky",
        "beer",
        "cider",
        "spirit",
        "unknown",
      ];
      const rawCategory =
        typeof parsed.category === "string"
          ? parsed.category.toLowerCase().trim()
          : "unknown";
      setCategory(
        allowedCategories.includes(rawCategory) ? rawCategory : "unknown"
      );

      setItemData({
        brand: finalBrand,
        product: finalProduct,
        type: finalType,
        year: finalYear,
        region: finalRegion,
        country: finalCountry,
      });

      if (
        parsed.labelBoundingBox &&
        typeof parsed.labelBoundingBox === "object"
      ) {
        try {
          const cropped = await cropToBoundingBox(
            dataUrl,
            parsed.labelBoundingBox
          );
          setLabelThumb(cropped);
        } catch (cropErr) {
          console.error("Label crop error:", cropErr);
        }
      }

      // Build the clipboard text from every field (not just brand/product/
      // year), but drop duplicate words as we go - e.g. if the region
      // ("Napa Valley") repeats a word already in the product name, or the
      // country name already appears inside the region, we only want it to
      // show up once. Comparison is case-insensitive and ignores
      // punctuation so "Napa," and "napa" still count as the same word;
      // the original word (with its original casing/punctuation) is kept
      // the first time it appears.
      //
      // This whole block is wrapped in its own try/catch: it's a nice-to-
      // have (populating the clipboard), not part of reading the label, so
      // a problem here should never turn a successful label read into a
      // "couldn't read the label" error for the user.
      try {
        const seenClipboardWords = new Set();
        const clipboardLines = [
          finalBrand,
          finalProduct,
          finalType,
          finalYear,
          finalRegion,
          finalCountry,
        ]
          .filter((v) => v && String(v).toLowerCase() !== "unknown")
          .map((field) =>
            String(field)
              .split(/\s+/)
              .filter((word) => {
                const key = word.toLowerCase().replace(/[^a-z0-9]/g, "");
                if (!key || seenClipboardWords.has(key)) return false;
                seenClipboardWords.add(key);
                return true;
              })
              .join(" ")
          )
          .filter((line) => line.length > 0);

        const newClipboardText = clipboardLines.join("\n");

        if (newClipboardText) {
          setClipboardText(newClipboardText);
          setCopied(true);
          // Best-effort automatic copy. Many browsers only allow clipboard
          // writes that happen directly inside a click handler, so this can
          // silently fail here since we're deep inside an async chain. The
          // notice below is also a button - tapping it retries the copy
          // from a genuine click, which is far more reliable.
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(newClipboardText);
            } else {
              throw new Error("Clipboard API unavailable");
            }
          } catch (clipErr) {
            console.error(
              "Automatic clipboard write failed (expected in some environments - tap the notice to copy manually):",
              clipErr
            );
          }
        }
      } catch (clipboardBuildErr) {
        console.error(
          "Building clipboard text failed (label was still read fine):",
          clipboardBuildErr
        );
      }

      setStatus("done");
    } catch (err) {
      console.error("Label analysis error:", err);
      setStatus("error");
    }
  };

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });

  const fields = [
    { label: "Brand", key: "brand" },
    { label: "Product", key: "product" },
    { label: "Type", key: "type" },
    { label: "Year", key: "year" },
    { label: "Region", key: "region" },
    { label: "Country", key: "country" },
  ];

  const visibleFields =
    status === "done"
      ? fields.filter((f) => {
          const v = itemData[f.key];
          return v && v.toLowerCase() !== "unknown";
        })
      : fields;

  const sheetSubtitle =
    status === "analyzing"
      ? "Reading the label…"
      : status === "done"
      ? "Identified from your photo"
      : status === "error"
      ? "Couldn't read the label"
      : "Not yet identified";

  return (
    <div style={styles.page}>
      <style>{`
        .proof-sheet {
          scrollbar-width: thin;
          scrollbar-color: #D9A93F #F0E4C8;
        }
        .proof-sheet::-webkit-scrollbar {
          width: 7px;
        }
        .proof-sheet::-webkit-scrollbar-track {
          background: #F0E4C8;
          border-radius: 8px;
        }
        .proof-sheet::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #E8C877 0%, #B8862A 100%);
          border-radius: 8px;
        }
        .proof-sheet::-webkit-scrollbar-thumb:hover {
          background: #B8862A;
        }
      `}</style>
      <div style={styles.phone}>
        {/* Header: status bar + nav bar share one burgundy field */}
        <div style={styles.header}>
          <div style={styles.statusBar}>
            <span style={styles.statusTime}>{timeString}</span>
            <div style={styles.notch} />
            <div style={styles.statusIcons}>
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                <rect x="0" y="7" width="3" height="5" rx="0.5" fill="#F6ECD9" />
                <rect x="5" y="5" width="3" height="7" rx="0.5" fill="#F6ECD9" />
                <rect x="10" y="3" width="3" height="9" rx="0.5" fill="#F6ECD9" />
                <rect x="15" y="0" width="3" height="12" rx="0.5" fill="#F6ECD9" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path
                  d="M8 2.2C11 2.2 13.3 3.3 15 5.2L14 6.4C12.5 4.8 10.4 3.9 8 3.9C5.6 3.9 3.5 4.8 2 6.4L1 5.2C2.7 3.3 5 2.2 8 2.2Z"
                  fill="#F6ECD9"
                />
                <path
                  d="M8 5.6C9.7 5.6 11.2 6.3 12.3 7.4L11.3 8.6C10.5 7.8 9.3 7.3 8 7.3C6.7 7.3 5.5 7.8 4.7 8.6L3.7 7.4C4.8 6.3 6.3 5.6 8 5.6Z"
                  fill="#F6ECD9"
                />
                <circle cx="8" cy="10" r="1.4" fill="#F6ECD9" />
              </svg>
              <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                <rect
                  x="0.5"
                  y="0.5"
                  width="21"
                  height="11"
                  rx="2.5"
                  stroke="#F6ECD9"
                  strokeOpacity="0.6"
                />
                <rect x="2" y="2" width="15" height="8" rx="1.2" fill="#F6ECD9" />
                <rect
                  x="22.5"
                  y="4"
                  width="1.5"
                  height="4"
                  rx="0.7"
                  fill="#F6ECD9"
                  fillOpacity="0.6"
                />
              </svg>
            </div>
          </div>

          <div style={styles.navBar}>
            <div style={styles.brandRow}>
              <div style={styles.brandBadge}>
                <ConciergeIcon size={30} color="#3B0F1F" />
              </div>
              <div style={styles.brandTextWrap}>
                <span style={styles.navTitle}>Proof!</span>
                <span style={styles.navSubtitle}>Your Liquor Store Concierge</span>
              </div>
              <button
                style={styles.infoButton}
                onClick={() => setShowInfo(true)}
                title="About Proof!"
              >
                i
              </button>
            </div>
          </div>
          <div style={styles.navRule} />
        </div>

        {/* Content */}
        <div style={styles.content}>
          {!image ? (
            <button
              style={styles.uploadZone}
              onClick={() => fileInputRef.current.click()}
            >
              <div style={styles.uploadGlyph}>
                <BottleLineupIcon size={27} color="#C9962E" />
              </div>
              <span style={styles.uploadTitle}>Investigate a bottle</span>
              <span style={styles.uploadHint}>
                Snap a photo of the label to start
              </span>
              <span style={styles.uploadCta}>Choose photo</span>
            </button>
          ) : (
            <div style={styles.photoRow}>
              {status === "done" ? (
                <div style={styles.photoThumbCol}>
                  <button
                    style={styles.photoThumbButton}
                    onClick={handleShowOriginal}
                    title="Tap to view original photo"
                  >
                    <img
                      src={labelThumb || image}
                      alt="Product label"
                      style={styles.photo}
                    />
                  </button>
                  <span style={styles.thumbCaption}>click for orig</span>
                </div>
              ) : (
                <div style={styles.photoThumb}>
                  <img
                    src={labelThumb || image}
                    alt="Product label"
                    style={styles.photo}
                  />
                </div>
              )}
              <div style={styles.photoRowText}>
                <span style={styles.photoRowLabel}>Label</span>
                <button style={styles.retakeLink} onClick={handleRemove}>
                  Retake
                </button>
              </div>
              <button
                style={{
                  ...styles.analyzeButtonSmall,
                  opacity: status === "analyzing" ? 0.6 : 1,
                  cursor: status === "analyzing" ? "default" : "pointer",
                }}
                disabled={status === "analyzing"}
                onClick={() => analyzeLabel(image)}
              >
                {status === "analyzing"
                  ? "Analyzing…"
                  : status === "error"
                  ? "Try again"
                  : status === "done"
                  ? "Re-analyze"
                  : "Identify"}
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* Field list */}
          <div className="proof-sheet" style={styles.sheet}>
            <div style={styles.sheetHeaderRow}>
              <div style={styles.sheetHeaderLeft}>
                <span
                  style={{
                    ...styles.sheetHeaderSub,
                    color: status === "error" ? "#B0463F" : "#B8862A",
                  }}
                >
                  {sheetSubtitle}
                </span>
              </div>
              <div style={styles.sheetHeaderRule} />
            </div>
            {status === "done" && visibleFields.length === 0 ? (
              <div style={styles.noFieldsBlock}>
                <span style={styles.noFieldsText}>
                  No label details could be identified
                </span>
              </div>
            ) : (
              visibleFields.map((f, i) => {
                const value = itemData[f.key];
                const isKnown = value && value.toLowerCase() !== "unknown";
                return (
                  <div
                    key={f.key}
                    style={{
                      ...styles.fieldRow,
                      borderTop: i === 0 ? "none" : "0.5px solid #EADFC9",
                    }}
                  >
                    <span style={styles.fieldLabel}>{f.label}</span>
                    <span
                      style={
                        isKnown ? styles.fieldValue : styles.fieldPlaceholder
                      }
                    >
                      {status === "analyzing"
                        ? "…"
                        : isKnown
                        ? value
                        : value
                        ? "Unknown"
                        : "—"}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {copied && (
            <button style={styles.copiedNotice} onClick={handleCopyAgain}>
              details copied to clipboard for pasting...
            </button>
          )}

          <div style={styles.bottomButtonRow}>
            <button
              style={styles.enthusiastButton}
              onClick={handleOpenGoogleSearch}
            >
              <GoogleIcon size={20} />
              <span style={styles.buttonLabelText}>Look it up</span>
            </button>
            {category === "wine" && (
              <>
                <button
                  style={styles.enthusiastButton}
                  onClick={handleOpenWineEnthusiast}
                >
                  <span style={styles.buttonIcon}>🍷</span>
                  <span style={styles.buttonLabelText}>Wine Enthusiast</span>
                  <span style={styles.buttonSubtext}>(free)</span>
                </button>
                <button
                  style={styles.enthusiastButton}
                  onClick={handleOpenWineSpectator}
                >
                  <span style={styles.buttonIcon}>🍷</span>
                  <span style={styles.buttonLabelText}>Wine Spectator</span>
                  <span style={styles.buttonSubtext}>(subscription)</span>
                </button>
              </>
            )}
            {(category === "whisky" || category === "spirit") && (
              <>
                <button
                  style={styles.enthusiastButton}
                  onClick={handleOpenWhiskyAdvocate}
                >
                  <span style={styles.buttonIcon}>🥃</span>
                  <span style={styles.buttonLabelText}>Whisky Advocate</span>
                </button>
                <button
                  style={styles.enthusiastButton}
                  onClick={handleOpenWineEnthusiastSpirits}
                >
                  <span style={styles.buttonIcon}>🥃</span>
                  <span style={styles.buttonLabelText}>
                    Wine Enthusiast Spirits
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Home indicator */}
        <div style={styles.homeIndicatorWrap}>
          <div style={styles.homeIndicator} />
        </div>

        {showOriginal && image && (
          <div style={styles.originalOverlay}>
            <img
              src={image}
              alt="Original bottle photo"
              style={styles.originalOverlayImg}
            />
            <span style={styles.originalOverlayCaption}>Original photo</span>
            <button
              style={styles.originalCloseButton}
              onClick={handleCloseOriginal}
            >
              Close
            </button>
          </div>
        )}

        {showInfo && (
          <div style={styles.infoOverlay}>
            <div style={styles.infoCard}>
              <span style={styles.infoTitle}>About Proof!</span>
              <p style={styles.infoBody}>
                I created this helper app to more quickly browse and research
                wine and spirits while I'm in the store. I don't know about
                you, but I find it hard to accurately spell most Italian
                labels and often got no results. I'm hoping this makes your
                life easier.
                <br />
                <br />
                If you find this useful please consider a donation towards
                funding the Claude API that I pay for.
                <br />
                <br />
                Happy Hunting!
                <br />
                - Jurgen
              </p>
              <button
                style={styles.infoCloseButton}
                onClick={() => setShowInfo(false)}
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SERIF =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";
const SANS =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at 50% 0%, #EFE6D4 0%, #E4D8C0 55%, #DCCDAF 100%)",
    padding: "24px 0",
    fontFamily: SANS,
    boxSizing: "border-box",
  },
  phone: {
    width: 375,
    maxWidth: "100vw",
    height: 812,
    maxHeight: "92vh",
    background: "#FBF5E9",
    borderRadius: 46,
    boxShadow:
      "0 0 0 2px rgba(201,150,46,0.35), 0 0 0 11px #150a0c, 0 0 0 13px #2a1418, 0 30px 70px rgba(20,4,10,0.45)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  header: {
    background: "linear-gradient(160deg, #4A1020 0%, #650F26 55%, #3B0F1F 100%)",
    position: "relative",
  },
  statusBar: {
    height: 47,
    minHeight: 47,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    position: "relative",
  },
  statusTime: {
    fontSize: 15,
    fontWeight: 600,
    color: "#F6ECD9",
    letterSpacing: 0.2,
  },
  notch: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: 120,
    height: 26,
    background: "#0F070A",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  statusIcons: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  navBar: {
    padding: "6px 20px 20px",
    position: "relative",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  infoButton: {
    marginLeft: "auto",
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "rgba(243,217,164,0.16)",
    border: "1px solid rgba(243,217,164,0.55)",
    color: "#F3D9A4",
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: 15,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  brandBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(150deg, #F3D9A4 0%, #D9A93F 55%, #B8862A 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
    flexShrink: 0,
  },
  brandTextWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  navTitle: {
    fontFamily: SERIF,
    fontSize: 24,
    fontWeight: 700,
    color: "#FBF0DC",
    letterSpacing: 0.2,
    lineHeight: 1.1,
  },
  navSubtitle: {
    fontSize: 12,
    fontWeight: 500,
    color: "#D9A93F",
    letterSpacing: 0.4,
  },
  navRule: {
    height: 1,
    background:
      "linear-gradient(90deg, rgba(217,169,63,0) 0%, #D9A93F 50%, rgba(217,169,63,0) 100%)",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "22px 20px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  uploadZone: {
    border: "1.5px solid #E2CE9F",
    borderRadius: 20,
    background: "linear-gradient(180deg, #FFFDF8 0%, #FBF1DD 100%)",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow:
      "0 1px 2px rgba(74,16,32,0.06), inset 0 0 0 1px rgba(255,255,255,0.5)",
  },
  uploadGlyph: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#FBF5E9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    boxShadow: "inset 0 0 0 1.5px #E2CE9F, 0 2px 6px rgba(201,150,46,0.15)",
  },
  uploadTitle: {
    fontFamily: SERIF,
    fontSize: 19,
    color: "#4A1020",
    fontWeight: 700,
  },
  uploadHint: {
    fontSize: 13,
    color: "#8C7A5A",
    textAlign: "center",
    marginBottom: 6,
  },
  uploadCta: {
    fontSize: 13,
    fontWeight: 700,
    color: "#B8862A",
    letterSpacing: 0.3,
    padding: "8px 18px",
    borderRadius: 20,
    border: "1px solid #D9A93F",
  },
  photoRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  analyzeButtonSmall: {
    marginLeft: "auto",
    background: "linear-gradient(135deg, #E8C877 0%, #D9A93F 45%, #B8862A 100%)",
    border: "none",
    borderRadius: 12,
    padding: "9px 14px",
    fontFamily: "inherit",
    fontSize: 12.5,
    fontWeight: 700,
    color: "#3B0F1F",
    letterSpacing: 0.2,
    boxShadow: "0 4px 10px rgba(184,134,42,0.3)",
    flexShrink: 0,
  },
  photoThumb: {
    width: 68,
    height: 68,
    borderRadius: 12,
    overflow: "hidden",
    background: "#2A1418",
    flexShrink: 0,
    boxShadow: "0 0 0 1px #D9A93F, 0 4px 10px rgba(74,16,32,0.24)",
  },
  photoThumbCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    flexShrink: 0,
  },
  thumbCaption: {
    fontSize: 9,
    color: "#B8862A",
    fontWeight: 600,
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
  },
  photoThumbButton: {
    width: 68,
    height: 68,
    borderRadius: 12,
    overflow: "hidden",
    background: "#2A1418",
    flexShrink: 0,
    border: "none",
    padding: 0,
    cursor: "pointer",
    boxShadow: "0 0 0 1px #D9A93F, 0 4px 10px rgba(74,16,32,0.24)",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  photoRowText: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  photoRowLabel: {
    fontFamily: SERIF,
    fontSize: 15,
    fontWeight: 700,
    color: "#4A1020",
  },
  retakeLink: {
    background: "none",
    border: "none",
    padding: 0,
    fontSize: 13,
    fontWeight: 700,
    color: "#B8862A",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: "inherit",
    width: "fit-content",
  },
  sheet: {
    background: "#FFFDF8",
    borderRadius: 20,
    boxShadow: "0 2px 10px rgba(74,16,32,0.08)",
    overflowY: "auto",
    maxHeight: 420,
    border: "1px solid #F0E4C8",
  },
  sheetHeaderRow: {
    padding: "18px 20px 12px",
    position: "sticky",
    top: 0,
    background: "#FFFDF8",
    zIndex: 1,
  },
  sheetHeaderLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginBottom: 12,
  },
  sheetHeaderSub: {
    fontSize: 12,
    color: "#B8862A",
    fontWeight: 600,
    letterSpacing: 0.3,
  },
  sheetHeaderRule: {
    height: 1,
    background: "linear-gradient(90deg, #D9A93F 0%, rgba(217,169,63,0.15) 100%)",
  },
  noFieldsBlock: {
    padding: "20px 20px 32px",
    display: "flex",
    justifyContent: "center",
  },
  noFieldsText: {
    fontSize: 13.5,
    color: "#8C7A5A",
    fontStyle: "italic",
    textAlign: "center",
  },
  fieldRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
  },
  fieldLabel: {
    fontSize: 15,
    color: "#3B2A20",
    fontWeight: 600,
  },
  fieldPlaceholder: {
    fontSize: 15,
    color: "#D4C298",
    fontWeight: 500,
  },
  fieldValue: {
    fontSize: 15,
    color: "#4A1020",
    fontWeight: 600,
    textAlign: "right",
    maxWidth: "60%",
  },
  copiedNotice: {
    fontSize: 12,
    color: "#8C7A5A",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: -6,
    background: "none",
    border: "none",
    padding: 0,
    fontFamily: "inherit",
    cursor: "pointer",
    width: "100%",
  },
  bottomButtonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  enthusiastButton: {
    flex: "1 1 30%",
    minWidth: 100,
    background: "#FFFDF8",
    border: "1.5px solid #D9A93F",
    borderRadius: 16,
    padding: "12px 8px 10px",
    fontFamily: SERIF,
    fontSize: 13.5,
    fontWeight: 700,
    color: "#4A1020",
    letterSpacing: 0.2,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(74,16,32,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  buttonIcon: {
    fontSize: 19,
    lineHeight: 1,
  },
  buttonLabelText: {
    textAlign: "center",
  },
  buttonSubtext: {
    fontFamily: SANS,
    fontSize: 9,
    fontWeight: 600,
    color: "#B8862A",
    letterSpacing: 0.2,
  },
  originalOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(20,8,10,0.93)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 28,
    zIndex: 30,
  },
  originalOverlayImg: {
    maxWidth: "100%",
    maxHeight: "78%",
    borderRadius: 16,
    objectFit: "contain",
    boxShadow: "0 0 0 1px #D9A93F, 0 16px 34px rgba(0,0,0,0.5)",
  },
  originalOverlayCaption: {
    fontFamily: SERIF,
    fontSize: 14,
    fontWeight: 700,
    color: "#F3D9A4",
    letterSpacing: 0.3,
  },
  originalCloseButton: {
    marginTop: 6,
    background: "linear-gradient(135deg, #E8C877 0%, #D9A93F 45%, #B8862A 100%)",
    border: "none",
    borderRadius: 12,
    padding: "9px 24px",
    fontFamily: "inherit",
    fontSize: 13.5,
    fontWeight: 700,
    color: "#3B0F1F",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(184,134,42,0.3)",
  },
  infoOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(20,8,10,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    zIndex: 30,
  },
  infoCard: {
    background: "#FBF5E9",
    borderRadius: 20,
    padding: "26px 22px 22px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
    boxShadow: "0 0 0 1px #D9A93F, 0 16px 34px rgba(0,0,0,0.5)",
    maxWidth: 300,
  },
  infoTitle: {
    fontFamily: SERIF,
    fontSize: 18,
    fontWeight: 700,
    color: "#4A1020",
  },
  infoBody: {
    fontSize: 13.5,
    lineHeight: 1.5,
    color: "#3B2A20",
    textAlign: "center",
    margin: 0,
  },
  infoCloseButton: {
    marginTop: 4,
    background: "linear-gradient(135deg, #E8C877 0%, #D9A93F 45%, #B8862A 100%)",
    border: "none",
    borderRadius: 12,
    padding: "9px 22px",
    fontFamily: "inherit",
    fontSize: 13.5,
    fontWeight: 700,
    color: "#3B0F1F",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(184,134,42,0.3)",
  },
  homeIndicatorWrap: {
    display: "flex",
    justifyContent: "center",
    padding: "8px 0 10px",
    background: "#FBF5E9",
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 3,
    background: "#3B0F1F",
    opacity: 0.3,
  },
};
