import MDSpinner from "react-md-spinner";

export interface Field {
  name: string,
  width: number
}

export const ModalDeleteContent = (rows: any[], spinner: boolean, fields: Field[]) => {
  return (
    <div>
    <ul
      style={{
        overflowY: "auto",
        maxHeight: "200px"
      }}
    >
        {
        rows.map((row, i) => {
            return (
            <li key={i} style={{fontStyle: "italic", listStyleType: "square", height: "80px"}}>
              <span style={{display:"flex", flexDirection: "row",justifyContent: "space-between", alignItems: "center"}}>
                { fields.map(field=>{
                  return (
                    <span key={field.name} title={row[field.name]} style={{width:`${field.width}%`, textOverflow: "ellipsis", overflow: "hidden"}}>{row[field.name]}</span>
                  );
                })}
              </span>
            </li>
            )
          })
        }
        </ul>
        
        {spinner === true?
        <div style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems: "center"}} >
            <MDSpinner size={96} />
            <span style={{marginLeft: "20px", fontSize: "19px", fontWeight: "bold"}}>Deleting ...</span>
          </div>
          :
          null}
          </div>
      )
    }

    