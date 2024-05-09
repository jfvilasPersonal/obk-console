import { useEffect, useState } from "react";
import { Context } from "../model/Context";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import UserTrace from "./UserTrace";

function Users() {
    const ctx:Context = new Context();
    const [currentTab, setCurrentTab] = useState('actions');
    const [showUserTrace, setShowUserTrace] = useState(false);
    const [subject, setSubject] = useState('');
    const [buttonText, setButtonText] = useState('start');
    const [validator, setValidator]  = useState ('');
    const [validators, setValidators]  = useState ([]);

    const getValidators =  () => {
        fetch(`${ctx.baseApiUrl}/overview/validators`).then( response => response.json().then ( data => setValidators(data)) );
    }

    useEffect(getValidators, []);

    const changeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setValidator(event.target.value);
    };
    
    const startClick = async () => {
        console.log('startclick');
        if (buttonText==='start') {
            var data= {
                "validator":validator,
                "sub":subject,
                "maxEvents":100
            };
    
            var resp = await fetch (`${ctx.baseApiUrl}/trace/subject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            var dataResp=await resp.json();
            console.log(dataResp);
            setShowUserTrace(true);
            setButtonText('stop');
        }
        else {
            console.log('stoppppp');
            var body={
                "validator":validator,
                "id":0
            };
            fetch(`${ctx.baseApiUrl}/trace/stop`, { method:'POST', body: JSON.stringify(body), headers: { 'Content-Type':'application/json'}});

            setShowUserTrace(false);
            setButtonText('start');
        }

    }

    return (
        <>
            <Tabs value={currentTab} onChange={changeTab}>
                <Tab value='actions' label='Actions'/>
                <Tab value='diagnostics' label='Diagnostics'/>
            </Tabs>
            { currentTab==='actions' && (
                <Stack direction={"column"} sx={{ml:'10px', mt:'10px'}}>
                    <Stack direction='column'>
                        <Typography variant="h6">
                        Invalidate token for user
                        </Typography>
                        <TextField label="Subject" variant="standard" sx={{ ml:'10px', width:'300px'}}></TextField>
                    </Stack>

                    <Stack direction='column' sx={{mt:'20px'}}>
                        <Typography variant="h6">
                        Invalidate token conatining...
                        </Typography>
                        <TextField label="Claim" variant="standard" sx={{ ml:'10px', width:'300px'}}></TextField>
                        <TextField label="Issuer" variant="standard" sx={{ ml:'10px', width:'300px'}}></TextField>
                        <TextField label="Audience" variant="standard" sx={{ ml:'10px', width:'300px'}}></TextField>
                    </Stack>
                </Stack>
            )}
            { currentTab==='diagnostics' && (
                <Stack direction={"column"} sx={{ml:'10px', mt:'10px'}} flex='auto' >
                    <Stack direction='column' sx={{m:1}}>
                        <Typography variant="h6">
                            Trace user
                        </Typography>
                        <FormControl variant="standard" sx={{ width: '200px' }}>
                            <InputLabel id="labelVal">Validator</InputLabel>
                            <Select labelId="labelVal" value={validator} onChange={handleChange} label="Validator">
                                { validators.map( (v:any) => {
                                    var value=`${v.name}`;
                                    return <MenuItem value={value}>{value}</MenuItem>
                                })}
                            </Select>
                        </FormControl>

                        <Stack direction={'row'} sx={{ m:1 }} spacing={1} alignItems={'baseline'}>
                            <TextField label="Subject" variant="standard" sx={{ width:'300px'}} onChange={(e) => { setSubject(e.target.value) }} disabled={buttonText==='stop'}></TextField>
                            <Button onClick={ startClick } variant="contained" disabled={subject===''}>{buttonText}</Button>
                        </Stack>
                    </Stack>

                </Stack>
            )}
            { currentTab==='diagnostics' && showUserTrace && (
                <Box sx={{ml:'20px', mt:'30px'}}>
                    <UserTrace subject={subject} validator={validator}></UserTrace>
                </Box>
            )}
        </>
    );
}
export default Users;
