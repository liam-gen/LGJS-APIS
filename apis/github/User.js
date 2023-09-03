const API = require('../default')

class User extends API{
    constructor(username=false){
        super("https://api.github.com")
        username ? this.#setup(username) : "";
        this.exist = false
    }

    #setup(username){
        this.request("/users/"+username).then(res => {
            let userElements = {
                "login": "login",
                "id": "id",
                "avatar_url": "avatarURL",
                "html_url": "URL",
                "name": "username",
                'company': "company",
                "bio": "biography",
                "public_repos": "repos",
                'public_gists': "gists",
                'followers': "followers",
                'following': "following",
                'created_at': "createdAt",
                'updated_at': "updatedAt"
            }
            Object.keys(userElements).forEach(k => {
                if(res.data[k]) this[userElements[k]] = res.data[k]
            })

            this.exist = true
        }).catch(e => {
            console.log(e.response.data.message)
            this.exist = false
        })
    }

    exist(){
        return this.exist
    }
}

let u = new User("liam-en")
console.log(u.exist())