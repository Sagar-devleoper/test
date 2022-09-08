const express = require('express');
const subsubCategories = require('../models/subSubCategory')
const product = require("../models/Product")
const q = require('q')
const multer = require("multer")
const AWS = require('aws-sdk')
const config = require('../config/config')

const accessId = config.accessId
const secretKey = config.secretKey
const BUCKET_NAME = config.BUCKET_NAME

AWS.config.credentials = {
    accessKeyId: accessId,
    secretAccessKey: secretKey,
    region: "ap-south-1",
    ACL: "public-read",
}

AWS.config.region = "ap-south-1"

const s3 = new AWS.S3()

exports.addSubSubCategory = async (req, res) => {
    try {
        console.log(req.files, "req.file")


        // old object
        let fileObject = [
            {
                key: req.files.image[0].originalname,
                value: req.files.image[0].buffer,
                filekey: 'image'
            },
        ]
        console.log(fileObject , "fileObject")

        let newupdateobject = await uploadMultipleFiles(fileObject).then(data => {
            console.log(data, '79')
            return data
        }).catch((err) => {
            console.log(err)
        })
        
        let icon
        newupdateobject && newupdateobject.map(m => {
            if (m.key === 'image') {
                console.log(m.Location)
                icon = m.Location
                return m.Location
            }
        })

        const subsubcategoryData = await subsubCategories.create({
            name: req.body.name,
            image: icon,
            subCategory: req.body.subCategory,
        })

        await subsubcategoryData.save()

        res.status(200).json({
            success: true,
            message: "sub catgeory added",
            data: subsubcategoryData
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ message: "Something went wrong", err });
    }
}


async function uploadMultipleFiles(fileObject) {
    console.log(fileObject, "fileobject")
    const deferred = q.defer();
    let s3response = []
    try {

        for (const file of fileObject) {
            const params = {
                Bucket: BUCKET_NAME,
                Key: file.key, // File name you want to save as in S3
                Body: file.value,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
            };
            const data = await s3.upload(params).promise()
            console.log(data, '54')
            s3response.push({
                key: file.filekey,
                fileName: data.key,
                Location: data.Location
            })
        }

    } catch (err) {
        console.log(err)
    }
    deferred.resolve(s3response)
    console.log(deferred, "deferred")
    return deferred.promise

}

exports.UpdateSubCategory = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        
        const findSubCategory = await subsubCategories.findById(req.params.id)
        

        if (!findSubCategory) {
            res.status(400).json({ 
                success : false, 
                error : "Not Find This Record" 
            })
            
            return
        }

        if (findSubCategory) {

            const updatesubCategory = await subsubCategories.findByIdAndUpdate(req.params.id ,  data  , {new : true})

            if (!updatesubCategory) {
                res.status(400).json({ 
                    success : false, 
                    error : "Unable To Update The Record" 
                })
                
                return
            }

            if (updatesubCategory) {
                res.status(200).json({ 
                    success : true, 
                    message : "Sub Category Is Updated" ,
                    data : updatesubCategory
                })
                
                return
            }
            
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success : false, 
            error : "Update Agent Is Not Possible" 
        })
    }
}