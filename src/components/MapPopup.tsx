import React, { Popup } from "react-map-gl";
import MDSpinner from "react-md-spinner";
import { useQuery } from "react-query";

interface Props {
  data: any,
  setData: any
}

export const MapPopup: React.FC<Props> = ({ data, setData }) => {
  const properties = data.features.map((feature: any) => feature.properties);
  const property = properties[0];
  const { object_id } = property;
  const {
    data: apiData,
    isFetched
  } = useQuery(
    `${object_id}`,
    () => fetch(`/api/v4/measuringstations/${object_id}`).then(res => res.json())
  );
  return (
    <Popup
      latitude={data.lngLat[1]}
      longitude={data.lngLat[0]}
      closeButton={true}
      closeOnClick={false}
      onClose={() => setData(null)}
      anchor="top"
    >
      <h3>Properties</h3>
      {data.features.map((feature: any, i: number) => {
        return (
          <div key={i}>
            <hr />
            <h4>{feature.source}</h4>
            {Object.keys(feature.properties).map(key => {
              return (
                <div key={key}>
                  {key}: {feature.properties[key]}
                </div>
              );
            })}
            {isFetched && feature.source === 'measuringstation' ? (
              <>
                <div>code: {apiData.code}</div>
                <div>frequency: {apiData.frequency}</div>
                <div>region: {apiData.region}</div>
              </>
            ) : feature.source === 'measuringstation' ? (
              <MDSpinner />
            ) : null}
          </div>
        )})}
    </Popup>
  )
}