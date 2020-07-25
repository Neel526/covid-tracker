import React from 'react'
import "./InfoBox.css"
import { Card, CardContent, Typography} from "@material-ui/core";

function InfoBox({title, cases, isRed, isBlue, isGreen, isGrey, active, total, ...props}) {
    return (
        <Card 
        onClick={props.onClick}
        className= {`infobox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'} ${isBlue && 'infoBox--blue'} ${isGrey && 'infoBox--grey'}`}>
           <CardContent>
            <Typography color="textSecondary">
            {title} 
            </Typography>
            <h2 className={`infoBox_cases ${isBlue && "infoBox_cases--blue"} ${isGreen && "infoBox_cases--green"}   ${isGrey && "infoBox_cases--grey"}`}> {cases} </h2>
            <Typography className="infoBox_total" color="textSecondary">
                {total} Total
            </Typography>
           </CardContent> 
        </Card>
    )
}

export default InfoBox
