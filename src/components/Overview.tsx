import { useEffect, useState } from "react";
import { Context } from "../model/Context";
import { Stack, Button, Typography } from "@mui/material";
import JSONTable from 'simple-json-table'; 

function Overview() {
    const ctx:Context = new Context();
    const [env, setEnv] = useState({});
    const [status, setStatus] = useState({totalRequests:0, totalMicros:0});

    const getConfig =  () => {
        fetch(`${ctx.baseApiUrl}/config`).then( response => response.json().then ( data => setEnv(data)) );
    }
    const getStatus =  () => {
        fetch(`${ctx.baseApiUrl}/status`).then( response => response.json().then ( data => setStatus(data)) );
    }

    useEffect(getStatus, []);
    useEffect(getConfig, []);

    const statusRefreshClick = () => {
        getStatus();
    }

    return (
        <>
            <Typography variant="body2">
                <JSONTable source={env}/>
                <JSONTable source={status}/>
                <JSONTable source={{ 'avgResponse (ms)': status.totalMicros/status.totalRequests/1000 }}/>
            </Typography>
            <Stack direction="row" justifyContent="end" sx={{mr:'20px'}}>
                <Button onClick={statusRefreshClick} variant="contained">refresh</Button>                
            </Stack>
        </>
    );
}
export default Overview;