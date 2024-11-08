const { redirect } = require('express/lib/response');
const models = require('../models/adminModels');
// const user = require('../models/userModels');
const { log, error } = require('console');
const { use } = require('../router/adminRouter');
const res = require('express/lib/response');
// const bcrypt = require("bcrypt")
// const mongoose = require("mongoose");
// const nocache = require('nocache');

exports.getCategories = async (req, res) => {

    
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        // const items = await user.User.find().skip(skip).limit(limit);
        const total = await models.Category.countDocuments();
        // console.log(total);
        let error = req.session.isExist?"This category is already exists":"";
        req.session.isExist = false

        const categories = await models.Category.find().skip(skip).limit(limit);
        // console.log(categories)
        res.render('admin/category', { categories: categories, 
            error: error,
            currentPage: page,
            limit:limit,
            totalPages: Math.ceil(total / limit),
         });
        
    } catch (error) {
        console.log(error);
        
    }

    
}

exports.postCategories = async (req, res) => {
    try {
        console.log("haiiiiiiiiii");
        
        const category = req.body.category;
        const description = req.body.description;
        const categories = await models.Category.find()


        const isExist = await models.Category.find({ categoryName: { $regex: /category/i } });
        console.log(isExist)

        if (isExist) {
            req.session.isExist = true;
            return res.redirect('/admin/categories' );

        }

        const newCategory = new models.Category({
            categoryName: category,
            description: description
        });
        // console.log(category);


        await newCategory.save();
        res.redirect('/admin/categories')

    } catch (error) {
        console.error(error);


    }
}

exports.listOrUnlist = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await models.Category.findOne({ _id: categoryId });

        if (category.status === true) {
            await models.Category.updateOne({ _id: categoryId }, { $set: { status: false } });
            // console.log(isBlocked);
            console.log("UNBLOCKED");
            res.redirect('/admin/categories');
        } else {
            await models.Category.updateOne({ _id: categoryId }, { $set: { status: true } });
            // console.log(isBlocked);
            console.log("BLOCKED");
            res.redirect('/admin/categories');

        }


    } catch (error) {
        console.log(error);

    }

}

exports.getCategoryEdit = async (req, res) => {
    const categoryId = req.params.id;

    const category = await models.Category.findOne({ _id: categoryId });

    res.render('admin/editCategory',{error:"",category})
}

exports.editCategory = async (req, res) => {

    const {category, description} = req.body
    // const description = req.body.description;
    try {
        await models.Category.updateOne({ _id: req.params.id }, 
            { categoryName: category, description });
        res.redirect('/admin/categories');
    }
    catch (err) {
        console.error(err)

    }


}


exports.deleteCategory = async (req, res) =>{
    const categoryId = req.params.id;
    try{
        await models.Category.deleteOne({_id:categoryId});
        res.redirect('/admin/categories');


    }  catch (error){

    }  
    
}