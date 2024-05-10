import { useEffect, useState } from "react";
import { Context } from "../model/Context";
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import UserTrace from "./UserTrace";

function Users() {
    const ctx:Context = new Context();
    const [currentTab, setCurrentTab] = useState('invalidate');
    const [showUserTrace, setShowUserTrace] = useState(false);
    const [traceSubject, setTraceSubject] = useState('');
    const [invSubject, setinvSubject] = useState('');
    const [invAudience, setInvAudience] = useState('');
    const [invIssuer, setInvIssuer] = useState('');
    const [invClaim, setInvClaim] = useState('');
    const [buttonText, setButtonText] = useState('start');
    const [validator, setValidator]  = useState ('');
    const [validators, setValidators]  = useState ([]);
    const [invConfig, setInvConfig]  = useState ({});

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

    const invSubjectClick = async () => {
        var resp = await fetch (`${ctx.baseApiUrl}/invalidate/subject`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "validator":validator, "subject":invSubject })
        });
    }

    const invClaimClick = async () => {
    }

    const invIssClick = async () => {
    }

    const invAudClick = async () => {
    }

    const startClick = async () => {
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
            setShowUserTrace(true);
            setButtonText('stop');
        }
        else {
            var body={
                "validator":validator
            };
            fetch(`${ctx.baseApiUrl}/trace/stop`, { method:'POST', body: JSON.stringify(body), headers: { 'Content-Type':'application/json'}});
            setShowUserTrace(false);
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
                                    {JSON.stringify(invConfig)}
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
                                <Button onClick={ invSubjectClick } variant="contained" disabled={invSubject===''}>set</Button>
                            </Stack>
                        </Stack>

                        <Stack direction='column' sx={{m:1}}>
                            <Typography variant="h6">
                            Invalidate token conatining...
                            </Typography>

                            <Stack direction={'row'} sx={{ m:1 }} alignItems={'baseline'} >
                                <TextField onChange={(e) => { setInvClaim(e.target.value) }} label="Claim name" variant="standard" sx={{ width:'300px', mr:1}}></TextField>
                                <Button onClick={ invClaimClick } variant="contained" disabled={invClaim===''}>set</Button>
                            </Stack>

                            <Stack direction={'row'} sx={{ m:1 }} alignItems={'baseline'} >
                                <TextField onChange={(e) => { setInvIssuer(e.target.value) }} label="Issuer" variant="standard" sx={{ width:'300px', mr:1}}></TextField>
                                <Button onClick={ invIssClick } variant="contained" disabled={invIssuer===''}>set</Button>
                            </Stack>

                            <Stack direction={'row'} sx={{ m:1 }} alignItems={'baseline'} >
                                <TextField onChange={(e) => { setInvAudience(e.target.value) }} label="Audience" variant="standard" sx={{ width:'300px', mr:1}}></TextField>
                                <Button onClick={ invAudClick } variant="contained" disabled={invAudience===''}>set</Button>
                            </Stack>

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
                            <Button onClick={ startClick } variant="contained" disabled={traceSubject===''}>{buttonText}</Button>
                        </Stack>
                    </Stack>

                </Stack>
            )}
            { currentTab==='diagnostics' && showUserTrace && (
                <Box sx={{ml:'20px', mt:'30px'}}>
                    <UserTrace subject={traceSubject} validator={validator}></UserTrace>
                </Box>
            )}
        </>
    );
}
export default Users;
