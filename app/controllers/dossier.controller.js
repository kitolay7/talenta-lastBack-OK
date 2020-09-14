const db = require("../models");
const io = require("socket.io-client");

const { error, count } = require("console");
const dossier = db.dossier;
exports.addFolder =  (req, res) => {
    console.log(req.body)
    dossier.create({
        titre:req.body.titre,
        fiche: req.body.fiche,
        auteur: req.body.auteur,
        offreId: req.body.offreId,
        userId: req.body.idUser,
        remarque: ''
    }).then((data) => {
        res
            .send({data:data, message: "Dossier create successfully", error: false});
    })        .catch((err) => {
        res
            .send({ message: err, error: true });
        console.log(">> Error while finding comment: ", err);
    });
  };
  exports.getAllFolderUser = (req, res) => {
    dossier.findAll({
        where:{ userId: req.params.idUser},
        include:[{model: db.offre}]
    })
    .then(data => {
        res
            .send(data);
    })
}
exports.getOneFolder = (req, res) => {
    return dossier.findOne({where:{id:req.params.id},include:[{model:db.offre}]})
        .then((data) => {
            res
                .send({ data: data, error: false });
            return data;
        })
        .catch((err) => {
            res
                .send({ message: err, error: true });
            console.log(">> Error while finding comment: ", err);
        });
}
exports.updateRemarque = (req, res) => {
    console.log(req.body, 'remarqueremarqueremarqueremarqueremarqueremarqueremarque')
    dossier.update(
        {
            remarque: req.body.remarque
        }, {
        where: { id: req.body.id },
        returning: true
    }).then((result) => {
        console.log(`\n\n\n${result}\n\n\n`)
        if (result[1] === 0) throw "Any field is modified"
        res.json({
            message: "this folder is updated successfully",
            error: false
        })
    })
    .catch((error) => {
        console.log(error);
        res
            .send({ message: error, error: true });
    });
     
  };