

function registerController(app,con){

    app.get('/reports',(req,res) => {

        res.render('reports',{page:{main:'Reports',parent:'Register'},report:{'columns':[],'rows':[]}})
    })

    app.get('/account',(req,res) => {

        con.query('SELECT * FROM \`account\` ORDER BY id DESC',(err,result,fields) => {

            if(err) throw err

            res.render('account',{page:{main:'Account',parent:'Register'},'data':result})
        })

    })


    app.post('/closeAccount',(req,res) => {

        con.query(`SELECT * FROM \`account\` WHERE date = \'${req.body.date}\'`,(err,result,fields) => {

            if(err) throw err;

            if(result.length == 0){

                let openingBalance, sales = 0, purchase = 0, expenses = 0, closingBalance = 0

                con.query("SELECT \`closingBalance\` FROM \`account\` ORDER BY id DESC LIMIT 1",(err,result,field) => {

                    if(result.length == 0){

                        openingBalance = 0
                    }
                    else{
                        openingBalance = result[0].closingBalance
                    }
                })

                con.query(`SELECT SUM(\`totalPriceWithGST\`) FROM \`bills\` WHERE date = \'${req.body.date}\'`,(err,result,field) => {

                    sales = result[0]['SUM(\`totalPriceWithGST\`)']
                })

                con.query(`SELECT SUM(\`totalPrice\`) FROM \`receipts\` WHERE date = \'${req.body.date}\'`,(err,result,field) => {

                    purchase = result[0]['SUM(\`totalPrice\`)']
                })

                con.query(`SELECT SUM(\`amount\`) FROM \`expenses\` WHERE date = \'${req.body.date}\'`,(err,result,field) => {

                    expenses = result[0]['SUM(\`amount\`)']

                    closingBalance = (openingBalance + sales) - ( purchase + expenses )
                    closingBalance = closingBalance.toFixed(2)
                    closingBalance = Number(closingBalance)

                    con.query(`INSERT INTO \`account\`(\`openingBalance\`, \`sales\`, \`purchase\`, \`expense\`, \`closingBalance\`, \`date\`) VALUES (\'${openingBalance}\',\'${sales}\',\'${purchase}\',\'${expenses}\',\'${closingBalance}\',\'${req.body.date}\')`,(err,result,fields) => {

                        if(err) throw err
    
                        console.log(openingBalance,sales,purchase,expenses,closingBalance)
                        res.send('success')
                    })
                })

                
            }
            else{

                let openingBalance, sales = 0, purchase = 0, expenses = 0, closingBalance = 0

                con.query(`SELECT \`openingBalance\` FROM \`account\` WHERE date = \'${req.body.date}\'`,(err,result,field) => {

                    if(result.length == 0){

                        openingBalance = 0
                    }
                    else{
                        openingBalance = result[0].openingBalance
                    }
                })

                con.query(`SELECT SUM(\`totalPriceWithGST\`) FROM \`bills\` WHERE date = \'${req.body.date}\'`,(err,result,field) => {

                    sales = result[0]['SUM(\`totalPriceWithGST\`)']
                })

                con.query(`SELECT SUM(\`totalPrice\`) FROM \`receipts\` WHERE date = \'${req.body.date}\'`,(err,result,field) => {

                    purchase = result[0]['SUM(\`totalPrice\`)']
                })

                con.query(`SELECT SUM(\`amount\`) FROM \`expenses\` WHERE date = \'${req.body.date}\'`,(err,result,field) => {

                    expenses = result[0]['SUM(\`amount\`)']

                    closingBalance = (openingBalance + sales) - ( purchase + expenses )
                    closingBalance = closingBalance.toFixed(2)
                    closingBalance = Number(closingBalance)

                    con.query(`UPDATE \`account\` SET \`openingBalance\` = \'${openingBalance}\', \`sales\` = \'${sales}\', \`purchase\` = \'${purchase}\', \`expense\` = \'${expenses}\', \`closingBalance\` = \'${closingBalance}\' WHERE date = \'${req.body.date}\'`,(err,result,fields) => {

                        if(err) throw err
    
                        console.log(openingBalance,sales,purchase,expenses,closingBalance)
                        res.send('success')
                    })
                })
            }
        })

    })

    app.post('/generateReport',(req,res) => {

        let columns = [], rows = []

        let dailyReport = 
        {
            'table':'dailyReport',
            bills:[],
            receipts:[],
            expenses:[],
            account:[]
        }

        if(req.body.table == 'daily'){

            con.query(`SELECT * FROM \`bills\` WHERE \`date\` = \'${req.body.date}\'`,(err,result,fields) => {

                dailyReport.bills = result
            })

            con.query(`SELECT * FROM \`receipts\` WHERE \`date\` = \'${req.body.date}\'`,(err,result,fields) => {

                dailyReport.receipts = result
            })

            con.query(`SELECT * FROM \`account\` WHERE \`date\` = \'${req.body.date}\'`,(err,result,fields) => {

                dailyReport.account = result
            })

            con.query(`SELECT * FROM \`expenses\` WHERE \`date\` = \'${req.body.date}\'`,(err,result,fields) => {

                dailyReport.expenses = result

                res.render('reports',{page:{main:'Reports',parent:'Register'},report:dailyReport})
            })
        }
        else if((req.body.table == 'sales') || (req.body.table == 'purchase') || (req.body.table == 'expenses')){

            con.query(`select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME=\'${req.body.table}\'`,(err,result,fields) => {

                columns = result
            })

            con.query(`SELECT * FROM \`${req.body.table}\` WHERE \`date\` BETWEEN \'${req.body.fromDate}\' AND \'${req.body.toDate}\'`,(err,result,fields) => {

                rows = result


                res.render('reports',{page:{main:'Reports',parent:'Register'},report:{'table':'transactions','columns':columns,'rows':rows}})
            })
        }

        
    })
}   

module.exports = registerController