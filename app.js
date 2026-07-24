const path = require('path')
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer');

const resumesDir = path.join(__dirname, './public/resumes');

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

app.get('/api/resume', async (req, res) => {

    try {
        const filename = fs.readdirSync(resumesDir).find(f => f.toLowerCase().endsWith('.pdf'));

        if (!filename) {
            return res.status(404).send({ error: 'No resume found' });
        }

        const { PDFParse } = require('pdf-parse');
        const fileBuffer = fs.readFileSync(path.join(resumesDir, filename));
        const parser = new PDFParse({ data: fileBuffer });
        const { pages } = await parser.getText();
        await parser.destroy();

        const text = pages.map(page => page.text).join('\n\n');

        res.send({ filename, url: `/resumes/${filename}`, text });

    } catch (e) {
        res.status(500).send({ error: 'Failed to read resume' });
    }
})

app.post('/contactme', async (req, res) => {

    try{

        const {name, fromEmailAddress, phoneNumber, text} = req.body;

        const contactDetails = JSON.stringify({ name, email: fromEmailAddress, phoneNumber });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.gmail_email,
                pass: process.env.gmail_pass
            }
        });
        await transporter.sendMail({
            from: fromEmailAddress,
            to: process.env.gmail_email,
            subject: "Inquisition From Portfolio",
            text: `${contactDetails}\n\n${text}`
        });

        return res.status(200).send({message: "Message sent successfully"})

    }catch(e){
        return res.status(500).send({error: "an error occured"})
    }
})


app.listen(process.env.port || 3000, () => console.log("app is live"));