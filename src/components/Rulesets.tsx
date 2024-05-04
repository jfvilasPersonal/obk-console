import { useEffect, useState } from "react";
import { Context } from "../model/Context";
import { Typography } from "@mui/material";
import JSONTable from 'simple-json-table'; 

function Rulesets() {
    const ctx:Context = new Context();
    const [rulesets, setRulesets] = useState({});
    const getRulesets =  () => {
        fetch(`${ctx.baseApiUrl}/rulesets`).then( response => response.json().then ( data => setRulesets(data)) );
    }

    useEffect(getRulesets, []);

    return (
        <>
            <Typography variant="body2">
                <JSONTable source={rulesets}/>
            </Typography>
        </>
    );
}
export default Rulesets;
