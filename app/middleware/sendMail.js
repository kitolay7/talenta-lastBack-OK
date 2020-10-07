const nodemailer = require("nodemailer");
const HttpStatus = require('http-status-codes');
const { resolve } = require("path");
const emailCheck = require('email-check');
require('dotenv/config');
exports.sendMail = async (req, res, next) => {
	
  //console.log(req);
  try {

    const transporter = nodemailer.createTransport({
      host:  process.env.SMTP_HOST,
      port:  process.env.SMTP_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user:  process.env.SMTP_USER,
        pass:  process.env.SMTP_PASSWORD,
      }
    });
    
    
    /*
    await emailCheck(req.body.email_recipient, {	
  		from: process.env.FROM_EMAIL,
  		timeout: 100000
    })
  	.then((resp) => {
    	// Returns "true" if the email address exists, "false" if it doesn't.
  		console.log(resp);
      	if (!resp) { // if email doesn't exist : resp = false
        	throw "L'adresse email n'existe pas";
      	}
  	})
  	.catch((err) => { throw err });
  	*/
  	
    // verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        throw error;
      } else {
        console.log("Server is ready to take our messages");
      }
    });
  
    
    
    let mail = {
      from: process.env.FROM_EMAIL,
      to: req.body.email_recipient,
      subject: req.body.email_subject,
      html: req.body.email_content,
      attachments: req.body.email_attachement ? req.body.email_attachement : ''
    };
    // console.log(mail);
  
    await transporter.sendMail(mail)
    	.then((resp) => {
    		console.log(resp)
    	})
    	.catch((err) => { throw err});
    transporter.close();
    	
    	/*
    await transporter.sendMail(mail, (error, info, response) => {
    	console.log(`\n\n\n${info}\n\n\n`);
    	console.log(`\n\n\n${response}\n\n\n`);
      if (error) {
        throw error;
      } else {
        console.log("Mail envoyé à " + req.body.email_recipient + " avec succès!")
        res
          .status(HttpStatus.OK)
          .send({ message: "Mail envoyé avec succès!" });
      }
    });
    */
  } catch (error) {
    console.log("Erreur lors de l'envoie du mail!");
        console.log(error);
        res
          .status(HttpStatus.BAD_REQUEST)
          .send({
            error: true,
            message: error
          });
  }
}

exports.sendMailGroup = async (req,res,next) => {
  let result = [];
  try {    
    const transporter =  nodemailer.createTransport({
      host:  process.env.SMTP_HOST,
      port:  process.env.SMTP_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user:  process.env.SMTP_USER,
        pass:  process.env.SMTP_PASSWORD,
      }
    });
    const postulations = req.body.data;
    for (let index = 0; index < postulations.length; index++) {      
      // verify connection configuration
      transporter.verify((error, success) => {
        if (error) {
          throw error;
        } else {
          console.log("Server is ready to take our messages");
        }
      });  
      let responseSendMail = await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: postulations[index].user.email,
        subject: postulations[index].subject,
        html: postulations[index].content
      })
      .then((info)=> {return {name:`${postulations[index].user.profile.firstName} ${postulations[index].user.profile.lastName}`,info:info}})
      .catch(error => {throw error});
      result.push(responseSendMail);
    }
    await res
    .status(HttpStatus.OK)
    .send({ data: result, message: "tous les Mails envoyé avec succès!", error:false });
    
    await transporter.close();
    // console.log(`\n\n\nBODY ${JSON.stringify(req.body.data)}\n\n\n`);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message, error: true });
  }
}
