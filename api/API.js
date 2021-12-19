const express = require("express");
const mongoose = require("mongoose");
//Our router gets the requests from the server.
const router = express.Router();
const Mantra = require("../models/Mantra");
const {sendACardByEmail} = require("../email_service/email_service");
require("dotenv").config();

//Take post calls to the URL.
router.post("/newmantra", (req, res) => {
    const json = req.body;
    const newMantra = new Mantra({
        date: json.date,
        mantraText: json.mantraText,
        cardColor: json.cardColor
    });
    newMantra.save((err) => {
        if(err){
            res.status(500).json({
                message: {
                    msgBody: "An error occurred while saving mantra",
                    msgError: true
                }
            });
        } else {
            sendACardByEmail({email:`emma.livscoach@gmail.com`});
            res.status(201).json({
                message: {
                    msgBody: "Mantra successfully created",
                    msgError: false
                }
            });
        }
    });
});
 
//Take get calls to the URL.
router.get("/getmantras", (req, res) => {
    Mantra.find({}, (err, documents) => {
        if (err) {
            res
            .status(500)
            .json({
                message: {
                    msgBody: "An error occurred while getting mantras",
                    msgError: true
                }
            });
        } else {
            res
            .status(200)
            .json({
                mantras: documents
            });
        }
    });
});

//Take update calls to the URL.
router.put("/updatemantra/:id", (req, res) => {
    const json = req.body;
    Mantra.findByIdAndUpdate(
        req.params.id,
        {
            date: json.date,
            mantraText: json.mantraText,
            cardColor: json.cardColor
        },
        (err) => {
            if (err) {
                res
                .status(500)
                .json({
                    message: {
                        msgBody: "An error occurred while updating mantra",
                        msgError: true
                    }
                });
            } else {
                res
                .status(200)
                .json({
                    message: {
                        msgBody: "Mantra successfully updated",
                        msgError: false
                    }
                });
            }
        }
    )
})

//Take delete calls to the URL.
router.delete("/deletemantra/:id", (req, res) => {
    Mantra.findByIdAndDelete(
        req.params.id,
        (err) => {
            if (err) {
                res
                .status(500)
                .json({
                    message: {
                        msgBody: "An error occurred while deleting mantra",
                        msgError: true
                    }
                });
            } else {
                res
                .status(200)
                .json({
                    message: {
                        msgBody: "Mantra successfully deleted",
                        msgError: false
                    }
                });
            }
        }
    )
})

router.post("/sendmantra", (req, res) => {
    const json = req.body;
    console.log(json);
    sendACardByEmail(json);
})

module.exports = router;