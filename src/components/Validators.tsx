import { useEffect, useState } from "react";
import { Context } from "../model/Context";
import { Typography } from "@mui/material";
import JSONTable from 'simple-json-table'; 

function Validators() {
    const ctx:Context = new Context();
    const [validators, setValidators] = useState({});

    const getValidators =  () => {
        fetch(`${ctx.baseApiUrl}/overview/validators`).then( response => response.json().then ( data => setValidators(data)) );
    }

    useEffect(getValidators, []);

    return (
        <>
            <Typography variant="body2">
                <JSONTable source={validators}/>
            </Typography>
        </>
    );
}
export default Validators;
