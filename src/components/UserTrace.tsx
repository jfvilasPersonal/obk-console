import { useEffect, useState } from "react";
import { Context } from "../model/Context";
import useInterval from "use-interval";
import { Divider, Typography } from "@mui/material";
import { post } from "../tools/Utils";


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
        var resp = await post(`${ctx.baseApiUrl}/trace/events`, body);
        var data = await resp.json();
        if (data.ok && data.events && data.events.length>0) {
            var rcs=data.events as RequestContext[];
            var lines='';
            var max=id;
            for (var rc of rcs) {
                lines+=new Date (rc.epoch).toDateString() + ' ' + new Date (rc.epoch).toTimeString() + '  '+rc.action + '\r\n';
                if (rc.epoch>max) {
                    console.log('update '+rc.epoch);
                    max=rc.epoch;
                }
            }
            setId(id => max);
            setContent (content+lines);
        }
    }, 250);

    return (
        <>
            <Typography variant="body2"><pre>{content}</pre></Typography>
        </>
    );
}
export default UserTrace;
