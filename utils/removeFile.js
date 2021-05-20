//Import modules
const fs=require("fs");

let removeFile=(filePath)=>{
    fs.unlink(filePath,(err)=>{
        console.log(err);
    })

}
module.exports=removeFile;