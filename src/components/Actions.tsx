import { useEffect, useState } from "react";
import { Context } from "../model/Context";
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import UserTrace from "./UserTrace";
import { post } from "../tools/http";

function Actions() {
    const ctx:Context = new Context();
    const [currentTab, setCurrentTab] = useState('invalidate');
    const [traceRunning, setTraceRunning] = useState(false);
    const [traceSubject, setTraceSubject] = useState('');
    const [invSubject, setinvSubject] = useState('');
    const [invAudience, setInvAudience] = useState('');
    const [invIssuer, setInvIssuer] = useState('');
    const [invClaim, setInvClaim] = useState('');
    const [buttonText, setButtonText] = useState('start');
    const [validator, setValidator]  = useState ('');
    const [validators, setValidators]  = useState ([]);
    const [invConfig, setInvConfig]  = useState<any>({});

    const getValidators =  () => {
        fetch(`${ctx.baseApiUrl}/overview/validators`).then( response => response.json().then ( data => setValidators(data)) );
    }

    useEffect(getValidators, []);

    const changeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const handleValidatorChange = async (event: SelectChangeEvent) => {
        setValidator(event.target.value);
        var resp = await fetch (`${ctx.baseApiUrl}/invalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ validator:event.target.value})
        });
        var respData=await resp.json();
        setInvConfig(respData);
    };

    const invalidateSetClick = async () => {
        if (invSubject!=='') {
            var resp = post (`${ctx.baseApiUrl}/invalidate/subject`, { validator:validator, subject:invSubject });
            //var resp = await fetch (`${ctx.baseApiUrl}/invalidate/subject`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "validator":validator, "subject":invSubject })
            //});
        }
    }

    const traceStartClick = async () => {
        if (buttonText==='start') {
            var data= {
                "validator":validator,
                "subject":traceSubject,
                "maxEvents":100
            };
    
            var resp = await fetch (`${ctx.baseApiUrl}/trace/subject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            var dataResp=await resp.json();  // +++ check resp, there can be problems starting trace
            setTraceRunning(true);
            setButtonText('stop');
        }
        else {
            var body={
                "validator":validator
            };
            fetch(`${ctx.baseApiUrl}/trace/stop`, { method:'POST', body: JSON.stringify(body), headers: { 'Content-Type':'application/json'}});
            setTraceRunning(false);
            setButtonText('start');
        }
    }

    return (
        <>
            <Stack direction='column' sx={{m:1}} alignItems={"center"}>
                <FormControl variant="standard" sx={{ m:1, width: '200px' }}>
                    <InputLabel id="labelVal">Validator</InputLabel>
                    <Select labelId="labelVal" value={validator} onChange={handleValidatorChange} label="Validator">
                        { validators.map( (v:any) => {
                            var value=`${v.name}`;
                            return <MenuItem value={value}>{value}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Stack>

            <Divider/>
            
            <Tabs value={currentTab} onChange={changeTab} centered>
                <Tab value='invalidate' label='Invalidate' disabled={validator===''}/>
                <Tab value='diagnostics' label='Diagnostics' disabled={validator===''}/>
            </Tabs>


            { currentTab==='invalidate' && validator!=='' && (

                <Stack direction={'row'}>
                
                    <Stack sx={{width:'50%'}}>
                        <Stack direction={"column"} sx={{m:2}}>
                            <Stack direction='column' sx={{m:1}}>
                                <Typography variant="h6">
                                    Current invalidation config
                                </Typography>
                                <Typography>
                                { invConfig.ok ?
                                    ( invConfig.enabled ? <>Invalidation config: '{JSON.stringify(invConfig)}</> : <>No invalidation configuration has been set.</> )
                                    :
                                    (<>Error obtaining invalidation config: {invConfig.err}</>)
                                }                                        
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack direction={"column"} sx={{m:2}}>
                        <Stack direction='column' sx={{m:1}}>
                            <Typography variant="h6">
                            Invalidate token for user
                            </Typography>
                            <Stack direction={'row'} sx={{ m:1 }} alignItems={'baseline'} >
                                <TextField onChange={(e) => { setinvSubject(e.target.value) }} label="Subject" variant="standard" sx={{ width:'300px', mr:1 }}></TextField>
                            </Stack>
                        </Stack>

                        <Stack direction='column' sx={{m:1}}>
                            <Typography variant="h6">
                            Invalidate token conatining...
                            </Typography>

                            <Stack direction={'row'} sx={{ m:1 }} alignItems={'baseline'} >
                                <TextField onChange={(e) => { setInvClaim(e.target.value) }} label="Claim name" variant="standard" sx={{ width:'300px', mr:1}}></TextField>
                            </Stack>

                            <Stack direction={'row'} sx={{ m:1 }} alignItems={'baseline'} >
                                <TextField onChange={(e) => { setInvIssuer(e.target.value) }} label="Issuer" variant="standard" sx={{ width:'300px', mr:1}}></TextField>
                            </Stack>

                            <Stack direction={'row'} sx={{ m:1 }} alignItems={'baseline'} >
                                <TextField onChange={(e) => { setInvAudience(e.target.value) }} label="Audience" variant="standard" sx={{ width:'300px', mr:1}}></TextField>
                            </Stack>

                            <Button onClick={ invalidateSetClick } variant="contained" disabled={invSubject===''||invAudience===''||invIssuer===''||invClaim===''}>set</Button>

                        </Stack>
                    </Stack>
                </Stack>
            )}

            { currentTab==='diagnostics' &&  validator!=='' && (
                <Stack direction={"column"} sx={{m:2}} >
                    <Stack direction='column' sx={{m:1}}>
                        <Typography variant="h6">
                            Trace user
                        </Typography>

                        <Stack direction={'row'} sx={{ m:1 }} alignItems={'baseline'} >
                            <TextField label="Subject" variant="standard" sx={{ width:'300px', mr:1}} onChange={(e) => { setTraceSubject(e.target.value) }} disabled={buttonText==='stop'}></TextField>
                            <Button onClick={ traceStartClick } variant="contained" disabled={traceSubject===''}>{buttonText}</Button>
                        </Stack>
                    </Stack>

                </Stack>
            )}
            { currentTab==='diagnostics' && (
                <Box sx={{ml:'20px', mt:'30px'}}>
                    { traceSubject!=='' && (
                        <>
                                User Trace for user: <b>{traceSubject}</b> on validator <b>{validator}</b>.
                                <Divider sx={{mt:'5px'}}/>
                        </>
                    )}
                    { traceRunning &&
                        <UserTrace subject={traceSubject} validator={validator}></UserTrace>
                    }
                </Box>
            )}
        </>
    );
}
export default Actions;
