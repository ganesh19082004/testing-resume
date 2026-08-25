let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        return lib;
    });

    return loadPromise;
}

/**
 * Extract all text from a PDF file using pdfjs-dist.
 * Iterates every page and concatenates text items.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
    const lib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;

    const pageTexts: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items
            .filter((item: any) => item.str !== undefined)
            .map((item: any) => item.str);
        pageTexts.push(strings.join(" "));
    }

    return pageTexts.join("\n\n");
}

/**
 * Extract all text from a DOCX file using mammoth.js.
 */
export async function extractTextFromDOCX(file: File): Promise<string> {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

/**
 * Detect file type and extract text accordingly.
 * Returns { text, error? }.
 */
export async function extractText(
    file: File
): Promise<{ text: string; error?: string }> {
    const name = file.name.toLowerCase();
    const type = file.type;

    try {
        if (name.endsWith(".pdf") || type === "application/pdf") {
            const text = await extractTextFromPDF(file);
            if (!text.trim()) {
                return {
                    text: "",
                    error: "Could not extract text from this PDF. It may be image-based or scanned. Try a text-based PDF.",
                };
            }
            return { text };
        }

        if (
            name.endsWith(".docx") ||
            type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            const text = await extractTextFromDOCX(file);
            if (!text.trim()) {
                return {
                    text: "",
                    error: "Could not extract text from this DOCX file. It may be empty.",
                };
            }
            return { text };
        }

        return {
            text: "",
            error: `Unsupported file type: ${name.split(".").pop()}. Please upload a PDF or DOCX file.`,
        };
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { text: "", error: `Text extraction failed: ${msg}` };
    }
}
