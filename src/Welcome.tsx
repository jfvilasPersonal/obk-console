import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import { Context } from "./model/Context";
import { Image } from 'mui-image'

function Welcome() {
    const navigate = useNavigate();
    var ctx:Context = new Context();
    const [ authorizator, setAuthorizator]  = useState ('');
    const [ authorizators, setAuthorizators]  = useState ([]);

    const getAuthorizators= () => {
        fetch(`/obk-console/authorizators`).then( response => response.json().then ( data => setAuthorizators(data)) );
    }

    useEffect(getAuthorizators, []);

    const enterClick = () => {
        // authorizator var contains 'namespace/authname'
        ctx.authenticated=true;
        ctx.username='admin';
        ctx.baseApiUrl=`/obk-console/proxy/${authorizator}/api`;
        ctx.save();
        navigate(`/obk-console/${authorizator}/main`);
    }
    
    const handleChange = (event: SelectChangeEvent) => {
            setAuthorizator(event.target.value);
    };

    return <>

        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Stack alignItems={"center"} spacing={10} sx={{ mt:'-20%'}}>

                <Image src="/obk-console/logo5.png" width='150px' />

                <Stack direction="row" spacing={4} alignItems="baseline" >
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel id="labelAuth">Authorizator</InputLabel>
                        <Select labelId="labelAuth" value={authorizator} onChange={handleChange} label="Authorizator">
                            { authorizators.map( (v:any) => {
                                var value=`${v.namespace}/${v.name}`;
                                return <MenuItem value={value}>{value}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    <Button onClick={enterClick} variant='contained'>enter</Button>
                </Stack>

            </Stack>
        </Box>
    </>;
}
export default Welcome;
