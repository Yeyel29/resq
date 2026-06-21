"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Database, FileSpreadsheet } from "lucide-react";
import { ColumnProfileTable } from "@/components/dataset/column-profile-table";
import { DataQualityWarningPanel } from "@/components/dataset/data-quality-warning-panel";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  createColumnProfiles,
  generateDatasetWarnings,
} from "@/lib/dataset/profile";
import { createSampleDataset, readDatasetState, saveDataset } from "@/lib/dataset/storage";
import type { ColumnProfile, ColumnType, UploadedDataset } from "@/types/dataset";

type ProfileState =
  | { status: "loading" }
  | { status: "ready"; dataset: UploadedDataset; sourceLabel: string }
  | { status: "missing" }
  | { status: "corrupt" };

function getEffectiveType(profile: ColumnProfile) {
  return profile.userConfirmedType ?? profile.detectedType;
}

export function DatasetProfileClient() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const datasetId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [profileState, setProfileState] = useState<ProfileState>({ status: "loading" });

  useEffect(() => {
    const storedState = readDatasetState();

    if (datasetId === "sample") {
      const sampleDataset =
        storedState.status === "ready" && storedState.dataset.id === "sample"
          ? storedState.dataset
          : createSampleDataset();
      const profiles = createColumnProfiles(sampleDataset);
      const datasetWithProfiles = { ...sampleDataset, columnProfiles: profiles };

      saveDataset(datasetWithProfiles);
      setProfileState({
        status: "ready",
        dataset: datasetWithProfiles,
        sourceLabel: "Sample Dataset",
      });
      return;
    }

    if (datasetId === "uploaded") {
      if (storedState.status === "ready" && storedState.dataset.id === "uploaded") {
        const profiles = createColumnProfiles(storedState.dataset);
        const datasetWithProfiles = { ...storedState.dataset, columnProfiles: profiles };

        saveDataset(datasetWithProfiles);
        setProfileState({
          status: "ready",
          dataset: datasetWithProfiles,
          sourceLabel: "Uploaded Dataset",
        });
        return;
      }

      setProfileState(storedState.status === "corrupt" ? { status: "corrupt" } : { status: "missing" });
      return;
    }

    if (storedState.status === "ready" && storedState.dataset.id === datasetId) {
      const profiles = createColumnProfiles(storedState.dataset);
      const datasetWithProfiles = { ...storedState.dataset, columnProfiles: profiles };

      saveDataset(datasetWithProfiles);
      setProfileState({
        status: "ready",
        dataset: datasetWithProfiles,
        sourceLabel: "Preview Mode",
      });
      return;
    }

    setProfileState(storedState.status === "corrupt" ? { status: "corrupt" } : { status: "missing" });
  }, [datasetId]);

  function trySampleDataset() {
    const sampleDataset = createSampleDataset();
    const datasetWithProfiles = {
      ...sampleDataset,
      columnProfiles: createColumnProfiles(sampleDataset),
    };

    saveDataset(datasetWithProfiles);
    router.push("/datasets/sample/profile");
  }

  function handleTypeChange(columnName: string, type: ColumnType) {
    if (profileState.status !== "ready") {
      return;
    }

    const updatedProfiles =
      profileState.dataset.columnProfiles?.map((profile) =>
        profile.name === columnName ? { ...profile, userConfirmedType: type } : profile,
      ) ?? [];
    const updatedDataset = { ...profileState.dataset, columnProfiles: updatedProfiles };

    saveDataset(updatedDataset);
    setProfileState({
      ...profileState,
      dataset: updatedDataset,
    });
  }

  if (profileState.status === "loading") {
    return (
      <Card>
        <p className="text-sm font-semibold text-on-surface-variant">Loading data profile...</p>
      </Card>
    );
  }

  if (profileState.status === "corrupt") {
    return (
      <Card className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-error-soft text-error">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold text-primary">
          We could not load this dataset profile
        </h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-on-surface-variant">
          The saved dataset may be incomplete or expired. Please upload the file again.
        </p>
        <ButtonLink className="mt-6" href="/upload">
          Upload Again
        </ButtonLink>
      </Card>
    );
  }

  if (profileState.status === "missing") {
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

  const { dataset, sourceLabel } = profileState;
  const profiles = dataset.columnProfiles ?? [];
  const warnings = generateDatasetWarnings(profiles);
  const numericCount = profiles.filter((profile) => getEffectiveType(profile) === "numeric").length;
  const categoricalCount = profiles.filter(
    (profile) => getEffectiveType(profile) === "categorical",
  ).length;
  const likertCount = profiles.filter((profile) => getEffectiveType(profile) === "likert").length;
  const totalMissingValues = profiles.reduce(
    (total, profile) => total + profile.missingCount,
    0,
  );
  const previewHref = `/datasets/${dataset.id}/preview`;

  return (
    <>
      <PageHeader
        description="Review detected variable types and data quality warnings before analysis."
        eyebrow="Step 2"
        title="Data Profile"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/analysis">Choose Research Goal</ButtonLink>
          <ButtonLink href={previewHref} variant="secondary">
            Back to Preview
          </ButtonLink>
        </div>
      </PageHeader>

      <Card className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-helper text-secondary">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface-variant">Dataset name</p>
              <h2 className="mt-1 text-2xl font-semibold text-primary">{dataset.name}</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Review these profile details before choosing a research goal.
              </p>
            </div>
          </div>
          <Badge variant={dataset.id === "uploaded" ? "significant" : "text"}>
            {sourceLabel}
          </Badge>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Rows" value={dataset.rowCount.toLocaleString()} />
        <StatCard label="Columns" value={dataset.columnCount.toLocaleString()} />
        <StatCard label="Missing values" value={totalMissingValues.toLocaleString()} />
        <StatCard label="Numeric variables" value={numericCount.toLocaleString()} />
        <StatCard label="Categorical variables" value={categoricalCount.toLocaleString()} />
        <StatCard label="Likert variables" value={likertCount.toLocaleString()} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <ColumnProfileTable profiles={profiles} onTypeChange={handleTypeChange} />
        <DataQualityWarningPanel warnings={warnings} />
      </div>
    </>
  );
}
