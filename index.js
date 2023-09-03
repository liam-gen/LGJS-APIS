const express = require('express')
const app = express()
const port = 3000

app.set('json spaces', 2)
app.use(express.static(__dirname + '/public'));

const {parse} = require("node-html-parser")

function humanFileSize(bytes, dp=1) {
    const thresh = 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/index.html")
})

app.get('/docs', (req, res) => {
    res.sendFile(__dirname+"/docs.html")
})

/* TOMACLOUD */

app.get('/api/tomacloud/:id', (req, res) => {
    let id = req.params.id;
    let base = "https://tomacloud.com/file"

    const https = require('https');

    https.get(base+"/"+id, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            const root = parse(data);

            let result = {};

            if(root.innerHTML.includes("The file you want is not available"))
            {
                result = {
                    "error": "The file you want is not available",
                    "code": "404"
                }
            }
            else
            {

                let direct_url = "";
                root.querySelectorAll('script').forEach(e => {
                    if(e.innerHTML.includes("jwplayer")){
                        direct_url = e.innerHTML.match(/\bhttps?:\/\/\S+/gi)[0].replace('"', "").replace("'", "")
                    }
                });

                let filemane = root.querySelector(".name_file").innerHTML.replace(/\n/g,"").replace(/\r/g,"").replaceAll(" ","")

                result = {
                    "filename": filemane,
                    "direct_url": direct_url,
                    "id": id
                }
                
            }

            res.json(result);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
})

/* PCLOUD */

app.get('/api/pcloud/:id', (req, res) => {
    let id = req.params.id;
    let base = "https://e.pcloud.link/publink/show?code="

    const https = require('https');

    https.get(base+id, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            const root = parse(data);

            let result = {};
            let rp = {}
                root.querySelectorAll('script').forEach(e => {
                    if(e.innerHTML.includes("publinkData")){
                        let temp = "let obLength=()=>{};let HFN = {dLink: {init: ()=>{}, loadData: ()=>{}}};const setcookie = ()=>{}";
                        console.log(eval(temp+e.innerHTML))
                        rp = publinkData
                    }
                });

                result = {
                    "name": rp["metadata"]["name"],
                    "direct_url": rp["downloadlink"],
                    "id": rp["metadata"]["id"],
                    "size": rp["metadata"]["size"],
                    "human_size": humanFileSize(rp["metadata"]["size"]),
                    "type": rp["metadata"]["contenttype"],
                    "modified": rp["metadata"]["modified"]
                }

            res.json(result);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
})

/* PROTON DRIVE */

app.get('/api/googledrive/:id', (req, res) => {
    let id = req.params.id;
    let base = "https://drive.google.com/file/d/"

    const https = require('https');

    https.get(base+id+"/view", (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            const root = parse(data);
            let window = {}

            root.querySelectorAll('script').forEach(e => {
                if(e.innerHTML.includes("window.viewerData")){
                    eval(e.innerHTML)
                }
            });

            let result = {
                "name": window["viewerData"]["config"]["title"],
                "id": window["viewerData"]["config"]["id"],
                "email": window["viewerData"]["itemJson"][window["viewerData"]["itemJson"].length - 1],
                "download_link": "https://drive.google.com/uc?id="+window["viewerData"]["config"]["id"]+"&export=download"
            };
            

            res.json(result);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})