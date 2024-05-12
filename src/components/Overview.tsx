import { useEffect, useState } from "react";
import { Context } from "../model/Context";
import { Stack, Button, Typography, Box } from "@mui/material";
import JSONTable from 'simple-json-table'; 
import { PieChart } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts";
import { reduce } from "../tools/Utils";

function Overview() {
    const ctx:Context = new Context();
    const [env, setEnv] = useState({});
    const [status, setStatus] = useState({totalRequests:0, totalMicros:0});
    const [pieData, setPieData] = useState<any>([]);
    const [barData, setBarData] = useState<any[]>([]);
    const [barSerieNames, setBarSerieNames] = useState<any>([]);

    const getConfig =  () => {
        fetch(`${ctx.baseApiUrl}/overview/config`).then( response => response.json().then ( data => setEnv(data)) );
    }
    const getStatus =  () => {
        fetch(`${ctx.baseApiUrl}/overview/status`).then( response => response.json().then ( data => setStatus(data)) );
    }
    const getValidators = () => {
        fetch(`${ctx.baseApiUrl}/overview/validators`).then( response => response.json().then ( (data:any[]) => {

            var valNames:any[]=[];
            data.map( item => valNames.push (item.name) );
            console.log(valNames);
            setBarSerieNames(valNames);

            const loadData = async () => {
                var id=0;
                var pieseries:any[]=[];
                var barseries:any[]=[];
                for (var seriesname of valNames) {
                    const getData = async (sn:string) => {
                        var resp= await fetch(`${ctx.baseApiUrl}/validator/${sn}/stats`);
                        var data = await resp.json();
                        console.log('data');
                        console.log(data);
                        return data;
                    }
                    var a=await getData(seriesname);
                    pieseries.push({ id:id++, value: a.totalRequests, label:a.name}) 
                    barseries.push(a.totalRequests/a.totalMicros);
                }
                console.log('sd');
                console.log(barseries);
                setBarData(barseries);
                setPieData(pieseries);
            }
            loadData();

        }));
    }

    useEffect(getStatus, []);
    useEffect(getConfig, []);
    useEffect(getValidators, []);

    const statusRefreshClick = () => {
        getStatus();
    }

    return (
        <>
            <Stack direction='row' sx={{alignItems:'center'}}>
                <Stack sx={{alignItems:'center', width:'50%'}}>
                    <Typography>Total Requests</Typography>
                    <PieChart title='Request distribution' height={200} series={[  { data:pieData }  ]} />
                </Stack>
                <Stack sx={{alignItems:'center', width:'50%'}}>
                    <Typography>Average Processing Time</Typography>
                    <BarChart title='Average response time' height={200} xAxis={[{ scaleType: 'band', data: barSerieNames }]} series={[{ data: barData } ]}/>
                </Stack>
            </Stack>
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