// Functions that call the rasters API
// Centralized here so we know what is used and what isn't,
// to start the Typescriptification process and to do error
// handling in a more uniform way, if we do it.

export interface OldRaster {
  name: string;
  organisation: string;
  access_modifier: string;
  observation_type: string;
  description: string;
  supplier: string;
  supplier_code: string;
  temporal: boolean;
  interval?: number;
  rescalable: boolean;
  optimizer: false;
  aggregation_type: string;
  options: string;
  shared_with: string;
}

export interface OldRasterEdit {
  name: string;
  organisation: string;
  access_modifier: string;
  observation_type: string;
  description: string;
  supplier: string;
  supplier_code: string;
  aggregation_type: string;
  options?: string;
  shared_with: string;
}

export const fetchRasterV3 = async (uuid: string) => {
  const response = await fetch(`/api/v3/rasters/${uuid}/`, {
    credentials: "same-origin"
  });

  return response.json();
};


export const fetchRasterV4 = async (uuid: string, options: RequestInit = {
  credentials: "same-origin"
}) => {
  const response = await fetch(`/api/v4/rasters/${uuid}/`, {
    ...options,
    method: "GET"
  });

  return response.json();
};

export const flushRaster = async (uuid: string) => {
  // Re-fetch raster so we have up to date information here
  const raster = await fetchRasterV4(uuid);

  if (raster.is_geoblock || !raster.source || !raster.raster_sources || !raster.raster_sources[0]) {
    // Can't flush.
    return;
  }
  const rasterSourceUrl = '/api/v4/' + (raster.raster_sources[0].split('/api/v4/')[1]);
  const oldSourceResponse = await fetch(rasterSourceUrl, {credentials: "same-origin"});
  const oldSource = await oldSourceResponse.json();

  // Patch raster so source is None
  await fetch(`/api/v4/rasters/${uuid}/`, {
    credentials: "same-origin",
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({"source": null})
  });

  // Try to delete source, ignore errors
  await fetch(rasterSourceUrl, {
    credentials: "same-origin",
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });

  // Create new raster source from old one
  const rasterSourceBody = {
    name: oldSource.name,
    description: oldSource.description,
    organisation: oldSource.organisation.uuid, // We receive whole org, but update with only the UUID
    access_modifier: "Private", // Always
    supplier: oldSource.supplier,
    supplier_code: oldSource.supplier_code,
    temporal: oldSource.temporal,
    interval: oldSource.temporal ? oldSource.interval : undefined
  };

  const newSourceResponse = await fetch('/api/v4/rastersources/', {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rasterSourceBody)
  });
  const newSource = await newSourceResponse.json();

  // Patch layer so it has the new one
  return fetch(`/api/v4/rasters/${uuid}/`, {
    credentials: "same-origin",
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({source: {
      graph: {
        raster: [
          "lizard_nxt.blocks.LizardRasterSource",
          newSource.uuid
        ]
      },
      name: "raster"
    }})
  });
};

export const flushRasters = (uuids: string[]) => {
  return Promise.all(uuids.map(flushRaster));
}

export const deleteRaster = async (uuid: string) => {
  const deleteOpts: RequestInit = {
    credentials: "same-origin",
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  };

  // Re-fetch raster so we have up to date information here
  const raster = await fetchRasterV4(uuid);

  // Send a delete request to delete the raster
  await fetch(`/api/v4/rasters/${uuid}/`, deleteOpts);

  // If this isn't a Geoblock, also delete the first (and only) raster source.
  if (!raster.is_geoblock && raster.raster_sources) {
    const source = raster.raster_sources[0];
    if (source) {
      // This can fail for various reasons but we ignore all of them:
      // 412 "Precondition failed" -- another layer is using the source
      // 403 "Permission denied" -- user doesn't have write rights to the source
      // 404 -- user doesn't have read rights to the source
      // On success, 204 Gone is returned.
      await fetch(source, deleteOpts);
    }
  }

  return raster;
};

export const deleteRasters = (uuids: string[]) => {
  return Promise.all(uuids.map(deleteRaster));
}

