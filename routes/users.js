const router = require('koa-router')()
const Joi = require('joi')
const Users = require('../models/users');

router.prefix('/users')

router.post('/', function (ctx, next) {
    let data = ctx.request.body
    let schema = Joi.object().keys({
        username: Joi.string().required(),
        sex: Joi.string().required(),
        age: Joi.number().required()
    })
    let result = Joi.validate(data, schema);
    if(result.error) {
        return ctx.body = result.error.details
    }else{
        let reqdata = result.value;  //经过验证后的数据
        // ctx.body =  Users.create(reqdata)
        next()
    }
   
})

router.get('/', async (ctx, next)=> {
    ctx.body = await Users.find()
})

router.get('/:_id', async (ctx, next)=> {
    let _id = ctx.params._id
    ctx.body = await Users.findOne({_id})
})

// 创建用户
router.post('/', async (ctx, next)=> {
    //console.log(1000)
    let data = ctx.request.body
    ctx.body = await Users.create(data)
})

router.put('/:_id', async (ctx, next)=> {
    let _id = ctx.params._id
    let data = ctx.request.body
    ctx.body = await Users.update({_id}, { $set: data }, {
        runValidators: true
    })
})

router.delete('/:_id', async (ctx, next)=> {
    let _id = ctx.params._id
    ctx.body = await Users.deleteOne({_id})
})

module.exports = router
