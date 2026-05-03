const path = require('path')
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRDI_API_KEY);
var app = express();

app.use(cors({
    origin: ["https://nedlarry.github.io", "*"],
    
}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', "GET, POST");
    res.header('Access-Control-Allow-Headers', "Origin, Content-type");
    next();
}) 

app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));


function FormulateImgElement(pd) {
    dataObject = [];
    dataObject.push({name: pd.name, html_url: pd.html_url, description: pd.description})
}
   
app.get('/repos', (req, res) => {
    
    fetch('https://api.github.com/users/nedlarry/repos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github+json',
            'Authorization': process.env.hub_token,
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(response => response.json()).then(data => {
        var dataObject = [];
        for(let i = 0; i < data.length; i++){
            if(data[i].id == '1012905963' || data[i].id == '1158540099' || data[i].id == '1159488241') continue;
            dataObject.push({Id: data[i].id, name: data[i].name, html_url: data[i].html_url, description: data[i].description});
        }
        res.send(dataObject);
    }).catch(error => console.error('Error:', error));

})

app.post('/contactme', async (req, res) => {

    try{

        sgMail.send({
            to: "lrrchinedu@gmail.com",
            "from": req.body.fromEmailAddress,
            "subject": "Inquisition From Portfolio",
            text: req.body.text
        })
        return res.status(200).send({success: "Email Sent"})

    }catch(e){
        return res.status(500).send({error: "an error occured"})
    }
})


app.listen(process.env.port || 3000, () => console.log("app is live"));