const nodemailer = require("nodemailer");
const HttpStatus = require('http-status-codes');
const { resolve } = require("path");
const legit = require('legit');
const { error } = require("console");
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
    
  	
  	await legit(req.body.email_recipient)
  	.then(result => {
    	result.isValid ? console.log('Valid!') : console.log('Invalid!');
    	//console.log(JSON.stringify(result));
    	if (!result.isValid) { // if email doesn't exist : resp = false
        	throw "L'adresse email n'existe pas";
      	}
  	})
  	.catch((err) => { throw err });
  	
  	
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
  
    await transporter.sendMail(mail, (error, response) => {
      if (error) {
        throw error;
      } else {
        console.log("Mail envoyé avec succès!")
        res
          .status(HttpStatus.OK)
          .send({ message: "Mail envoyé avec succès!" });
      }
    });
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

exports.sendMailRegister = async (currentUser, token) => {
	
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
    // verify connection configuration
    await transporter.verify()
    .then(async () => {
      console.log("Server is ready to take our messages");
      // const roleId = (req.body.roles.includes('ROLE_RECRUTEUR')) ? 1 : 2 ;
      const roleId = await currentUser.getRoles().then( async (roles) => {
        let result = [];
        for (let index = 0; index < roles.length; index++) {
          result.push(roles[index].id);
        }
        if (result.includes(1)) {
          return 1;
        }
        return 2;
      });
      const url = `${process.env.BASE_URL_CLIENT}confirmation/${token}/${roleId}`
      // const url = `https://${req.headers.host}/confirmation/${token}/${roleId}`
      
      const mail = {
          from:process.env.FROM_EMAIL,
          to: currentUser.email,
          subject: `Confirmation d'adresse email pour Talenta Sourcing`,
          html: `Bonjour! :) 
          <br>
          <br>Veuillez cliquer sur ce lien pour valider votre adresse mail et votre compte : <a href="${url}">${url}</a>
          <br>
          <br>  
          L'équipe Talenta vous remercie de votre confiance. 
          <br>
            ***************************************************************************************************`
      }
      await transporter.sendMail(mail)
      .then(() => {
        console.log("Mail envoyé avec succès!");
      })
      .catch(error => {
        throw error;
      });
    })
    .catch(error => {
      console.log(error);
      throw error;
    })
      
      
    //   (error, success) => {
    //   if (error) {
    //     throw error;
    //   } else {
    //     console.log("Server is ready to take our messages");
    //   }
    // });

    // let mail = {
    //   from: process.env.FROM_EMAIL,
    //   to: req.body.email_recipient,
    //   subject: req.body.email_subject,
    //   html: req.body.email_content,
    //   attachments: req.body.email_attachement ? req.body.email_attachement : ''
    // };
      
    //   (error, response) => {
    //   if (error) {
    //     throw error;
    //   } else {
    //     console.log("Mail envoyé avec succès!")
    //   }
    // });

  } catch (error) {
    console.log("Erreur lors de l'envoie du mail!");
        console.log(error);
        throw error;
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
