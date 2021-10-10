
const productsController = (app,con) => {

    app.get('/addItem',(req,res) => {

        res.render('addItem',{page:{main:'Add Item',parent:'Products'}})
    })

    app.post('/addItem',(req,res) => {

        //console.log(req.body)

        let query = `INSERT INTO \`products\` (\`name\`, \`weight\`, \`buyPrice\`, \`sellPrice\`, \`stock\`, \`gst\`) VALUES (\'${req.body.name}\', \'${req.body.weight}\',\'${req.body.buyPrice}\',\'${req.body.sellPrice}\',\'${req.body.stock}\',\'${req.body.gst}\')`

        con.query(query, function (err, result, fields) {
            if (err){

                if(err.code == 'ER_DUP_ENTRY'){

                    res.send('duplicate entry')
                }
            }
            else{

                res.send('success')
            }
        });
    })

    app.post('/editItem',(req,res) => {

        //console.log(req.body)

        let query = `UPDATE \`products\` SET \`name\`=\'${req.body.name}\',\`weight\` = \'${req.body.weight}\',\`buyPrice\` = \'${req.body.buyPrice}\',\`sellPrice\` = \'${req.body.sellPrice}\',\`stock\` = \'${req.body.stock}\',\`gst\` = \'${req.body.gst}\' WHERE \`products\`.\`id\` = \'${req.body.id}\'`

        con.query(query, function (err, result, fields) {
            if (err){

                if(err.code == 'ER_DUP_ENTRY'){

                    res.send('duplicate entry')
                }
            }
            else{

                res.send('success')
            }
        });

    })

    app.get('/dltItem',(req,res) => {

        let query = `DELETE FROM \`products\` WHERE \`id\` = ${req.query.id}`;

        con.query(query, function (err, result, fields) {
            if (err){

                if(err.code == 'ER_DUP_ENTRY'){

                    res.send('duplicate entry')
                }
                else{
                    throw err
                }
            }
            else{

                res.redirect('/allProducts')
            }
        });
    })

    app.get('/allproducts',(req,res) => {

        con.query("SELECT * FROM products", function (err, result, fields) {
            if (err) throw err;
                  
            //console.log(result)

            res.render('allProducts',{page:{main:'All Products',parent:'Products'},'products':result})
        });
        

    })

    app.post('/searchProduct',(req,res) => {

        let query = `SELECT * FROM products WHERE \`name\` LIKE \'%${req.body.searchVal}%\'`

        con.query(query, function (err, result, fields) {
            if (err) throw err;
                  
            //console.log(result)

            res.render('allProducts',{page:{main:'All Products',parent:'Products'},'products':result})
        });
        

    })


}

module.exports = productsController