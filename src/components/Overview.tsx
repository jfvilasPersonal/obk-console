import { useEffect, useState } from "react";
import { Context } from "../model/Context";
import { Stack, Button, Typography } from "@mui/material";
import JSONTable from 'simple-json-table'; 
import { PieChart } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts";

function Overview() {
    const ctx:Context = new Context();
    const [env, setEnv] = useState({});
    const [status, setStatus] = useState({totalRequests:0, totalMicros:0});
    const [pieData, setPieData] = useState<any>([]);
    const [barData, setBarData] = useState<any>([]);
    const [barSerieNames, setBarSerieNames] = useState<any>([]);

    const getConfig =  () => {
        fetch(`${ctx.baseApiUrl}/overview/config`).then( response => response.json().then ( data => setEnv(data)) );
    }
    const getStatus =  () => {
        fetch(`${ctx.baseApiUrl}/overview/status`).then( response => response.json().then ( data => setStatus(data)) );
    }
    const getValidators = () => {
        fetch(`${ctx.baseApiUrl}/overview/validators`).then( response => response.json().then ( (data:any[]) => {
            // data: [
            //     { id: 0, value: 10, label: 'Validtor 1' },
            //     { id: 1, value: 15, label: 'Validator2' }
            // ],
            var id=0;
            var series:any[]=[];
            data.map( item => series.push ({ id:id++, value: item.decoderInstance.totalRequests, label:item.name}) );
            console.log(series);
            var test = [
                { id: 0, value: 10, label: 'Validtor 1' },
                { id: 1, value: 15, label: 'Validator2' }
            ];
            setPieData(series);

            var series3:any[]=[];
            data.map( item => series3.push (item.name) );
            console.log(series3);
            setBarSerieNames(series3);

            series3.map (async seriesname => {
                const getValStats = async () => {
                    fetch(`${ctx.baseApiUrl}/overview/validator/${seriesname}/stats`).then( response => response.json().then ( (data:any[]) => {
                    }));
                }
                var seriesdata=await getValStats();
                console.log(seriesname);
                console.log(seriesdata);
            });

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
                <PieChart title='Request distribution' width={500} height={200} series={[  { data:pieData }  ]} />
                <BarChart title='Average response time' width={500} height={200} xAxis={[{ scaleType: 'band', data: barSerieNames }]} series={[{ data: barData } ]}/>
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