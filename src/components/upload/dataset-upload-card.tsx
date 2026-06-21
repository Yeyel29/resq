"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DatasetParseError, parseDatasetFile } from "@/lib/dataset/parse-dataset";
import { createSampleDataset, saveDataset } from "@/lib/dataset/storage";
import type { UploadedDataset } from "@/types/dataset";

type UploadStatus = "idle" | "dragging" | "parsing" | "success" | "error";

export function DatasetUploadCard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [dataset, setDataset] = useState<UploadedDataset | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function parseFile(file: File | undefined) {
    if (!file) {
      setStatus("error");
      setError("No file selected. Please choose a CSV or XLSX file to continue.");
      setDataset(null);
      return;
    }

    setStatus("parsing");
    setError(null);

    try {
      const parsedDataset = await parseDatasetFile(file);
      saveDataset(parsedDataset);
      setDataset(parsedDataset);
      setStatus("success");
    } catch (parseError) {
      setDataset(null);
      setStatus("error");
      setError(
        parseError instanceof DatasetParseError
          ? parseError.message
          : "We could not read this file. Please check that it is a valid CSV or Excel file.",
      );
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    parseFile(event.dataTransfer.files[0]);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (status !== "parsing") {
      setStatus("dragging");
    }
  }

  function handleDragLeave() {
    if (status === "dragging") {
      setStatus(dataset ? "success" : "idle");
    }
  }

  function resetUpload() {
    setStatus("idle");
    setDataset(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function continueToPreview() {
    if (!dataset) {
      setStatus("error");
      setError("No file selected. Please choose a CSV or XLSX file to continue.");
      return;
    }

    saveDataset(dataset);
    router.push("/datasets/uploaded/preview");
  }

  function trySampleDataset() {
    const sampleDataset = createSampleDataset();
    saveDataset(sampleDataset);
    setDataset(sampleDataset);
    setStatus("success");
    setError(null);
    router.push("/datasets/sample/preview");
  }

  const isParsing = status === "parsing";
  const isDragging = status === "dragging";
  const isSuccess = status === "success" && dataset;
  const isError = status === "error" && error;

  return (
    <Card className="p-0">
      <div
        className={cn(
          "flex min-h-[420px] flex-col items-center justify-center rounded-card border-2 border-dashed p-8 text-center transition",
          isDragging && "border-secondary bg-sky-helper/60",
          isParsing && "border-outline-variant bg-surface-low",
          isSuccess && "border-secondary bg-secondary-container/20",
          isError && "border-error bg-error-soft/40",
          status === "idle" && "border-outline-variant bg-white",
        )}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(event) => parseFile(event.target.files?.[0])}
          ref={fileInputRef}
          type="file"
        />

        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-helper text-secondary">
          {isParsing ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : isSuccess ? (
            <CheckCircle2 className="h-10 w-10" />
          ) : isError ? (
            <XCircle className="h-10 w-10 text-error" />
          ) : (
            <UploadCloud className="h-10 w-10" />
          )}
        </div>

        {isParsing ? (
          <>
            <h2 className="text-2xl font-semibold text-primary">Reading your dataset...</h2>
            <p className="mt-3 max-w-lg leading-7 text-on-surface-variant">
              ScholarStat is parsing the first sheet or CSV contents in your browser.
            </p>
          </>
        ) : isSuccess ? (
          <>
            <h2 className="text-2xl font-semibold text-primary">Dataset ready for preview</h2>
            <div className="mt-4 rounded-2xl border border-outline-variant bg-white p-4 text-left shadow-soft">
              <div className="flex items-start gap-3">
                <FileSpreadsheet className="mt-1 h-5 w-5 text-secondary" />
                <div>
                  <p className="font-semibold text-primary">{dataset.name}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {dataset.rowCount.toLocaleString()} rows · {dataset.columnCount} columns
                  </p>
                  {dataset.truncated ? (
                    <p className="mt-2 text-sm font-medium text-amber-800">
                      Only the first 5,000 rows are stored in this MVP preview.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ) : isError ? (
          <>
            <h2 className="text-2xl font-semibold text-error">Upload failed</h2>
            <p className="mt-3 max-w-lg leading-7 text-on-surface-variant">{error}</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-primary">
              Drag and drop your research dataset here
            </h2>
            <p className="mt-3 max-w-lg leading-7 text-on-surface-variant">
              or choose a CSV/XLSX file to begin inspecting your research data.
            </p>
          </>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-semibold text-on-surface-variant">
          <span className="rounded-full bg-surface-high px-4 py-2">CSV, XLSX</span>
          <span className="rounded-full bg-surface-high px-4 py-2">Maximum file size: 10 MB</span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            disabled={isParsing}
            onClick={() => fileInputRef.current?.click()}
            type="button"
            variant="secondary"
          >
            Choose File
          </Button>
          <Button disabled={isParsing} onClick={trySampleDataset} type="button" variant="ghost">
            Try Sample Dataset
          </Button>
          {dataset || error ? (
            <Button disabled={isParsing} onClick={resetUpload} type="button" variant="ghost">
              <RefreshCw className="h-4 w-4" />
              Replace File
            </Button>
          ) : null}
        </div>

        <Button
          className="mt-6"
          disabled={!dataset || isParsing}
          onClick={continueToPreview}
          type="button"
          variant={!dataset || isParsing ? "disabled" : "primary"}
        >
          Continue to Preview
        </Button>
      </div>
    </Card>
  );
}
