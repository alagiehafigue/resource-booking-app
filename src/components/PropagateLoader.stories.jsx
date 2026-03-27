import { PropagateLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  textAlign: "center",
};

export const CenteredLoader = () => {
  return (
    <div style={{ padding: "50px", backgroundColor: "white" }}>
      <PropagateLoader
        color='#333333'
        loading={true}
        cssOverride={override}
        size={15}
      />
    </div>
  );
};
