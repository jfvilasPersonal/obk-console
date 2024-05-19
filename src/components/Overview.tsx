import { useEffect, useState } from "react";
import { Context } from "../model/Context";
import { Stack, Button, Typography, Box } from "@mui/material";
import JSONTable from 'simple-json-table'; 
import { PieChart } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts";
import { reduce } from "../tools/Utils";
import useInterval from "use-interval";

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

    useInterval ( async () => {
        // var body = {
        //     "validator":props.validator,
        //     "id":id
        // };
        // var resp = await post(`${ctx.baseApiUrl}/trace/events`, body);
        // var data = await resp.json();
        // if (data.ok && data.events && data.events.length>0) {
        //     var rcs=data.events as RequestContext[];
        //     var lines='';
        //     var max=id;
        //     for (var rc of rcs) {
        //         lines+=new Date (rc.epoch).toDateString() + ' ' + new Date (rc.epoch).toTimeString() + '  '+rc.action + '\r\n';
        //         if (rc.epoch>max) {
        //             console.log('update '+rc.epoch);
        //             max=rc.epoch;
        //         }
        //     }
        //     // setId(id => max);
        //     // setContent (content+lines);
        // }
    }, 1000);

    const statusRefreshClick = () => {
        getStatus();
    }

    //+++ falta revisar porqué el obk-console-authorizator suma bien las requests globales pero no suma las del validador
    return (
        <>
            <Stack direction='row' sx={{alignItems:'center'}}>
                <Typography sx={{width:'20%'}}></Typography>
                <Stack sx={{alignItems:'center', width:'30%'}}>
                    <Typography>Total Requests</Typography>
                    <PieChart title='Request distribution' height={200} series={[  { data:pieData }  ]} />
                </Stack>
                <Stack sx={{alignItems:'center', width:'30%'}}>
                    <Typography>Average Processing Time</Typography>
                    <BarChart title='Average response time' height={200} xAxis={[{ scaleType: 'band', data: barSerieNames }]} series={[{ data: barData } ]}/>
                </Stack>
                <Typography sx={{width:'20%'}}></Typography>
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