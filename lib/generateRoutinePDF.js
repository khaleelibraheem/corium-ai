import jsPDF from "jspdf";

export function generateRoutinePDF(result, userName = null) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const W = 210; // A4 width in mm
  const MARGIN = 20;
  const COL = W - MARGIN * 2;
  let y = 0;

  // ── Colour palette (matches Corium brand) ──────────────────────────
  const PRIMARY    = [212, 163, 115]; // #d4a373
  const DARK       = [169, 124,  80]; // #a97c50
  const STONE_900  = [ 28,  25,  23];
  const STONE_600  = [ 87,  83,  78];
  const STONE_400  = [120, 113, 108];
  const STONE_200  = [231, 229, 228];
  const STONE_100  = [245, 245, 244];
  const WHITE      = [255, 255, 255];
  const AM_ACCENT  = [234, 88,  12];  // orange-600
  const PM_BG      = [ 28,  25,  23]; // stone-900 dark
  const PM_ACCENT  = [ 99, 102, 241]; // indigo-500

  // ── Helper functions ───────────────────────────────────────────────
  const setFont = (style = "normal", size = 10, color = STONE_900) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const setFill = (color) => doc.setFillColor(...color);
  const setDraw = (color) => doc.setDrawColor(...color);

  const line = (x1, y1, x2, y2, color = STONE_200, lw = 0.3) => {
    doc.setLineWidth(lw);
    setDraw(color);
    doc.line(x1, y1, x2, y2);
  };

  const pill = (x, y, w, h, color) => {
    setFill(color);
    setDraw(color);
    doc.roundedRect(x, y, w, h, h / 2, h / 2, "F");
  };

  const tag = (text, x, y, bgColor, textColor) => {
    setFont("bold", 7, textColor);
    const tw = doc.getTextWidth(text);
    pill(x, y - 3.5, tw + 6, 5, bgColor);
    doc.text(text, x + 3, y, { baseline: "middle" });
    return tw + 8;
  };

  const ensureSpace = (needed) => {
    if (y + needed > 277) {
      doc.addPage();
      y = MARGIN;
    }
  };

  // ── COVER HEADER ──────────────────────────────────────────────────
  // Warm tan header band
  setFill(PRIMARY);
  doc.rect(0, 0, W, 52, "F");

  // Subtle dot grid overlay
  doc.setFillColor(255, 255, 255, 0.06);
  for (let gx = 5; gx < W; gx += 12) {
    for (let gy = 4; gy < 52; gy += 12) {
      doc.circle(gx, gy, 0.4, "F");
    }
  }

  // Brand name
  setFont("bolditalic", 26, WHITE);
  doc.text("corium.ai", MARGIN, 22);

  // Tagline
  setFont("normal", 9, [245, 235, 220]);
  doc.text("Personalized Dermatological Protocol", MARGIN, 30);

  // Date badge
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
  setFont("normal", 8, [245, 235, 220]);
  doc.text(`Generated ${dateStr}`, MARGIN, 38);

  // User name if available
  if (userName) {
    setFont("bold", 9, WHITE);
    const nameText = `Prepared for ${userName}`;
    const nw = doc.getTextWidth(nameText);
    doc.text(nameText, W - MARGIN - nw, 38);
  }

  // Decorative right circle
  doc.setFillColor(255, 255, 255);
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  doc.circle(W - 18, 26, 28, "F");
  doc.setGState(new doc.GState({ opacity: 1 }));

  y = 62;

  // ── SKIN PROFILE CHIPS ────────────────────────────────────────────
  if (result.skinType || (result.concerns && result.concerns.length > 0)) {
    setFont("bold", 7, STONE_400);
    doc.text("SKIN PROFILE", MARGIN, y);
    y += 5;

    let chipX = MARGIN;
    if (result.skinType) {
      const label = result.skinType.charAt(0).toUpperCase() + result.skinType.slice(1) + " skin";
      const w = doc.getTextWidth(label) + 8;
      pill(chipX, y - 3, w, 6, STONE_100);
      setFont("normal", 8, STONE_600);
      doc.text(label, chipX + 4, y, { baseline: "middle" });
      chipX += w + 3;
    }
    (result.concerns || []).forEach((c) => {
      const w = doc.getTextWidth(c) + 8;
      if (chipX + w > W - MARGIN) return;
      pill(chipX, y - 3, w, 6, STONE_100);
      setFont("normal", 8, STONE_600);
      doc.text(c, chipX + 4, y, { baseline: "middle" });
      chipX += w + 3;
    });
    y += 10;
  }

  // ── ANALYSIS SECTION ──────────────────────────────────────────────
  setFill(STONE_100);
  setDraw(STONE_200);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, COL, 8, 2, 2, "F");

  // Left accent bar
  setFill(PRIMARY);
  doc.roundedRect(MARGIN, y, 2.5, 8, 1, 1, "F");

  setFont("bold", 7.5, DARK);
  doc.text("DERMATOLOGICAL ANALYSIS", MARGIN + 6, y + 5);
  y += 12;

  setFont("normal", 9, STONE_600);
  const analysisLines = doc.splitTextToSize(result.analysis, COL);
  doc.text(analysisLines, MARGIN, y);
  y += analysisLines.length * 5 + 8;

  line(MARGIN, y, W - MARGIN, y);
  y += 8;

  // ── ROUTINE RENDERER ──────────────────────────────────────────────
  const renderRoutine = (items, isAM) => {
    const accent = isAM ? AM_ACCENT : PM_ACCENT;
    const headerBg = isAM ? [255, 247, 237] : PM_BG;
    const headerText = isAM ? AM_ACCENT : WHITE;
    const subText = isAM ? [154, 52, 18] : [165, 180, 252];
    const rowBg = isAM ? WHITE : [41, 37, 36];
    const rowText = isAM ? STONE_900 : WHITE;
    const rowSub = isAM ? STONE_600 : [168, 162, 158];
    const rowBorder = isAM ? STONE_200 : [68, 64, 60];
    const exBg = isAM ? STONE_100 : [68, 64, 60];
    const exText = isAM ? STONE_600 : [214, 211, 209];
    const typeColor = isAM ? AM_ACCENT : [165, 180, 252];

    // Section header
    ensureSpace(24);
    setFill(headerBg);
    doc.roundedRect(MARGIN, y, COL, 14, 2, 2, "F");

    setFill(accent);
    doc.circle(MARGIN + 9, y + 7, 4.5, "F");
    setFont("bold", 9, headerText);
    doc.text(isAM ? "☀" : "☾", MARGIN + 6.5, y + 7.8);

    setFont("bold", 11, headerText);
    doc.text(isAM ? "Morning Ritual" : "Evening Ritual", MARGIN + 18, y + 8);

    setFont("normal", 8, subText);
    doc.text(isAM ? "Protect & Prevent" : "Repair & Restore", MARGIN + 18, y + 13);

    y += 18;

    items.forEach((item, idx) => {
      const cardHeight = item.example ? 28 : 22;
      ensureSpace(cardHeight + 4);

      // Card background
      setFill(rowBg);
      setDraw(rowBorder);
      doc.setLineWidth(0.25);
      doc.roundedRect(MARGIN, y, COL, cardHeight, 2, 2, "FD");

      // Step number circle
      setFill(accent);
      doc.setFillColor(...accent, 0.15);
      doc.setFillColor(
        isAM ? 255 : 68,
        isAM ? 237 : 64,
        isAM ? 213 : 60
      );
      doc.circle(MARGIN + 8, y + cardHeight / 2, 5, "F");
      setFont("bold", 8, accent);
      doc.text(String(idx + 1), MARGIN + 8, y + cardHeight / 2 + 0.5, {
        align: "center", baseline: "middle",
      });

      // Type tag
      const typeX = MARGIN + 17;
      setFont("bold", 6.5, typeColor);
      doc.text(item.type.toUpperCase(), typeX, y + 6);

      // Product name
      setFont("bold", 9.5, rowText);
      doc.text(item.name, typeX, y + 12);

      // Note
      setFont("normal", 7.5, rowSub);
      const noteLines = doc.splitTextToSize(item.note, COL - 22);
      doc.text(noteLines[0], typeX, y + 18);

      // Example pill
      if (item.example) {
        setFill(exBg);
        const exLabel = `Try: ${item.example}`;
        const exW = doc.getTextWidth(exLabel) + 8;
        doc.roundedRect(typeX, y + 21, exW, 5, 1, 1, "F");
        setFont("normal", 7, exText);
        doc.text(exLabel, typeX + 4, y + 24.5, { baseline: "middle" });
      }

      y += cardHeight + 3;
    });

    y += 4;
  };

  // ── RENDER AM ─────────────────────────────────────────────────────
  renderRoutine(result.am_routine, true);

  // ── RENDER PM ─────────────────────────────────────────────────────
  renderRoutine(result.pm_routine, false);

  // ── TIPS SECTION ──────────────────────────────────────────────────
  if (result.tips && result.tips.length > 0) {
    ensureSpace(20);
    setFill(STONE_100);
    doc.roundedRect(MARGIN, y, COL, 8, 2, 2, "F");
    setFill([34, 197, 94]);
    doc.roundedRect(MARGIN, y, 2.5, 8, 1, 1, "F");
    setFont("bold", 7.5, [21, 128, 61]);
    doc.text("DERMATOLOGIST NOTES", MARGIN + 6, y + 5);
    y += 12;

    result.tips.forEach((tip) => {
      ensureSpace(10);
      // Bullet dot
      setFill(STONE_400);
      doc.circle(MARGIN + 2, y + 1.5, 1, "F");
      setFont("normal", 8, STONE_600);
      const tipLines = doc.splitTextToSize(tip, COL - 8);
      doc.text(tipLines, MARGIN + 6, y + 2);
      y += tipLines.length * 4.5 + 3;
    });

    y += 4;
  }

  // ── FOOTER ────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    line(MARGIN, 284, W - MARGIN, 284, STONE_200, 0.3);
    setFont("normal", 7, STONE_400);
    doc.text("corium.ai — Clinical Intelligence", MARGIN, 289);
    doc.text(
      `Page ${i} of ${pageCount}`,
      W - MARGIN,
      289,
      { align: "right" }
    );
    setFont("italic", 7, STONE_400);
    doc.text(
      "This protocol is AI-generated and does not constitute medical advice.",
      W / 2,
      293,
      { align: "center" }
    );
  }

  // ── SAVE ──────────────────────────────────────────────────────────
  const safeName = userName
    ? `corium-${userName.toLowerCase().replace(/\s+/g, "-")}-routine.pdf`
    : "corium-routine.pdf";

  doc.save(safeName);
}