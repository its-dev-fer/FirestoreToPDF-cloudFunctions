import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

// import sgMail = require("@sendgrid/mail")
const PDFDocument = require('pdfkit')


const nodemailer = require('nodemailer')

admin.initializeApp()
// sgMail.setApiKey("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")

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '163189@ids.upchiapas.edu.mx',
        pass: 'TICHATICHA'
    }
})

export const firestoreChange = functions.firestore.document('registros/{nuevo}')
.onCreate((snap, context) => {
    const data = snap.data()
    if(data)
    {
        console.log(data)
        // Obtención de los datos del registro en firestore
        const name = data.name
        const mail = data.email
        const taller = data.taller
        const fecha = data.fecha

        //Creación del PDF
        const pdf = new PDFDocument({
            size: 'letter'
        })
        pdf.text(
            `Saludos ${name}, te recordamos que tu curso "${taller}" es el día ${fecha}`
        )
        pdf.end()

        const mailOptions = {
            from: '163189@ids.upchiapas.edu.mx', // Something like: Jane Doe <janedoe@gmail.com>
            to: mail,
            subject: 'Pruebas', // email subject
            attachments:[{
                filename: 'Taller.pdf',
                content: pdf,
                contentType: 'application/pdf'
            }]
        }

        return transporter.sendMail(mailOptions, (erro:any, info:any) => {
            if(erro){
                console.error(erro)
            }
            console.log('Enviado')
            return Promise.resolve('OK')
        });



        // sgMail.send({
        //     from: "163189@ids.upchiapas.edu.mx",
        //     to: "163189@ids.upchiapas.edu.mx",
        //     cc: { name: "Some One", email: "someone@example.org" },
        //     subject: "Test Email",
        //     text: "This is a test email",
        //     html: "<p>This is a test email</p>"
        // }).then(result => {
        // console.log("Sent email");
        // }, err => {
        // console.error(err);
        // })

        // const msg = {
        //     to: mail,
        //     from: '163189@ids.upchiapas.edu.mx',
        //     subject: 'Taller',
        //     text: `Saludos ${name}`
        // };
        // sgMail.send(JSON.stringify(msg));
    }
    else
    {
        return Promise.reject("El documdnto no se encuentra")
    }
})