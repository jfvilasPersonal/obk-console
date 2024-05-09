import { useEffect, useState } from "react";
import { Context } from "../model/Context";
import useInterval from "use-interval";
import { Divider, Typography } from "@mui/material";


function UserTrace(props:any) {
    type RequestContext = {
        epoch:number,
        requestUri:string,
        token?:string,
        decoded?:any,
        validationStatus?:boolean,
        validationError?:string,
        responseHeaders:Map<string,string>,
        action?:string,
        subject?:string
    }
      
    const ctx:Context = new Context();
    const [content, setContent] = useState('');
    const [id, setId ] = useState(0);


    useInterval ( async () => {
        var body = {
            "validator":props.validator,
            "id":id
        };
            console.log(body);
        var newId=id;
        var resp = await fetch(`${ctx.baseApiUrl}/trace/events`, { method:'POST', body: JSON.stringify(body), headers: {"Content-Type": "application/json"} });
        var data = await resp.json();
        if (data.ok) {
            var rcs=data.events as RequestContext[];
            var lines='';
            for (var rc of rcs) {
                lines+=rc.epoch+'  '+rc.action + '\r\n';
                if (rc.epoch>id) {
                    console.log('update '+rc.epoch);
                    newId=rc.epoch;
                }
            }
            setId(newId);
            setContent (content+lines);
        }

    }, 1000);

    return (
        <>
            User Trace for user: <b>{props.subject}</b> on validator <b>{props.validator}</b>.
            <Divider sx={{mt:'5px'}}/>
            <Typography variant="body2"><pre>{content}</pre></Typography>
        </>
    );
}
export default UserTrace;
