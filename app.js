const express = require('express')
const app = express()
app.use(express.json())
const mongoose = require('mongoose')
const cors = require('cors')
app.use(cors())
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = "wnwfwnejnewf23842.[]ka!dmqddm2121.;;[2;'/1/212[/n2hl3;"

const mongoUrl =
  'mongodb+srv://abdulfazal2000:abdul18fazal@cluster0.ioerc0t.mongodb.net/'
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to db')
  })
  .catch((e) => {
    console.log(e)
  })

app.listen(5000, () => {
  console.log('server started')
})

// app.post('/post', async (req, res) => {
//   const { data } = req.body

//   try {
//     if (data == 'yoyo') res.send({ status: 'ok' })
//     else {
//       res.send({ status: 'user not found' })
//     }
//   } catch {
//     res.send({ status: 'error' })
//   }
// })

require('./userDetails')
require('./itemDetails')

const User = mongoose.model('UserInfo')
const Items = mongoose.model('ItemDetails')

app.post('/register', async (req, res) => {
  const { fname, lname, email, password } = req.body
  const encryptedPassword = await bcrypt.hash(password, 10)
  try {
    const oldUser = await User.findOne({ email })
    if (oldUser) {
      return res.send({ status: 'sike, user with this email already exists' })
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    })
    res.send({ status: 'registered' })
  } catch (error) {
    res.send({ status: 'error' })
  }
})

app.post('/login-user', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.send({ error: 'user not found' })
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET)

    // if (res.status(201)) {
    return res.json({ status: 'ok', data: token })
    // } else {
    //   return res.json({ error: 'error' })
    // }
  } else {
    return res.json({ status: 'error', error: 'invalid password' })
  }
})

app.post('/userData', async (req, res) => {
  const { token } = req.body
  try {
    const user = jwt.verify(token, JWT_SECRET)
    const useremail = user.email
    await User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: 'ok', data: data })
      })
      .catch((error) => {
        res.send({ status: 'error', data: error })
      })
  } catch (error) {}
})


app.post('/itemRegister', async(req,res)=>{
    const {itemName,desc,years,price,phno,image,token}=req.body
    try{
        const user = jwt.verify(token,JWT_SECRET)
    const email=user.email
     await Items.create({
        item: itemName,
        desc,
        years,
        price,
        phno,
        image,
        email,
     })
     res.send({status: 'item listed'})
    } catch(error){
        res.send({status: 'error'})
    }
    
})

app.get('/allListings',async(req,res)=>{
  let query={}
  const searchData=req.query.search
  if(searchData){
    query={
      $or:[
        {item:{$regex:searchData,$options:"i"}},
        {desc:{$regex:searchData,$options:"i"}}
       
      ]
    }
  }
  try{
    const items=await Items.find(query)
    res.send({status:"item list ok",data: items})
  }
  catch(error){
    res.send({status:"error"})
  }
})