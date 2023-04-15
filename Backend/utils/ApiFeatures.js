class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(key){
        if(key === 'order'){
            this.query = this.query.find((this.queryStr.keyword)?{
                orderStatus:{
                    $regex:this.queryStr.keyword,
                    $options:'i'
                }
            }:{}) 
        }
        else{
            this.query = this.query.find((this.queryStr.keyword)?{
                name:{
                    $regex:this.queryStr.keyword,
                    $options:'i'
                }
            }:{})
        }
        return this;
    }

    filter(){
        const copyQuery = {...this.queryStr};
        const rem = ['keyword','page','limit'];
        rem.forEach(key=>{
            delete copyQuery[key];
        })
        //For Price
        let queryStr = JSON.stringify(copyQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`)
        this.query = this.query.find(JSON.parse(queryStr));

        //For Rating
        
        return this;
    }
    pagination(itemsPerPage){
        const currentPage = this.queryStr.page || 1;
        const skip = itemsPerPage * (currentPage-1);
        this.query = this.query.limit(itemsPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;