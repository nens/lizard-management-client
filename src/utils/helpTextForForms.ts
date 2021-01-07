interface HelpText {
  [name: string]: string
}

export const rasterSourceFormHelpText: HelpText = {
  default: 'Fill in the form to create a new Raster Source.',
  name: 'Choose a name that is findable and not too difficult.',
  description: 'Please give an accurate description of this object and its uses.',
  supplierCode: 'The FTP or Supplier code is used as reference to your own system.',
  temporal: 'Indicates if there are multiple rasters over a time period.',
  interval: 'Specify a time range between each raster image.',
  data: 'Upload your raster files here in .tif format. Lizard will recognize the timestamp if it is in the filename.',
  accessModifier: 'Choose an access modifier to decide who has access to this object. The default is private.',
  organisation: 'The organisation this object belongs to.',
  supplier: 'The supplier of this object.',
}

export const wmsFormHelpText: HelpText = {

}

export const scenarioFormHelpText: HelpText = {

}