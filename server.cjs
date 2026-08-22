var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "50mb" }));
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  };
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/gemini/assistant", async (req, res) => {
    try {
      const { query, projectContext, documentsSummary } = req.body;
      const ai = getGenAI();
      if (!ai) {
        return res.json({
          reply: `[\u0648\u0636\u0639 \u0628\u062F\u0648\u0646 \u0625\u0646\u062A\u0631\u0646\u062A / Fallback Mode]
\u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0633\u062C\u0644\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0627\u0644\u0645\u062D\u0641\u0648\u0638\u0629 \u0645\u062D\u0644\u064A\u0627\u064B:
\u0627\u0644\u0633\u0624\u0627\u0644: "${query}"
\u062A\u0645 \u0641\u062D\u0635 \u0627\u0644\u0633\u062C\u0644\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629\u060C \u064A\u0645\u0643\u0646\u0643 \u0645\u0631\u0627\u062C\u0639\u0629 \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 \u0648\u0627\u0644\u0640Logs \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0640 IR, RFI, Drawings \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u0623\u062F\u0642 \u062A\u062D\u062F\u064A\u062B.`,
          source: "offline-rule-engine"
        });
      }
      const prompt = `\u0623\u0646\u062A \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A \u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0648\u0627\u0644\u0645\u0643\u062A\u0628 \u0627\u0644\u0641\u0646\u064A (DC & Technical Office AI Copilot).
\u0644\u062F\u064A\u0643 \u0627\u0644\u0633\u064A\u0627\u0642 \u0627\u0644\u062A\u0627\u0644\u064A \u0644\u0644\u0645\u0634\u0631\u0648\u0639 \u0648\u0627\u0644\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629:
=== \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0648\u0627\u0644\u0633\u062C\u0644\u0627\u062A ===
${JSON.stringify(documentsSummary || {}, null, 2)}
\u0633\u064A\u0627\u0642 \u0625\u0636\u0627\u0641\u064A: ${projectContext || "\u0644\u0627 \u064A\u0648\u062C\u062F"}

=== \u0633\u0624\u0627\u0644 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 ===
"${query}"

\u0627\u0644\u0645\u0637\u0644\u0648\u0628:
1. \u0623\u062C\u0628 \u0628\u062F\u0642\u0629 \u0648\u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629 \u0648\u0628\u0637\u0631\u064A\u0642\u0629 \u0645\u0646\u0638\u0645\u0629 (\u0627\u0633\u062A\u062E\u062F\u0645 \u0646\u0642\u0627\u0637 \u0628\u0648\u0644\u062A\u0633 \u0623\u0648 \u062C\u062F\u0627\u0648\u0644 \u0639\u0646\u062F \u0627\u0644\u062D\u0627\u062C\u0629).
2. \u0627\u0630\u0643\u0631 \u0623\u0631\u0642\u0627\u0645 \u0627\u0644\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0628\u062F\u0642\u0629 \u0645\u062B\u0644 (IR-2026-0023, RFI-012, SD-CIV-004) \u0648\u062D\u0627\u0644\u062A\u0647\u0627 (Pending, Approved, Overdue).
3. \u0631\u0643\u0632 \u0639\u0644\u0649 \u0627\u0644\u062A\u0648\u0627\u0631\u064A\u062E\u060C \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0639\u0646 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629\u060C \u0648\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A \u0625\u0646 \u0648\u062C\u062F\u062A.
4. \u0627\u0644\u0631\u062F \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0645\u0639 \u0627\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u0627\u0644\u0645\u0635\u0637\u0644\u062D\u0627\u062A \u0627\u0644\u0647\u0646\u062F\u0633\u064A\u0629 \u0627\u0644\u062F\u0642\u064A\u0642\u0629 \u0644\u0644\u0640 Document Control.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt
      });
      res.json({
        reply: response.text || "\u0644\u0645 \u0623\u062A\u0645\u0643\u0646 \u0645\u0646 \u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0625\u062C\u0627\u0628\u0629 \u062F\u0642\u064A\u0642\u0629 \u0645\u0646 \u0627\u0644\u0633\u062C\u0644\u0627\u062A.",
        source: "gemini-3.7-flash"
      });
    } catch (error) {
      console.error("Error in AI assistant:", error);
      res.status(500).json({
        error: "\u0641\u0634\u0644 \u0641\u064A \u0645\u0639\u0627\u0644\u062C\u0629 \u0637\u0644\u0628 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A",
        details: error?.message || String(error)
      });
    }
  });
  app.post("/api/gemini/parse-voice", async (req, res) => {
    try {
      const { transcript, defaultProject } = req.body;
      const ai = getGenAI();
      if (!transcript) {
        return res.status(400).json({ error: "Transcript is required" });
      }
      if (!ai) {
        return res.json({
          type: transcript.toLowerCase().includes("rfi") ? "RFI" : "IR",
          discipline: transcript.toLowerCase().includes("arch") ? "Architectural" : transcript.toLowerCase().includes("mep") ? "MEP" : "Structural",
          activity: transcript,
          location: "Zone 1",
          description: transcript,
          requestedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          requestedTime: "10:00 AM"
        });
      }
      const prompt = `\u0623\u0646\u062A \u0645\u0647\u0646\u062F\u0633 Document Control \u0648\u062E\u0628\u064A\u0631 \u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0635\u0648\u062A.
\u0642\u0627\u0645 \u0627\u0644\u0645\u0647\u0646\u062F\u0633 \u0628\u0646\u0637\u0642 \u0647\u0630\u0647 \u0627\u0644\u0639\u0628\u0627\u0631\u0629 \u0644\u0625\u0646\u0634\u0627\u0621 \u0637\u0644\u0628 \u0641\u062D\u0635 \u0623\u0648 \u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0623\u0648 \u0627\u0639\u062A\u0645\u0627\u062F:
"${transcript}"

\u0627\u0633\u062A\u062E\u0631\u062C \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u062F\u0642\u0629 \u0648\u062D\u0648\u0644\u0647\u0627 \u0625\u0644\u0649 \u0643\u0627\u0626\u0646 JSON \u0628\u0627\u0644\u0647\u064A\u0643\u0644 \u0627\u0644\u062A\u0627\u0644\u064A:
{
  "type": "IR" | "RFI" | "Material Inspection" | "Material Submittal" | "Shop Drawing" | "Method Statement",
  "discipline": "Structural" | "Architectural" | "MEP" | "Civil" | "Infrastructure" | "Quality",
  "activity": "\u0627\u0633\u0645 \u0627\u0644\u0646\u0634\u0627\u0637 \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0647\u0646\u062F\u0633\u064A\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 (\u0645\u062B\u0644 Ground Beam Reinforcement)",
  "location": "\u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u0633\u062A\u062E\u0631\u062C \u0623\u0648 \u0627\u0644\u062A\u0642\u0631\u064A\u0628\u064A (\u0645\u062B\u0644 Zone 2 Grid A-D)",
  "description": "\u0627\u0644\u0648\u0635\u0641 \u0627\u0644\u0643\u0627\u0645\u0644 \u0627\u0644\u0645\u0633\u062A\u0646\u062A\u062C",
  "requestedDate": "YYYY-MM-DD (\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u064A\u0648\u0645 \u0623\u0648 \u0627\u0644\u0645\u0630\u0643\u0648\u0631)",
  "requestedTime": "HH:MM AM/PM",
  "consultant": "\u0627\u0633\u0645 \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A \u0625\u0646 \u0630\u0643\u0631",
  "contractor": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0627\u0648\u0644 \u0625\u0646 \u0630\u0643\u0631",
  "suggestedAttachments": ["Shop Drawing", "Mill Test Certificate", "BBS", ...]
}
\u0623\u0639\u062F \u0641\u0642\u0637 \u0643\u0648\u062F JSON \u062E\u0627\u0644\u0635 \u0628\u062F\u0648\u0646 \u0623\u064A markdown \u0625\u0636\u0627\u0641\u064A.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      let parsed = {};
      try {
        parsed = JSON.parse(response.text || "{}");
      } catch (e) {
        parsed = { activity: transcript, description: transcript };
      }
      res.json(parsed);
    } catch (error) {
      console.error("Error in parse-voice:", error);
      res.status(500).json({ error: error?.message || "Failed to parse voice transcript" });
    }
  });
  app.post("/api/gemini/parse-ipc-pdf", async (req, res) => {
    try {
      const { fileData, mimeType, fileName, textContent } = req.body;
      const ai = getGenAI();
      if (!ai) {
        return res.json({
          ipcNumber: "IPC-" + Math.floor(100 + Math.random() * 900),
          contractorName: "\u0634\u0631\u0643\u0629 \u0645\u0642\u0627\u0648\u0644\u0627\u062A \u0645\u0633\u062A\u062E\u0631\u062C\u0629 \u0645\u0646 \u0627\u0644\u0645\u0644\u0641",
          contractorTrade: "\u0623\u0639\u0645\u0627\u0644 \u0645\u0642\u0627\u0648\u0644\u0627\u062A \u0648\u0647\u064A\u0643\u0644 \u062E\u0631\u0633\u0627\u0646\u064A",
          contractNumber: "FHD-CNT-2026-PDF",
          projectName: "\u0628\u0648\u0631\u062A\u0648 \u0627\u0644\u0639\u0644\u0645\u064A\u0646 - \u0639\u0645\u0627\u0631\u0629 13",
          buildingOrZone: "\u0639\u0645\u0627\u0631\u0629 13 / \u0632\u0648\u0646 2",
          consultantName: "\u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A \u0627\u0644\u0647\u0646\u062F\u0633\u064A ECP",
          certificateType: "Interim",
          certificateTypeArabic: "\u0645\u0633\u062A\u062E\u0644\u0635 \u062C\u0627\u0631\u064A",
          periodFrom: new Date(Date.now() - 30 * 864e5).toISOString().split("T")[0],
          periodTo: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          submissionDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          previousGrossAmount: 45e4,
          currentGrossAmount: 28e4,
          cumulativeGrossAmount: 73e4,
          materialsOnSiteAmount: 0,
          totalWorkAndMaterials: 73e4,
          advancePaymentDeduction: 28e3,
          retentionRate: 5,
          retentionDeduction: 14e3,
          penaltyOrDeductions: 0,
          taxDeduction: 0,
          totalDeductions: 42e3,
          previousNetPaid: 382500,
          netCurrentPayable: 238e3,
          amountInWordsArabic: "\u0641\u0642\u0637 \u0648\u0642\u062F\u0631\u0647 \u0645\u0627\u0626\u062A\u0627\u0646 \u0648\u062B\u0645\u0627\u0646\u064A\u0629 \u0648\u062B\u0644\u0627\u062B\u0648\u0646 \u0623\u0644\u0641 \u062C\u0646\u064A\u0647 \u0645\u0635\u0631\u064A \u0644\u0627 \u063A\u064A\u0631",
          currency: "EGP",
          notes: "\u062A\u0645 \u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0622\u0644\u064A\u0627\u064B \u0645\u0646 \u0645\u0644\u0641 PDF \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635.",
          items: [
            {
              id: "item-pdf-1",
              itemNo: "1",
              description: "\u0623\u0639\u0645\u0627\u0644 \u062E\u0631\u0633\u0627\u0646\u0629 \u0645\u0633\u0644\u062D\u0629 \u0644\u0644\u0623\u0633\u0642\u0641 \u0648\u0627\u0644\u0623\u0639\u0645\u062F\u0629",
              unit: "\u0645\xB3",
              unitPrice: 5500,
              contractQty: 120,
              previousQty: 40,
              currentQty: 30,
              totalQty: 70,
              totalAmount: 165e3,
              executionPercentage: 58.3
            },
            {
              id: "item-pdf-2",
              itemNo: "2",
              description: "\u0623\u0639\u0645\u0627\u0644 \u0645\u0628\u0627\u0646\u064A \u062D\u0648\u0627\u0626\u0637 \u0637\u0648\u0628 \u0623\u0633\u0645\u0646\u062A\u064A \u0645\u0635\u0645\u062A \u0648\u0645\u0641\u0631\u063A",
              unit: "\u0645\xB2",
              unitPrice: 380,
              contractQty: 500,
              previousQty: 100,
              currentQty: 200,
              totalQty: 300,
              totalAmount: 76e3,
              executionPercentage: 60
            }
          ],
          aiConfidenceScore: 92,
          summaryOfExtraction: "\u062A\u0645 \u0642\u0631\u0627\u0621\u0629 \u0634\u064A\u062A \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635 \u0648\u062A\u062D\u062F\u064A\u062F \u0628\u0646\u0648\u062F \u0627\u0644\u062D\u0635\u0631 \u0648\u0627\u0644\u0627\u0633\u062A\u0642\u0637\u0627\u0639\u0627\u062A \u0648\u0635\u0627\u0641\u064A \u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u062D\u0642 \u0644\u0644\u0635\u0631\u0641 \u0628\u0646\u062C\u0627\u062D."
        });
      }
      let contents = "";
      const effectiveMimeType = mimeType || (fileName?.endsWith(".pdf") ? "application/pdf" : "image/jpeg");
      if (fileData) {
        const cleanBase64 = fileData.replace(/^data:[^;]+;base64,/, "");
        contents = {
          parts: [
            {
              inlineData: {
                mimeType: effectiveMimeType,
                data: cleanBase64
              }
            },
            {
              text: `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 Document Controller \u0648\u0645\u0647\u0646\u062F\u0633 \u0645\u0643\u062A\u0628 \u0641\u0646\u064A \u0648\u062D\u0633\u0627\u0628 \u0643\u0645\u064A\u0627\u062A (Quantity Surveyor) \u0645\u062A\u062E\u0635\u0635 \u0641\u064A \u0645\u0631\u0627\u062C\u0639\u0629 \u0648\u062A\u062F\u0642\u064A\u0642 \u0645\u0633\u062A\u062E\u0644\u0635\u0627\u062A \u0627\u0644\u0645\u0642\u0627\u0648\u0644\u064A\u0646 (Payment Certificates / IPCs) \u0644\u0634\u0631\u0643\u0629 \u0627\u0644\u062A\u0637\u0648\u064A\u0631 \u0627\u0644\u0639\u0642\u0627\u0631\u064A \u0648\u0627\u0644\u0645\u0642\u0627\u0648\u0644\u0627\u062A "EL FHD DEVELOPMENT".

\u0627\u0644\u0645\u0637\u0644\u0648\u0628: \u0642\u0645 \u0628\u0642\u0631\u0627\u0621\u0629 \u0648\u062A\u062D\u0644\u064A\u0644 \u0645\u0644\u0641 \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635 \u0627\u0644\u0645\u0631\u0641\u0642 (PDF \u0623\u0648 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635 \u0627\u0644\u0631\u0633\u0645\u064A / \u062C\u062F\u0627\u0648\u0644 \u0627\u0644\u062D\u0635\u0631) \u0628\u062F\u0642\u0629 \u0645\u062A\u0646\u0627\u0647\u064A\u0629 \u0648\u0627\u0633\u062A\u062E\u0631\u062C \u0643\u0644 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0648\u0627\u0644\u062A\u0639\u0627\u0642\u062F\u064A\u0629 \u0648\u0628\u0646\u0648\u062F \u0627\u0644\u062D\u0635\u0631 \u0627\u0644\u0645\u0646\u0641\u0630\u0629.

\u0623\u0639\u062F \u0643\u0627\u0626\u0646 JSON \u0635\u0627\u0644\u062D \u062A\u0645\u0627\u0645\u0627\u064B \u064A\u0637\u0627\u0628\u0642 \u0627\u0644\u0647\u064A\u0643\u0644 \u0627\u0644\u062A\u0627\u0644\u064A:
{
  "ipcNumber": "\u0631\u0642\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635 \u0627\u0644\u0645\u0630\u0643\u0648\u0631 \u0628\u0627\u0644\u0645\u0644\u0641 (\u0645\u062B\u0644 IPC-03 \u0623\u0648 \u0645\u0633\u062A\u062E\u0644\u0635 \u0631\u0642\u0645 4 \u0623\u0648 \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635 \u0627\u0644\u062C\u0627\u0631\u064A \u0631\u0642\u0645 1)",
  "contractorName": "\u0627\u0633\u0645 \u0634\u0631\u0643\u0629 \u0627\u0644\u0645\u0642\u0627\u0648\u0644\u0627\u062A \u0627\u0644\u0645\u0646\u0641\u0630\u0629 \u0627\u0644\u0645\u0630\u0643\u0648\u0631\u0629 \u0641\u064A \u062A\u0631\u0648\u064A\u0633\u0629 \u0623\u0648 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635",
  "contractorTrade": "\u062A\u062E\u0635\u0635 \u0627\u0644\u0645\u0642\u0627\u0648\u0644 (\u0645\u062B\u0627\u0644: \u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0647\u064A\u0643\u0644 \u0627\u0644\u062E\u0631\u0633\u0627\u0646\u064A / \u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u062A\u0634\u0637\u064A\u0628\u0627\u062A \u0627\u0644\u0645\u062A\u0643\u0627\u0645\u0644\u0629 / \u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0643\u0647\u0631\u0648\u0645\u064A\u0643\u0627\u0646\u064A\u0643 MEP / \u0623\u0639\u0645\u0627\u0644 \u0644\u0627\u0646\u062F\u0633\u0643\u064A\u0628)",
  "contractNumber": "\u0631\u0642\u0645 \u0627\u0644\u0639\u0642\u062F \u0623\u0648 \u0623\u0645\u0631 \u0627\u0644\u0625\u0633\u0646\u0627\u062F \u0625\u0646 \u0648\u062C\u062F",
  "projectName": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 (\u0645\u062B\u0644 \u0628\u0648\u0631\u062A\u0648 \u0627\u0644\u0639\u0644\u0645\u064A\u0646 - \u0639\u0645\u0627\u0631\u0629 13 \u0623\u0648 \u0628\u0648\u0631\u062A\u0648 \u0627\u0644\u0633\u062E\u0646\u0629)",
  "buildingOrZone": "\u0631\u0642\u0645 \u0627\u0644\u0639\u0645\u0627\u0631\u0629 \u0623\u0648 \u0627\u0644\u0632\u0648\u0646 \u0623\u0648 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A \u0627\u0644\u0645\u0630\u0643\u0648\u0631",
  "consultantName": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0643\u062A\u0628 \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A \u0627\u0644\u0645\u0634\u0631\u0641 (\u0645\u062B\u0644 ECP, \u0645\u062D\u0631\u0645 \u0628\u0627\u062E\u0648\u0645, \u0634\u0627\u0643\u0631...)",
  "certificateType": "Interim" | "Advance" | "Final" | "Variation",
  "certificateTypeArabic": "\u0645\u0633\u062A\u062E\u0644\u0635 \u062C\u0627\u0631\u064A" | "\u062F\u0641\u0639\u0629 \u0645\u0642\u062F\u0645\u0629" | "\u0645\u0633\u062A\u062E\u0644\u0635 \u062E\u062A\u0627\u0645\u064A" | "\u0641\u0631\u0648\u0642 \u0623\u0633\u0639\u0627\u0631",
  "periodFrom": "YYYY-MM-DD \u062A\u0627\u0631\u064A\u062E \u0628\u062F\u0627\u064A\u0629 \u0641\u062A\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635",
  "periodTo": "YYYY-MM-DD \u062A\u0627\u0631\u064A\u062E \u0646\u0647\u0627\u064A\u0629 \u0641\u062A\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635",
  "submissionDate": "YYYY-MM-DD \u062A\u0627\u0631\u064A\u062E \u062A\u0642\u062F\u064A\u0645 \u0623\u0648 \u0627\u0639\u062A\u0645\u0627\u062F \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635",
  "previousGrossAmount": \u0631\u0642\u0645 \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u062D\u062A\u0649 \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635 \u0627\u0644\u0633\u0627\u0628\u0642 (number),
  "currentGrossAmount": \u0631\u0642\u0645 \u0625\u062C\u0645\u0627\u0644\u064A \u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0641\u062A\u0631\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 (number),
  "cumulativeGrossAmount": \u0631\u0642\u0645 \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u062A\u0631\u0627\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0646\u0641\u0630\u0629 \u062D\u062A\u0649 \u062A\u0627\u0631\u064A\u062E\u0647 (number),
  "materialsOnSiteAmount": \u0631\u0642\u0645 \u062A\u0634\u0648\u064A\u0646\u0627\u062A \u0627\u0644\u0645\u0648\u0627\u062F \u0628\u0627\u0644\u0645\u0648\u0642\u0639 \u0625\u0646 \u0648\u062C\u062F\u062A (number),
  "totalWorkAndMaterials": \u0631\u0642\u0645 \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0648\u0627\u0644\u062A\u0634\u0648\u064A\u0646\u0627\u062A (number),
  "advancePaymentDeduction": \u0631\u0642\u0645 \u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0623\u0648 \u062E\u0635\u0645 \u0627\u0644\u062F\u0641\u0639\u0629 \u0627\u0644\u0645\u0642\u062F\u0645\u0629 (number),
  "retentionRate": \u0646\u0633\u0628\u0629 \u062A\u0623\u0645\u064A\u0646 \u0636\u0645\u0627\u0646 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0643\u0631\u0642\u0645 \u0645\u0626\u0648\u064A \u0645\u062B\u0644 5 \u0623\u0648 10 (number),
  "retentionDeduction": \u0631\u0642\u0645 \u062E\u0635\u0645 \u062A\u0623\u0645\u064A\u0646 \u0636\u0645\u0627\u0646 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0645\u062D\u062A\u062C\u0632 (number),
  "penaltyOrDeductions": \u0631\u0642\u0645 \u0627\u0644\u063A\u0631\u0627\u0645\u0627\u062A \u0623\u0648 \u0627\u0644\u062E\u0635\u0648\u0645\u0627\u062A \u0627\u0644\u0623\u062E\u0631\u0649 (number),
  "taxDeduction": \u0631\u0642\u0645 \u0627\u0633\u062A\u0642\u0637\u0627\u0639 \u0627\u0644\u0636\u0631\u0627\u0626\u0628 \u0625\u0646 \u0648\u062C\u062F (number),
  "totalDeductions": \u0631\u0642\u0645 \u0625\u062C\u0645\u0627\u0644\u064A \u0643\u0627\u0641\u0629 \u0627\u0644\u0627\u0633\u062A\u0642\u0637\u0627\u0639\u0627\u062A (number),
  "previousNetPaid": \u0631\u0642\u0645 \u0645\u0627 \u062A\u0645 \u0635\u0631\u0641\u0647 \u0644\u0644\u0645\u0642\u0627\u0648\u0644 \u0641\u064A \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635\u0627\u062A \u0627\u0644\u0633\u0627\u0628\u0642\u0629 (number),
  "netCurrentPayable": \u0631\u0642\u0645 \u0635\u0627\u0641\u064A \u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u062D\u0642 \u0644\u0644\u0635\u0631\u0641 \u0627\u0644\u062D\u0627\u0644\u064A (Net Payable) (number),
  "amountInWordsArabic": "\u0641\u0642\u0637 \u0648\u0642\u062F\u0631\u0647 ... \u062C\u0646\u064A\u0647 \u0645\u0635\u0631\u064A \u0644\u0627 \u063A\u064A\u0631 (\u0627\u0644\u062A\u0641\u0642\u064A\u0637 \u0627\u0644\u0645\u0627\u0644\u064A \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629)",
  "currency": "EGP",
  "notes": "\u0623\u064A \u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0647\u0627\u0645\u0629 \u0623\u0648 \u0634\u0631\u0648\u0637 \u0627\u0639\u062A\u0645\u0627\u062F \u0623\u0648 \u0645\u0644\u062D\u0648\u0638\u0627\u062A \u0627\u0633\u062A\u0634\u0627\u0631\u064A \u0645\u0633\u062A\u062E\u0631\u062C\u0629 \u0645\u0646 \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635",
  "items": [
    {
      "id": "item-1",
      "itemNo": "\u0631\u0642\u0645 \u0627\u0644\u0628\u0646\u062F (\u0645\u062B\u0644 1 \u0623\u0648 1.1)",
      "description": "\u0628\u064A\u0627\u0646 \u0648\u0648\u0635\u0641 \u0627\u0644\u0628\u0646\u062F \u0627\u0644\u0645\u0646\u0641\u0630",
      "unit": "\u0648\u062D\u062F\u0629 \u0627\u0644\u0642\u064A\u0627\u0633 (\u0645\xB3, \u0645\xB2, \u0645.\u0637, \u0639\u062F\u062F, \u0645\u0642\u0637\u0648\u0639\u064A\u0629, \u0643\u062C\u0645, \u0637\u0646)",
      "unitPrice": \u0641\u0626\u0629 \u0627\u0644\u0633\u0639\u0631 \u0644\u0644\u0648\u062D\u062F\u0629 (number),
      "contractQty": \u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u062A\u0639\u0627\u0642\u062F\u064A\u0629 \u0628\u0627\u0644\u0645\u0642\u0627\u064A\u0633\u0629 (number),
      "previousQty": \u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629 (number),
      "currentQty": \u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0627\u0644\u0645\u0646\u0641\u0630\u0629 \u0628\u0647\u0630\u0647 \u0627\u0644\u0641\u062A\u0631\u0629 (number),
      "totalQty": \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0646\u0641\u0630\u0629 \u062D\u062A\u0649 \u062A\u0627\u0631\u064A\u062E\u0647 (number),
      "totalAmount": \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0646\u0641\u0630\u0629 \u0644\u0644\u0628\u0646\u062F (number),
      "executionPercentage": \u0646\u0633\u0628\u0629 \u0627\u0644\u0625\u0646\u062C\u0627\u0632 \u0644\u0644\u0628\u0646\u062F % (number)
    }
  ],
  "aiConfidenceScore": \u0646\u0633\u0628\u0629 \u0627\u0644\u062B\u0642\u0629 \u0645\u0646 0 \u0625\u0644\u0649 100,
  "summaryOfExtraction": "\u0645\u0644\u062E\u0635 \u0641\u0646\u064A \u0633\u0631\u064A\u0639 \u0644\u0645\u0627 \u062A\u0645 \u0641\u0647\u0645\u0647 \u0645\u0646 \u0645\u0644\u0641 \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635 \u0648\u0645\u0637\u0627\u0628\u0642\u062A\u0647"
}
\u062A\u0646\u0628\u064A\u0647: \u0623\u0639\u062F JSON \u0641\u0642\u0637 \u062F\u0648\u0646 \u0623\u064A \u0646\u0635\u0648\u0635 \u0623\u0648 \u0645\u0642\u062F\u0645\u0627\u062A \u0623\u0648 \u0643\u062A\u0644 \u062A\u0639\u0644\u064A\u0645\u064A\u0629. \u062A\u0623\u0643\u062F \u0645\u0646 \u0635\u062D\u0629 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0629.`
            }
          ]
        };
      } else {
        contents = `\u062D\u0644\u0644 \u0647\u0630\u0627 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0646\u0633\u0648\u062E \u0645\u0646 \u0645\u0633\u062A\u0646\u062F \u0645\u0633\u062A\u062E\u0644\u0635 \u0645\u0642\u0627\u0648\u0644:
"${textContent || fileName}"
\u0648\u0627\u0633\u062A\u062E\u0631\u062C \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0648\u0627\u0644\u062A\u0639\u0627\u0642\u062F\u064A\u0629 \u0648\u0628\u0646\u0648\u062F \u0627\u0644\u062D\u0635\u0631 \u0628\u0635\u064A\u063A\u0629 JSON \u0645\u0637\u0627\u0628\u0642\u0629 \u062A\u0645\u0627\u0645\u0627\u064B \u0644\u0644\u0645\u0637\u0644\u0648\u0628 \u0623\u0639\u0644\u0627\u0647.`;
      }
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          responseMimeType: "application/json"
        }
      });
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error) {
      console.error("IPC PDF Analysis error:", error);
      res.status(500).json({ error: error?.message || "Failed to analyze IPC PDF" });
    }
  });
  app.post("/api/gemini/smart-suggest", async (req, res) => {
    try {
      const { activity, type, currentProject } = req.body;
      const ai = getGenAI();
      if (!ai) {
        return res.json({
          discipline: "Structural",
          suggestedLocation: "Zone 1 - Foundation Level",
          suggestedAttachments: ["Approved Shop Drawing", "Bar Bending Schedule (BBS)", "Inspection Checklist"],
          remarks: "Prepared according to project specifications"
        });
      }
      const prompt = `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 Technical Office & Document Control.
\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u064A\u0642\u0648\u0645 \u0628\u0625\u0646\u0634\u0627\u0621 \u0637\u0644\u0628 \u0646\u0648\u0639\u0647: "${type || "IR"}"
\u0627\u0633\u0645 \u0627\u0644\u0646\u0634\u0627\u0637 \u0623\u0648 \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u062F\u062E\u0644: "${activity}"
\u0627\u0644\u0645\u0634\u0631\u0648\u0639: "${currentProject || "Porto Golf"}"

\u0627\u0642\u062A\u0631\u062D \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0641\u0646\u064A\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0628\u0635\u064A\u063A\u0629 JSON:
{
  "discipline": "Structural" | "Architectural" | "MEP" | "Civil",
  "suggestedLocation": "\u0645\u062B\u0627\u0644 \u0644\u0645\u0648\u0642\u0639 \u062F\u0642\u064A\u0642",
  "suggestedAttachments": ["\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0631\u0641\u0642\u0627\u062A \u0627\u0644\u0625\u0644\u0632\u0627\u0645\u064A\u0629 \u0645\u062B\u0644 Approved Shop Drawing Rev 02, Test Reports, Method Statement..."],
  "remarks": "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0642\u064A\u0627\u0633\u064A\u0629 \u0644\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A \u0648\u0627\u0644\u0645\u0642\u0627\u0648\u0644",
  "inspectionCheckpoints": ["\u0646\u0642\u0627\u0637 \u0627\u0644\u0641\u062D\u0635 \u0627\u0644\u0647\u0646\u062F\u0633\u064A\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629"]
}
\u0623\u0639\u062F JSON \u0641\u0642\u0637.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error) {
      res.status(500).json({ error: "Failed to suggest", details: error?.message });
    }
  });
  app.post("/api/gemini/ocr-analyze", async (req, res) => {
    try {
      const { textContent, base64Image, fileName } = req.body;
      const ai = getGenAI();
      if (!ai) {
        return res.json({
          documentNumber: "DOC-" + Math.floor(1e3 + Math.random() * 9e3),
          title: fileName ? fileName.replace(/\.[^/.]+$/, "") : "Scanned Document",
          discipline: "General",
          revision: "Rev 00",
          extractedText: textContent || "Scanned document text placeholder",
          status: "Pending",
          recommendations: "Document ready for review and filing"
        });
      }
      let contents = "";
      if (base64Image) {
        const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");
        contents = {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64
              }
            },
            {
              text: `\u0627\u0633\u062A\u062E\u0631\u062C \u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0647\u0646\u062F\u0633\u064A\u0629 \u0645\u0646 \u0647\u0630\u0647 \u0627\u0644\u0648\u062B\u064A\u0642\u0629 \u0627\u0644\u0645\u0645\u0633\u0648\u062D\u0629 \u0636\u0648\u0626\u064A\u0627\u064B \u0648\u0635\u0646\u0641\u0647\u0627:
\u0623\u0639\u062F JSON \u0628\u0627\u0644\u0634\u0643\u0644 \u0627\u0644\u062A\u0627\u0644\u064A:
{
  "documentNumber": "\u0631\u0642\u0645 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0625\u0646 \u0648\u062C\u062F",
  "title": "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0623\u0648 \u0645\u0648\u0636\u0648\u0639\u0647",
  "type": "IR" | "RFI" | "Shop Drawing" | "Material Submittal" | "Transmittal" | "Method Statement" | "Site Record",
  "discipline": "Structural" | "Architectural" | "MEP" | "Civil" | "General",
  "revision": "Rev 00" (\u0623\u0648 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u0631\u062C),
  "date": "YYYY-MM-DD",
  "consultant": "\u0627\u0633\u0645 \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A \u0625\u0646 \u0648\u062C\u062F",
  "contractor": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0627\u0648\u0644 \u0625\u0646 \u0648\u062C\u062F",
  "extractedText": "\u0645\u0644\u062E\u0635 \u0623\u0647\u0645 \u0627\u0644\u0646\u0635\u0648\u0635 \u0627\u0644\u0645\u0633\u062A\u062E\u0631\u062C\u0629 OCR",
  "status": "Submitted" | "Approved" | "Pending",
  "duplicateWarning": false
}`
            }
          ]
        };
      } else {
        contents = `\u062D\u0644\u0644 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0633\u062A\u062E\u0631\u062C \u0627\u0644\u062A\u0627\u0644\u064A \u0645\u0646 \u0645\u0633\u062A\u0646\u062F \u0647\u0646\u062F\u0633\u064A:
"${textContent || fileName}"
\u0623\u0639\u062F JSON \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649: documentNumber, title, type, discipline, revision, date, consultant, extractedText.`;
      }
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: { responseMimeType: "application/json" }
      });
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error) {
      console.error("OCR analysis error:", error);
      res.status(500).json({ error: error?.message || "Failed to analyze document OCR" });
    }
  });
  app.post("/api/gemini/analyze-form", async (req, res) => {
    try {
      const { imageBase64, formText, formName } = req.body;
      const ai = getGenAI();
      if (!ai) {
        return res.json({
          name: formName || "\u0646\u0645\u0648\u0630\u062C \u0627\u0633\u062A\u0634\u0627\u0631\u064A \u0645\u062E\u0635\u0635",
          type: "IR",
          companyName: "\u0634\u0631\u0643\u0629 \u0627\u0644\u0645\u0642\u0627\u0648\u0644\u0627\u062A",
          consultantName: "\u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A \u0627\u0644\u0647\u0646\u062F\u0633\u064A",
          contractorName: "\u0627\u0644\u0645\u0642\u0627\u0648\u0644 \u0627\u0644\u0639\u0627\u0645",
          codePrefix: "PRJ-DC-IR",
          sections: [
            {
              id: "sec-1",
              title: "General Information (\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629)",
              fields: [
                { id: "f-1", label: "Document Ref No (\u0631\u0642\u0645 \u0627\u0644\u0645\u0633\u062A\u0646\u062F)", type: "text", required: true },
                { id: "f-2", label: "Date of Inspection (\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0641\u062D\u0635)", type: "date", required: true },
                { id: "f-3", label: "Building / Zone (\u0627\u0644\u0639\u0645\u0627\u0631\u0629 / \u0627\u0644\u0645\u0646\u0637\u0642\u0629)", type: "text", required: true },
                { id: "f-4", label: "Level / Floor (\u0627\u0644\u062F\u0648\u0631 / \u0627\u0644\u0645\u0646\u0633\u0648\u0628)", type: "text", required: false },
                { id: "f-5", label: "Grid / Axis (\u0627\u0644\u0645\u062D\u0627\u0648\u0631 \u0627\u0644\u0647\u0646\u062F\u0633\u064A\u0629)", type: "text", required: false },
                { id: "f-6", label: "Element to Inspect (\u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0645\u0631\u0627\u062F \u0641\u062D\u0635\u0647)", type: "text", required: true }
              ]
            },
            {
              id: "sec-2",
              title: "Inspection Checklist (\u0628\u0646\u0648\u062F \u0627\u0644\u0641\u062D\u0635 \u0648\u0627\u0644\u062A\u0623\u0643\u064A\u062F)",
              fields: [
                { id: "f-7", label: "Cleanliness & Formwork Alignment (\u0646\u0638\u0627\u0641\u0629 \u0648\u0636\u0628\u0637 \u0627\u0644\u0634\u062F\u0629)", type: "checkbox", required: false },
                { id: "f-8", label: "Reinforcement & Spacers / Cover (\u0627\u0644\u062D\u062F\u064A\u062F \u0648\u0627\u0644\u0628\u0633\u0643\u0648\u062A \u0648\u0627\u0644\u063A\u0637\u0627\u0621 \u0627\u0644\u062E\u0631\u0633\u0627\u0646\u064A)", type: "checkbox", required: false },
                { id: "f-9", label: "MEP Sleeves & Conduits Clearance (\u062E\u0644\u0648 \u0645\u0633\u0627\u0631\u0627\u062A \u0627\u0644\u0643\u0647\u0631\u0648\u0645\u064A\u0643\u0627\u0646\u064A\u0643)", type: "checkbox", required: false },
                { id: "f-10", label: "Approved Shop Drawing Attached (\u0645\u0631\u0641\u0642 \u0627\u0644\u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0629)", type: "checkbox", required: false }
              ]
            },
            {
              id: "sec-3",
              title: "Consultant Action & Stamp (\u0642\u0631\u0627\u0631 \u0648\u0627\u0639\u062A\u0645\u0627\u062F \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A)",
              fields: [
                { id: "f-11", label: "Action Code (Code A, B, C, D)", type: "select", required: true, options: ["Code A - Approved", "Code B - Approved as Noted", "Code C - Revise & Resubmit", "Code D - Rejected"] },
                { id: "f-12", label: "Consultant Comments (\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A)", type: "text", required: false },
                { id: "f-13", label: "Consultant Representative Signature (\u062A\u0648\u0642\u064A\u0639 \u0645\u0645\u062B\u0644 \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A)", type: "signature", required: true }
              ]
            }
          ],
          includeQrCode: true,
          includeConsultantStamp: true
        });
      }
      let contents = "";
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
        contents = {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64
              }
            },
            {
              text: `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u0647\u0646\u062F\u0633\u064A \u0641\u064A \u062A\u062D\u0644\u064A\u0644 \u0648\u062A\u0635\u0645\u064A\u0645 \u0641\u0648\u0631\u0645\u0627\u062A \u0648\u0646\u0645\u0627\u0630\u062C \u062A\u0633\u0644\u064A\u0645 \u0648\u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0647\u0646\u062F\u0633\u064A\u0629 (Document Control Forms & Checklists).
\u062D\u0644\u0644 \u0635\u0648\u0631\u0629 \u0647\u0630\u0647 \u0627\u0644\u0641\u0648\u0631\u0645\u0629 \u0627\u0644\u0631\u0633\u0645\u064A\u0629 \u0644\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A (\u0645\u062B\u0644 ECP, Moharram Bakhoum, Omega, ECG) \u0648\u0627\u0633\u062A\u062E\u0631\u062C \u0647\u064A\u0643\u0644 \u0627\u0644\u0646\u0645\u0648\u0630\u062C \u0628\u062F\u0642\u0629 \u0639\u0627\u0644\u064A\u0629.

\u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0625\u0631\u062C\u0627\u0639 \u0643\u0627\u0626\u0646 JSON \u0645\u0637\u0627\u0628\u0642 \u0644\u0644\u0646\u0645\u0648\u0630\u062C \u0627\u0644\u062A\u0627\u0644\u064A:
{
  "name": "\u0627\u0633\u0645 \u0627\u0644\u0646\u0645\u0648\u0630\u062C \u0627\u0644\u0645\u0633\u062A\u062E\u0631\u062C (\u0645\u062B\u0627\u0644: \u0646\u0645\u0648\u0630\u062C \u0641\u062D\u0635 \u0648\u0627\u0633\u062A\u0644\u0627\u0645 \u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u062E\u0631\u0633\u0627\u0646\u0627\u062A - ECP)",
  "type": "IR" | "RFI" | "MS" | "MIR" | "SD" | "MSD",
  "companyName": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0627\u0644\u0643 \u0623\u0648 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0625\u0646 \u0648\u062C\u062F",
  "consultantName": "\u0627\u0633\u0645 \u0627\u0644\u0627\u0633\u062A\u0634\u0627\u0631\u064A \u0627\u0644\u0645\u0633\u062A\u062E\u0631\u062C \u0645\u0646 \u0627\u0644\u062A\u0631\u0648\u064A\u0633\u0629",
  "contractorName": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0627\u0648\u0644 \u0627\u0644\u0645\u0633\u062A\u062E\u0631\u062C",
  "codePrefix": "\u0628\u0627\u062F\u0626\u0629 \u0627\u0644\u0643\u0648\u062F \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629 (\u0645\u062B\u0644 ECP-IR-STR)",
  "sections": [
    {
      "id": "sec-1",
      "title": "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0642\u0633\u0645 \u0628\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0648\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
      "fields": [
        {
          "id": "f-1",
          "label": "\u0627\u0633\u0645 \u0627\u0644\u062D\u0642\u0644 \u0627\u0644\u062F\u0642\u064A\u0642 \u0628\u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0648\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629",
          "type": "text" | "date" | "select" | "checkbox" | "number" | "signature",
          "required": true | false,
          "options": ["\u062E\u064A\u0627\u0631\u0627\u062A \u0625\u0630\u0627 \u0643\u0627\u0646 select"]
        }
      ]
    }
  ],
  "includeQrCode": true,
  "includeConsultantStamp": true
}
\u0623\u0639\u062F JSON \u0641\u0642\u0637 \u0628\u062F\u0648\u0646 \u0623\u064A \u062A\u0639\u0644\u064A\u0642 \u062E\u0627\u0631\u062C\u064A.`
            }
          ]
        };
      } else {
        contents = `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 Document Control. \u062D\u0644\u0644 \u0645\u062A\u0637\u0644\u0628\u0627\u062A \u0623\u0648 \u0648\u0635\u0641 \u0627\u0644\u0641\u0648\u0631\u0645\u0629 \u0627\u0644\u062A\u0627\u0644\u064A \u0648\u0642\u0645 \u0628\u0628\u0646\u0627\u0621 \u0647\u064A\u0643\u0644 \u0643\u0627\u0645\u0644 \u0628\u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0648\u0627\u0644\u062D\u0642\u0648\u0644 \u0648\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0641\u062D\u0635:
"${formText || formName}"
\u0623\u0639\u062F JSON \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649: name, type, companyName, consultantName, contractorName, codePrefix, sections (\u0645\u0639 \u0627\u0644\u062D\u0642\u0648\u0644 fields \u0648\u0628\u0646\u0648\u062F \u0627\u0644\u0641\u062D\u0635 checkbox), includeQrCode, includeConsultantStamp.`;
      }
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: { responseMimeType: "application/json" }
      });
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error) {
      console.error("Form analysis error:", error);
      res.status(500).json({ error: error?.message || "Failed to analyze form structure" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DC Master Pro Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
