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
  optiimizer: false;
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

  return await response.json();
};


export const fetchRasterV4 = async (uuid: string, options: RequestInit = {
  credentials: "same-origin"
}) => {
  const response = await fetch(`/api/v4/rasters/${uuid}/`, {
    ...options,
    method: "GET"
  });

  return await response.json();
};

export const flushRasters = (uuids: string[]) => {
  const opts: RequestInit = {
    // not permanently deleted, this will be implemented in backend
    credentials: "same-origin",
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({"source": null} )
  };

  return Promise.all(uuids.map(
    uuid => fetch(`/api/v4/rasters/${uuid}/`, opts).then(response => response.json()))
  );
}

export const deleteRasters = (uuids: string[]) => {
  const opts: RequestInit = {
    // not permanently deleted, this will be implemented in backend
    credentials: "same-origin",
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  };

  return Promise.all(uuids.map(
    uuid => fetch(`/api/v4/rasters/${uuid}/`, opts).then(response => response.json()))
  );
}

export const listTemporalRastersContainingV3 = async (searchString: string) => {
  const response = await fetch(
    // show all temporal rasters the user has access to
    `/api/v3/rasters/?page_size=0&name__icontains=${searchString}&first_value_timestamp__isnull=false`,
    {
      credentials: "same-origin"
    }
  );

  return await response.json();
};


export const listRastersForTable = async (
  pageSize: number, page: number, searchString: string, organisationUuid: string
) => {
  const url = `/api/v4/rasters/?writable=true&page_size=${pageSize}&page=${page}&name__icontains=${searchString}&ordering=last_modified&organisation__uuid=${organisationUuid}&scenario__isnull=true`;

  const response = await fetch(url, {
    credentials: "same-origin"
  });

  return (await response.json()).results;
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
  return await response.json();
};


export const createRaster = async (raster: OldRaster) => {
  const url = "/api/v4/rasters/";

  const opts: RequestInit = {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raster)
  };

  return await fetch(url, opts);
};


export const patchRaster = async (rasterUuid: string, raster: OldRasterEdit) => {
  const url = "/api/v4/rasters/";

  const opts: RequestInit = {
    credentials: "same-origin",
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raster)
  };

  return await fetch(url + "uuid:" + rasterUuid + "/", opts);
};
