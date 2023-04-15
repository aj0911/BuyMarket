const nodemailer = require('nodemailer')

exports.sendEmail = async(to,subject,text) =>{
      // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    service:process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASS, 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_USER, 
    to, 
    subject, 
    text
  });
}

exports.intToString = num => {
  num = num.toString().replace(/[^0-9.]/g, '');
  if (num < 1000) {
      return num;
  }
  let si = [
    {v: 1E3, s: "K"},
    {v: 1E6, s: "M"},
    {v: 1E9, s: "B"},
    {v: 1E12, s: "T"},
    {v: 1E15, s: "P"},
    {v: 1E18, s: "E"}
    ];
  let index;
  for (index = si.length - 1; index > 0; index--) {
      if (num >= si[index].v) {
          break;
      }
  }
  return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
};

exports.getFullMonth = (monthNum)=>{
  if(monthNum<0){
    monthNum =  12-((-monthNum)%12)
  }
  switch(monthNum){
    case 0:return 'Jan';
    case 1:return 'Feb';
    case 2:return 'Mar';
    case 3:return 'Apr';
    case 4:return 'May';
    case 5:return 'June';
    case 6:return 'Jul';
    case 7:return 'Aug';
    case 8:return 'Sept';
    case 9:return 'Oct';
    case 10:return 'Nov';
    case 11:return 'Dec';
  }
}