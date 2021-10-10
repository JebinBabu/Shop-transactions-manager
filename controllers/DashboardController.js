
const dashboardController = (app,con) => {

    app.get('/dashboard',(req,res) => {

        res.render('dashboard',{page:{main:'Dashboard'}})
    })

}

module.exports = dashboardController