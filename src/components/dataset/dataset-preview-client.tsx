"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Database, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DatasetPreviewTable } from "@/components/dataset/dataset-preview-table";
import { countMissingValues } from "@/lib/dataset/preview";
import { createSampleDataset, readDatasetState, saveDataset } from "@/lib/dataset/storage";
import type { UploadedDataset } from "@/types/dataset";

type PreviewState =
  | { status: "loading" }
  | { status: "ready"; dataset: UploadedDataset; sourceLabel: string }
  | { status: "missing" }
  | { status: "corrupt" };

export function DatasetPreviewClient() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const datasetId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [previewState, setPreviewState] = useState<PreviewState>({ status: "loading" });

  useEffect(() => {
    const storedState = readDatasetState();

    if (datasetId === "sample") {
      const sampleDataset =
        storedState.status === "ready" && storedState.dataset.id === "sample"
          ? storedState.dataset
          : createSampleDataset();

      saveDataset(sampleDataset);
      setPreviewState({
        status: "ready",
        dataset: sampleDataset,
        sourceLabel: storedState.status === "ready" ? "Sample Dataset" : "Fallback Sample Data",
      });
      return;
    }

    if (datasetId === "uploaded") {
      if (storedState.status === "ready" && storedState.dataset.id === "uploaded") {
        setPreviewState({
          status: "ready",
          dataset: storedState.dataset,
          sourceLabel: "Uploaded Dataset",
        });
        return;
      }

      setPreviewState(storedState.status === "corrupt" ? { status: "corrupt" } : { status: "missing" });
      return;
    }

    if (storedState.status === "ready" && storedState.dataset.id === datasetId) {
      setPreviewState({
        status: "ready",
        dataset: storedState.dataset,
        sourceLabel: "Preview Mode",
      });
      return;
    }

    setPreviewState(storedState.status === "corrupt" ? { status: "corrupt" } : { status: "missing" });
  }, [datasetId]);

  function trySampleDataset() {
    const sampleDataset = createSampleDataset();
    saveDataset(sampleDataset);
    router.push("/datasets/sample/preview");
  }

  if (previewState.status === "loading") {
    return (
      <Card>
        <p className="text-sm font-semibold text-on-surface-variant">Loading dataset preview...</p>
      </Card>
    );
  }

  if (previewState.status === "corrupt") {
    return (
      <Card className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-error-soft text-error">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold text-primary">We could not load this dataset</h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-on-surface-variant">
          The saved preview data may be incomplete or expired. Please upload the file again.
        </p>
        <ButtonLink className="mt-6" href="/upload">
          Upload Again
        </ButtonLink>
      </Card>
    );
  }

  if (previewState.status === "missing") {
    return (
      <Card className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-helper text-secondary">
          <Database className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold text-primary">No dataset found</h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-on-surface-variant">
          Upload a CSV or Excel file first, or try the sample dataset to explore ScholarStat.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/upload">Upload Dataset</ButtonLink>
          <Button onClick={trySampleDataset} type="button" variant="secondary">
            Try Sample Dataset
          </Button>
        </div>
      </Card>
    );
  }

  const { dataset, sourceLabel } = previewState;
  const missingValues = countMissingValues(dataset);
  const previewRowsShown = Math.min(dataset.rows.length, 25);
  const profileHref = `/datasets/${dataset.id}/profile`;

  return (
    <div className="min-w-0 space-y-6">
      <PageHeader
        description="Review your uploaded research dataset before profiling and analysis."
        eyebrow="Dataset Preview"
        title="Dataset Preview"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={profileHref}>Continue to Data Profile</ButtonLink>
          <ButtonLink href="/upload" variant="secondary">
            Upload Different File
          </ButtonLink>
        </div>
      </PageHeader>

      <Card className="min-w-0">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-helper text-secondary">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-on-surface-variant">Dataset name</p>
              <h2 className="mt-1 break-words text-2xl font-semibold text-primary">
                {dataset.name}
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Uploaded for this browser session on{" "}
                {new Date(dataset.uploadedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Badge variant={dataset.id === "uploaded" ? "significant" : "text"}>
              {sourceLabel}
            </Badge>
          </div>
        </div>
      </Card>

      {dataset.truncated ? (
        <div className="rounded-card border border-amber-200 bg-warning-soft p-4 text-sm font-semibold text-amber-900">
          This dataset was truncated for the MVP preview. Only the first 5,000 rows are
          available in this session.
          {dataset.originalRowCount ? (
            <span className="mt-1 block">
              Original rows: {dataset.originalRowCount.toLocaleString()}. Stored rows:{" "}
              {dataset.rowCount.toLocaleString()}.
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-card border border-sky-200 bg-sky-helper/70 p-4">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-secondary" />
          <p className="text-sm font-semibold leading-6 text-primary">
            Make sure your dataset does not contain names, student numbers, contact
            details, or other personally identifiable information before continuing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Rows" value={dataset.rowCount.toLocaleString()} />
        <StatCard label="Columns" value={dataset.columnCount.toLocaleString()} />
        <StatCard
          helper="Basic preview check only"
          label="Missing values"
          value={missingValues.toLocaleString()}
        />
        <StatCard
          helper="Default preview page size"
          label="Preview rows shown"
          value={previewRowsShown.toLocaleString()}
        />
      </div>

      <DatasetPreviewTable
        columns={dataset.columns}
        rows={dataset.rows}
      />
    </div>
  );
}