export const listTemporalRastersContainingV3 = async (searchString: string) => {
  const response = await fetch(
    // show all temporal rasters the user has access to
    `/api/v3/rasters/?page_size=0&name__icontains=${searchString}&temporal=true`,
    {
      credentials: "same-origin"
    }
  );

  return response.json();
};


export const listRastersForTable = async (
  pageSize: number,
  page: number,
  searchString: string,
  include3diScenarios: boolean,
  organisationUuid: string,
) => {
  const url = include3diScenarios ? (
    `/api/v4/rasters/?writable=true&page_size=${pageSize}&page=${page}&name__icontains=${searchString}&ordering=last_modified&organisation__uuid=${organisationUuid}`
  ) : (
    `/api/v4/rasters/?writable=true&page_size=${pageSize}&page=${page}&name__icontains=${searchString}&ordering=last_modified&organisation__uuid=${organisationUuid}&scenario__isnull=true`
  );

  const response = await fetch(url, {
    credentials: "same-origin"
  });

  return response.json();
};

export const uploadRasterFile = async (rasterUuid: string, file: File, timestamp: Date) => {
  const form = new FormData();

  form.append("file", file);

  if (timestamp !== undefined) {
    form.append("timestamp", timestamp.toISOString());
  }

  const url = `/api/v4/rasters/${rasterUuid}/data/`;

  const opts: RequestInit = {
    credentials: "same-origin",
    method: "POST",
    headers: {
      mimeType: "multipart/form-data"
    },
    body: form
  };

  const response = await fetch(url, opts);
  return response.json();
};


export const createRaster = async (raster: OldRaster) => {
  // A raster is created in two steps: first we create the raster *source*,
  // then the raster *layer* using the uuid of the first.
  // Some of the fields go into the source, some into the layer, some into both.

  const defaultOpts: RequestInit = {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };

  const rasterSourceBody = {
    name: raster.name,
    description: raster.description,
    organisation: raster.organisation,
    access_modifier: "Private", // Always
    supplier: raster.supplier,
    supplier_code: raster.supplier_code,
    temporal: raster.temporal,
    interval: raster.temporal ? raster.interval : undefined
  };

  const rasterSourceResponse = await fetch('/api/v4/rastersources/', {
    ...defaultOpts,
    body: JSON.stringify(rasterSourceBody)
  });

  if (rasterSourceResponse.status !== 201) {
    // Status other than "Created"
    return rasterSourceResponse; // Don't know what else to do
  }

  const rasterSource = await rasterSourceResponse.json();

  const rasterBody = {
    name: raster.name,
    organisation: raster.organisation,
    observation_type: raster.observation_type,
    description: raster.description,
    supplier: raster.supplier,
    aggregation_type: raster.aggregation_type,
    options: raster.options,
    shared_with: raster.shared_with,
    rescalable: raster.rescalable,
    access_modifier: raster.access_modifier,
    temporal: raster.temporal,
    source: {
      graph: {
        raster: [
          "lizard_nxt.blocks.LizardRasterSource",
          rasterSource.uuid
        ]
      },
      name: "raster"
    }
  };

  const rasterResponse = await fetch('/api/v4/rasters/', {
    ...defaultOpts,
    body: JSON.stringify(rasterBody)
  });

  return rasterResponse;
};


export const patchRaster = async (rasterUuid: string, raster: OldRasterEdit) => {
  const url = "/api/v4/rasters/";
  // Store most fields on the raster
  const opts: RequestInit = {
    credentials: "same-origin",
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raster)
  };

  const newRasterResponse = await fetch(url + rasterUuid + "/", opts);
  const newRaster = await newRasterResponse.json();

  if (newRasterResponse.ok) {
      // Only supplier code is stored on the raster source
    if (raster.supplier_code !== undefined &&
        newRaster.raster_sources && newRaster.raster_sources.length === 1)  {
      fetch(newRaster.raster_sources[0], {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({supplier_code: raster.supplier_code})
      });
    }
  }

  return {
    response: newRasterResponse,
    raster: newRaster
  };
};