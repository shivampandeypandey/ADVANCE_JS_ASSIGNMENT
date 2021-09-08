$("#load").on("click",function(){
    let url='https://api.github.com/search/repositories?q=';
    const query=$("#github").val();
    url=url +query;
    $.get(url).then(async(data)=>{
        const result= await populateInfo(data.items);
        console.log(result);
    });
})

 const populateInfo =  async(data)=>{
    let ans=[];
    data.forEach(async(item)=>{
        let owner = {
            login: item.owner.login
        };
       
        try{
            let res = await $.get(item.owner.url);
            owner.name = res.name;
        }catch{
            owner.name = "";
        }
        try{
            res = await $.get(item.owner.followers_url);
            owner.followersCount = res.length;
        }
        catch{
            owner.followersCount = 0;
        }
        try{
            res = await $.get(item.owner.following_url.split("{")[0]);
            owner.followingCount = res.length;
        }
        catch{
            owner.followingCount = 0;
        }
        let numberOfBranch;
        try{
            res = await $.get(item.branches_url.split("{")[0]);
            numberOfBranch = res.length;
        }
        catch{
            numberOfBranch = 0;
        }
        let license = ""
        if(item.license) {
            license = item.license.name
        } else {
            license = ""
        }
        ans.push({
            name:item.name,
            full_name: item.full_name,
            private: item.private,
            owner:owner,
            licenseName:license,
            score: item.score,
            numberOfBranch: numberOfBranch
        });
    });
    return ans;
 }
