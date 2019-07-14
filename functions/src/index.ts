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
            size: 'letter',
            layout: 'landscape'
        })
        
        pdf.font('Times-Bold').fontSize(25).text('UNIVERSIDAD POLITÉCNICA DE CHIAPAS', {
            align:'center'
        })
        pdf.moveDown();
        pdf.moveDown();
        pdf.font('Times-Italic').fontSize(25).text('Otorga el siguiente reconocimiento', {
            align:'center'
        });
        pdf.moveDown();
        pdf.moveDown();
        pdf.moveDown();
        pdf.font('Times-Bold').fontSize(15).text(`A el alumno(a): ${name}`, {
            align:'left'
        });
        pdf.moveDown();
        pdf.moveDown();
        pdf.moveDown();
        
        pdf.font('Times-Roman').fontSize(15).text(`Por haber participado en el taller: ${taller}`, {
            align:'justify'
        });
        
        pdf.moveDown();
        pdf.moveDown();
        pdf.moveDown();
        pdf.moveDown();pdf.moveDown();pdf.moveDown();pdf.moveDown();
        pdf.lineJoin('miter')
        .rect(240, 450, 300, 0)
        .stroke();
        pdf.font('Times-Roman').fontSize(15).text('Nombre y firma del director', {
            align:'center'
        });
        pdf.moveDown();
        pdf.font('Times-Bold').fontSize(15).text(`${fecha}`, {
            align:'left'
        });
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
    }
    else
    {
        return Promise.reject("El documdnto no se encuentra")
    }
})