var currentSale = []
var currentSaleSum = 0
var currentSaleSumWithGST = 0

var currentPurchase = []
var currentPurchaseSum = 0

var currentExpense = []
var currentExpenseSum = 0


const transactionsController = (app,con) => {

    // sales

    app.get('/transactions-sale',(req,res) => {

        con.query("SELECT * FROM products", function (err, result, fields) {
            if (err){ throw err;}

            res.render('transactions-sale',{page:{main:'Sale',parent:'Transactions'},'products':result,'currentSale':currentSale,'sumTotal':currentSaleSumWithGST})
        });
    })

    app.post('/saleItemPrice',(req,res) => {

        let query = `SELECT \`sellPrice\`,\`weight\`,\`gst\` FROM products WHERE \`id\` = \'${req.body.productId}\'`

        con.query(query, function (err, result, fields) {
            if (err) throw err;
                  
            //console.log(result)

            res.send(result)
        });
        
    })

    app.post('/updateCurrentSale',(req,res) => {

        

                //console.log('update sale',req.body)
                currentSale.push(req.body)

                let withGST = Number(req.body.totalPriceWithGST)
                withGST = withGST.toFixed(2)
                currentSaleSumWithGST += Number(withGST)

                let withoutGST = Number(req.body.totalPrice)
                withoutGST = withoutGST.toFixed(2)
                currentSaleSum += Number(withoutGST)

                res.redirect('/transactions-sale')
            
        
    })
  
    app.get('/deleteSaleItem',(req,res) => {

        let index = req.query.id

        currentSale.splice(index,1)

        currentSaleSumWithGST -= Number(req.query.totalPriceWithGST)

        currentSaleSum -= Number(req.query.totalPrice)

        res.redirect('/transactions-sale')
    })

    app.post('/submitBill',(req,res) => {

        let productNos = currentSale.length

        let p = currentSaleSumWithGST - currentSaleSum

        if(currentSaleSum > 0){

            var date = req.body.date
            
            let query = `INSERT INTO \`bills\`(\`customerName\`, \`productNos\`,\`totalGST\`, \`totalPriceWithGST\`, \`totalPrice\`, \`date\`) VALUES (\'${req.body.customerName}\',\'${productNos}\',\'${p}\',\'${currentSaleSumWithGST}\',\'${currentSaleSum}\',\'${date}\')`
            
            con.query(query, function (err, result, fields) {
                if (err) throw err;
                      
                con.query("SELECT * FROM \`bills\` ORDER BY id DESC LIMIT 1", function (err, result, fields) {
                    if (err) throw err;
                          
                    let id = result[0].id
                    let customerName = result[0].customerName
        
                    for (let j = 0; j < currentSale.length; j++) {
                        const el = currentSale[j];

                        //console.log('sale queries',currentSale,id,customerName,date)

                        let query = `INSERT INTO \`sales\`(\`billNo\`,\`customerName\`,\`item\`,\`itemCode\`,\`weight\`,\`nos\`,\`price\`,\`discount\`,\`gst%\`,\`totalGST\`, \`totalWithoutGST\`, \`totalWithGST\`, \`date\`) VALUES (\'${id}\',\'${customerName}\',\'${el.name}\',\'${el.id}\',\'${el.weight}\',\'${el.nos}\',\'${el.pricePerItem}\',\'${el.discount}\',\'${el.gst}\',\'${el.totalGST}\',\'${el.totalPrice}\',\'${el.totalPriceWithGST}\',\'${date}\')`
                        //console.log(query)
                        con.query(query, function (err, result, fields) {
                            if (err) throw err;

                        });

                        let query2 = `UPDATE \`products\` SET stock = stock - \'${el.nos}\' WHERE id = \'${el.id}\'`

                        con.query(query2, function (err, result, fields) {
                            if (err) throw err;

                        });

                        
                    }
                    currentSale = []
                    currentSaleSum = 0
                    currentSaleSumWithGST = 0
                });
                
                res.redirect('/transactions-sale')
            });
        }

        

    })

    app.get('/remainingStock',(req,res) => {

        let query = `SELECT \`stock\` from \`products\` WHERE id = \'${req.query.id}\'`

        con.query(query,(err, result, fields) => {

            if(err) throw err;

            //console.log(req.query)

            let stock = result[0]
            res.send(stock)

        })
    })

    // purchases

    app.get('/transactions-purchase',(req,res) => {

        con.query("SELECT * FROM products", function (err, result, fields) {
            if (err) throw err;
                  
            //console.log(result)

            res.render('transactions-purchase',{page:{main:'Purchase',parent:'Transactions'},'products':result,'currentPurchase':currentPurchase,'sumTotal':currentPurchaseSum})
        });
    })

    app.post('/updateCurrentPurchase',(req,res) => {
   
        currentPurchase.push(req.body)
        currentPurchaseSum += Number(req.body.totalPrice)

        res.redirect('/transactions-purchase')

    })

    app.get('/deletePurchaseItem',(req,res) => {

        let index = req.query.id

        currentPurchase.splice(index,1)

        currentPurchaseSum -= Number(req.query.totalPrice)


        res.redirect('/transactions-purchase')
    })

    app.post('/purchaseItemPrice',(req,res) => {

        let query = `SELECT \`buyPrice\`,\`weight\` FROM products WHERE \`id\` = \'${req.body.productId}\'`

        con.query(query, function (err, result, fields) {
            if (err) throw err;
                  
            //console.log(result)

            res.send(result)
        });
        
    })

    app.post('/submitReceipt',(req,res) => {

        let productNos = currentPurchase.length

        if(currentPurchaseSum > 0){

            var date = req.body.date
            
            let query = `INSERT INTO \`receipts\`(\`receiptNo\`,\`supplierName\`, \`productNos\`, \`totalPrice\`, \`date\`) VALUES (\'${req.body.receiptNo}\',\'${req.body.supplierName}\',\'${productNos}\',\'${currentPurchaseSum}\',\'${date}\')`
            
            con.query(query, function (err, result, fields) {
                
                if (err){ 
                    
                    console.log(err)
                }
                else{

                    for (let j = 0; j < currentPurchase.length; j++) {
                        const el = currentPurchase[j];

                        let query = `INSERT INTO \`purchase\`(\`receiptNo\`,\`supplierName\`, \`item\`, \`weight\`, \`nos\`, \`price\`, \`total\`, \`date\`) VALUES (\'${req.body.receiptNo}\',\'${req.body.supplierName}\',\'${el.name}\',\'${el.weight}\',\'${el.nos}\',\'${el.pricePerItem}\',\'${el.totalPrice}\',\'${date}\')`
                        
                        con.query(query, function (err, result, fields) {
                            if (err) throw err;

                        });

                        let query2 = `UPDATE \`products\` SET stock = stock + \'${el.nos}\' WHERE id = \'${el.id}\'`

                        con.query(query2, function (err, result, fields) {
                            if (err) throw err;

                        });

                        
                    }

                    currentPurchase = []
                    currentPurchaseSum = 0
                
                    res.redirect('/transactions-purchase')
                }   
  
            });

            
        }

        

    })

    // Expenses

    app.get('/transactions-expenses',(req,res) => {

        con.query("SELECT DISTINCT \`name\` FROM expenses", function (err, result, fields) {
            if (err){ throw err;}

            res.render('transactions-expenses',{page:{main:'Expenses',parent:'Transactions'},'products':result,'currentSale':currentExpense,'sumTotal':currentExpenseSum})
        });

        
    })

    app.post('/updateCurrentExpense',(req,res) => {
        
        currentExpense.push(req.body)
        currentExpenseSum += Number(req.body.amount)

        //console.log(currentExpense)

        res.redirect('/transactions-expenses')

    })

    app.get('/deleteExpenseItem',(req,res) => {

        let index = req.query.id

        currentExpense.splice(index,1)

        currentExpenseSum -= Number(req.query.amount)

        //console.log(currentExpenseSum)

        res.redirect('/transactions-expenses')
    })

    app.post('/submitExpenses',(req,res) => {

        //console.log(req.body)
        let date = req.body.date

        for (let i = 0; i < currentExpense.length; i++) {
            const el = currentExpense[i];

            let name

            if(el.expenseType == 'new'){

                name = el.newExpense
            }
            else{

                name = el.existingExpense
            }

            let query = `INSERT INTO \`expenses\`(\`name\`, \`amount\`, \`party\`, \`date\`) VALUES (\'${name}\',\'${el.amount}\',\'${el.party}\',\'${date}\')`
            
            con.query(query,(err,result,fields) => {

                if(err) throw err;

            })
        }

        currentExpense = []
        currentExpenseSum = 0

        res.redirect('/transactions-expenses')
    })
}

module.exports = transactionsController