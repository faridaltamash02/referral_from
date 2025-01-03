import React from "react";
import { useLoader } from "../services/context/loadingContext";

const OverlayLoader = () => {
    const { loading } = useLoader();
return(
    loading &&(<div id="overlay-loader" className="overlay-loader">
        <div id="overlay-loader-text">&nbsp;</div>
    </div>)
)
}

export default OverlayLoader