
const LoginController = (app) => {

    app.get('/',(req,res) => {

        res.render('login',{data:'hello user'})
    })

    app.post('/login',(req,res) => {

        res.redirect('/dashboard')
    })
}


module.exports = LoginController