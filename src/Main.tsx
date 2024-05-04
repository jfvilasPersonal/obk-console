import { useEffect, useState } from "react";
import { Context } from "./model/Context";
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, Toolbar, Tooltip, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import UserIcon from '@mui/icons-material/Person';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Beenhere, ExitToApp, Link, Rule, RuleFolder, Settings } from "@mui/icons-material";
import Overview from "./components/Overview";
import { useNavigate } from "react-router-dom";
import Rulesets from "./components/Rulesets";
import Validators from "./components/Validators";
import { Image } from 'mui-image'


function Main() {
    const ctx:Context = new Context();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [env, setEnv] = useState({});

    const [showOverview, setShowOverview] = useState(false);
    const [showValidators, setShowValidators] = useState(false);
    const [showRulesets, setShowRulesets] = useState(false);
    const [showDialog, setShowDialog] = useState({ visible:false, title:'Error', message:'Error text unspecified.', target:'' });

    const getConfig =  () => {
        fetch(`${ctx.baseApiUrl}/config`).then( response => response.json()
            .then ( data => setEnv(data)) )
            .catch ( (err) => {
                setShowDialog({...showDialog, visible:true, message:'Error accessing Authorizator', target:'/obk-console'});
            });
    }

    useEffect(getConfig, []);

    const overviewClick = () => {
        setOpen(!open);
        setShowOverview(true);
        setShowValidators(false);
        setShowRulesets(false);
    }

    const validatorsClick = () => {
        setOpen(!open);
        setShowOverview(false);
        setShowValidators(true);
        setShowRulesets(false);
    }

    const rulesetsClick = () => {
        setOpen(!open);
        setShowOverview(false);
        setShowValidators(false);
        setShowRulesets(true);
    }

    const exitClick = () => {
        navigate('/obk-console');
    }

    const oberkornClick = () => {
        window.open('https://jfvilaspersonal.github.io/oberkorn','_blank', 'rel=noopener noreferrer');
    }

    const closeDialogClick = () => {
        setShowDialog({...showDialog, visible:false});
        if ((showDialog as any).target) navigate((showDialog as any).target);
    }

    return (
        <>
            <AppBar position="sticky" elevation={0}  sx={{ zIndex: 99 }}>
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }} onClick={() => setOpen(!open)}>
                        <MenuIcon />
                    </IconButton>
                    <Image src="/obk-console/logo5.png" width='25px' duration='0'/>
                    <Typography variant="h6" component="div" sx={{ ml:1,flexGrow: 1 }}>
                        {(env as any).obkaName}
                    </Typography>
                    <Tooltip title={ctx.username} sx={{ mr:2 }}>
                        <UserIcon/>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Drawer sx={{  flexShrink: 0,  '& .MuiDrawer-paper': { mt: '66px' }  }} variant="persistent" anchor="left" open={open}>
                <List>
                    <ListItem key='General'>
                        <ListItemButton onClick={overviewClick}>
                            <ListItemIcon><Settings/></ListItemIcon>
                            <ListItemText>Overview</ListItemText>
                        </ListItemButton>
                    </ListItem>

                    <Divider />

                    <ListItem key='Validators'>
                        <ListItemButton onClick={validatorsClick}>
                            <ListItemIcon><Beenhere/></ListItemIcon>
                            <ListItemText>Validators</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='Rulesets'>
                        <ListItemButton onClick={rulesetsClick}>
                            <ListItemIcon><Rule/></ListItemIcon>
                            <ListItemText>Rulesets</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <Divider/>                   
                    <ListItem key='Oberkorn'>
                        <ListItemButton onClick={oberkornClick}>
                            <ListItemIcon><Link/></ListItemIcon>
                            <ListItemText>Oberkorn</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='Exit'>
                        <ListItemButton onClick={exitClick}>
                            <ListItemIcon><ExitToApp/></ListItemIcon>
                            <ListItemText>Exit</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            {  showOverview && <Overview/>  }
            {  showValidators && <Validators/> }
            {  showRulesets && <Rulesets/> }
            {/* <Dialog open={(showDialog as any).visible} onClose={closeDialogClick}> */}
            <Dialog open={(showDialog as any).visible}>
                <DialogTitle id="alert-dialog-title">
                    {(showDialog as any).title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {(showDialog as any).message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialogClick}>Ok</Button>
                </DialogActions>
            </Dialog>
              </>
    );
}
export default Main;
