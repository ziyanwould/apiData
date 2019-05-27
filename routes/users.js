const router = require('koa-router')()
const Joi = require('joi')
const Users = require('../models/users');
const jwt = require('jwt-simple')
const secret = require('../config/secret')
router.prefix('/users')

const tokenExpiresTime = 1000 * 60 * 60 * 24 * 1
const jwtSecret = secret.sign
router.post('/creatUser', async (ctx, next) =>{
    let data = ctx.request.body
    console.log(data)
    let schema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
        sex: Joi.string().required(),
        age: Joi.number().required()
    })
    let result = Joi.validate(data, schema);
    if(result.error) {
        return ctx.body = result.error.details
    }else{
        let reqdata = result.value;  //经过验证后的数据
        // ctx.body =  Users.create(reqdata)
        await next()
    }
   
})

router.post('/login', async (ctx, next)=> {
    
    //ctx.body = await Users.find()
    const user = ctx.request.body
    const mySql =  await Users.findOne({username:user.username})
    if(mySql){
        const password = mySql.password;
    }

    if (mySql && user.password == password){
        let payload = {
            exp:Date.now() + tokenExpiresTime,
            user:user.username
        }
        let token = jwt.encode(payload, jwtSecret)

        ctx.body = {
            user:user.username,
            code:200,
            message:"登录成功",
            token
        }

    }else {
        ctx.body = {
            code:-1,
            message:"用户名或者密码错误"
        }
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
router.post('/creatUser', async (ctx, next)=> {
    //console.log(1000)
    let data = ctx.request.body

    // 查询用户名是否重复
    const existUser =  await Users.findOne({username:data.username})
      console.log(existUser)
    if(existUser){
        ctx.body = {
            code: 403,
            message: "用户已存在"
        }

    }else{
        
        let payload = {
            exp:Date.now() + tokenExpiresTime,
            user:data.username
        }
        let token = jwt.encode(payload, jwtSecret)
        let mes = await Users.create(data)
        ctx.body = {
            user:data.username,
            code:200,
            token
        }
    }
    
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
