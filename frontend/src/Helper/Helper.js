const categories = [
    'Mens',
    'Womens',
    'Kids',
    'Electronics',
    'Food',
    'Accessories',
    'Books',
    'Footwear'
]

export const urlPrefix = `/api/v1`;
const monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];
export const getFullDate = (dateNumber,isTime)=>{
    if(isTime === undefined){
        return `${(new Date(dateNumber)).getDate()} ${monthNames[(new Date(dateNumber)).getMonth()]} ${(new Date(dateNumber)).getFullYear()}, ${(new Date(dateNumber)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
    }
    else if(isTime ===''){
        return `${monthNames[(new Date(dateNumber)).getMonth()]} ${(new Date(dateNumber)).getDate()}, ${(new Date(dateNumber)).getFullYear()}`
    }
    else if(isTime === '*'){
        return `${(new Date(dateNumber)).getDate()} ${monthNames[(new Date(dateNumber)).getMonth()]} ${(new Date(dateNumber)).getFullYear()}`
    }
    else{
        return `${(new Date(dateNumber)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
    }
}

export const intToString = num => {
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

export default categories;

