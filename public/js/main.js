function ExportToExcel(type, fn, dl) {
    var elt = document.getElementById('mainTable');
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    return dl ?
      XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
      XLSX.writeFile(wb, fn || ('TharakansReport.' + (type || 'xlsx')));
 }

function giveMeDate(){

  // set date
  let d = new Date()
  let month = (d.getMonth() + 1 < 10)? '0' + (d.getMonth() +1) : d.getMonth()+1
  let date = (d.getDate() < 10)? '0' + d.getDate() : d.getDate()
  let x = d.getFullYear() + '-' + month + '-' + date

  return x
}


function setFooterDate(){

    let x = giveMeDate()
    $('#footerDate').html(x)
}
setFooterDate()

function setAlert(type,message){

  $('#' + type + 'Alert').css('display','')
  $('#' + type + 'Alert').html(message)
}

