(() => {
  "use strict";

  const reader = document.getElementById("cv-reader");
  const container = document.getElementById("viewer-container");
  const controls = document.getElementById("reader-controls");
  const status = document.getElementById("cv-status");
  const pdfUrl = document.getElementById("cv-download").href;

  // A directly opened folder cannot load PDF.js modules. Keep the PDF usable.
  if (window.location.protocol === "file:") {
    const preview = document.createElement("object");
    preview.className = "cv-native-preview";
    preview.type = "application/pdf";
    preview.data = pdfUrl;
    preview.setAttribute("aria-label", "Curriculum vitae PDF preview");
    const fallback = document.createElement("p");
    fallback.textContent = "Use the PDF link below to read the CV.";
    preview.append(fallback);
    reader.replaceChildren(preview);
    reader.hidden = false;
    status.hidden = true;
    return;
  }

  async function startReader() {
    status.textContent = "Loading CV…";

    // The viewer component reads the library installed by the first import.
    const pdfjs = await import("./vendor/pdfjs-6.3.289/build/pdf.mjs");
    const { EventBus, PDFLinkService, PDFViewer } = await import(
      "./vendor/pdfjs-6.3.289/web/pdf_viewer.mjs"
    );
    const vendorUrl = new URL("vendor/pdfjs-6.3.289/", document.baseURI);
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("build/pdf.worker.mjs", vendorUrl).href;

    const eventBus = new EventBus();
    const linkService = new PDFLinkService({
      eventBus,
      externalLinkTarget: 2,
      externalLinkRel: "noopener noreferrer",
    });

    reader.hidden = false;
    const viewer = new PDFViewer({
      container,
      viewer: document.getElementById("pdf-viewer"),
      eventBus,
      linkService,
      annotationMode: pdfjs.AnnotationMode.ENABLE,
      annotationEditorMode: pdfjs.AnnotationEditorType.DISABLE,
      imageResourcesPath: new URL("web/images/", vendorUrl).href,
      maxCanvasPixels: 8388608,
    });
    linkService.setViewer(viewer);

    const previous = document.getElementById("previous-page");
    const next = document.getElementById("next-page");
    const pageStatus = document.getElementById("page-status");
    const zoomOut = document.getElementById("zoom-out");
    const zoomIn = document.getElementById("zoom-in");
    const fitWidth = document.getElementById("fit-width");
    let ready = false;
    let fitToWidth = true;

    function updateControls() {
      if (!ready) return;
      pageStatus.textContent = `Page ${viewer.currentPageNumber} of ${viewer.pagesCount}`;
      previous.disabled = viewer.currentPageNumber === 1;
      next.disabled = viewer.currentPageNumber === viewer.pagesCount;
      zoomOut.disabled = viewer.currentScale <= 0.25;
      zoomIn.disabled = viewer.currentScale >= 3;
      fitWidth.disabled = false;
    }

    eventBus.on("pagesinit", () => {
      ready = true;
      controls.hidden = false;
      viewer.currentScaleValue = "page-width";
      updateControls();
    });
    eventBus.on("pagerendered", ({ error }) => {
      if (error) {
        status.textContent = "The preview could not be displayed. You can open the PDF below.";
        status.hidden = false;
      } else {
        status.hidden = true;
      }
    });
    eventBus.on("pagechanging", updateControls);
    eventBus.on("scalechanging", updateControls);

    previous.addEventListener("click", () => { viewer.currentPageNumber -= 1; });
    next.addEventListener("click", () => { viewer.currentPageNumber += 1; });
    zoomOut.addEventListener("click", () => {
      fitToWidth = false;
      viewer.currentScale = Math.max(0.25, viewer.currentScale / 1.2);
    });
    zoomIn.addEventListener("click", () => {
      fitToWidth = false;
      viewer.currentScale = Math.min(3, viewer.currentScale * 1.2);
    });
    fitWidth.addEventListener("click", () => {
      fitToWidth = true;
      viewer.currentScaleValue = "page-width";
    });

    let previousWidth = container.clientWidth;
    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      if (width === previousWidth) return;
      previousWidth = width;
      if (ready && fitToWidth) viewer.currentScaleValue = "page-width";
    });
    resizeObserver.observe(container);

    const loadingTask = pdfjs.getDocument({
      url: pdfUrl,
      cMapUrl: new URL("cmaps/", vendorUrl).href,
      cMapPacked: true,
      standardFontDataUrl: new URL("standard_fonts/", vendorUrl).href,
      wasmUrl: new URL("wasm/", vendorUrl).href,
      iccUrl: new URL("iccs/", vendorUrl).href,
      isEvalSupported: false,
    });
    const pdf = await loadingTask.promise;
    linkService.setDocument(pdf);
    viewer.setDocument(pdf);
  }

  startReader().catch((error) => {
    reader.hidden = true;
    controls.hidden = true;
    status.hidden = false;
    status.textContent = "The preview is unavailable. You can open the PDF below or download a copy.";
    console.error("CV preview could not be loaded:", error);
  });
})();
