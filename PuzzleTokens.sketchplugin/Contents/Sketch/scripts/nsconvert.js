var fs = require('fs');

const args = process.argv.slice(2)
var pathToLess1 = args[0]
var pathToLess2 = args[1]
var pathToJSON = args[2]

if(undefined==pathToLess1 || undefined==pathToLess2 ){
    console.log("nsconvert.js PATH_TO_LESS_FILE1 PATH_TO_LESS_FILE2(OPT) PATH_TO_JSON_FILE")
    return false
}
if(undefined == pathToJSON){
    pathToJSON = pathToLess2
    pathToLess2 = undefined
}

/*console.log("Path to source LESS:" +pathToLess1)
if(pathToLess2!=undefined)
    console.log("pathToLess2:" +pathToLess2)
console.log("Path to destination JSON:" +pathToJSON)
console.log("")*/

console.log("Started")

loadLessVars(pathToLess1,pathToLess2)    


function loadLessVars(fileName1,fileName2){
    console.log("Read LESS: running...")
    
    var less = require("/usr/local/lib/node_modules/less")   
    var lessVars = {}

    var data = ''
    const data1 = fs.readFileSync(fileName1, 'utf8');
    if(null==data1){
        console.log("Can't open file by path:"+fileName1)
        return lessVars
    }
    data = data + data1;
    if(fileName2!=undefined){
        data = data + fs.readFileSync(fileName2, 'utf8');
    }

    options1 = { 
        async: false,
        fileAsync: false
    }

    try {
        less.parse(data, options1, function (err, root, imports, options) {
            //console.log(imports)
            if(undefined!=err) console.log(err)
            
            var evalEnv = new less.contexts.Eval(options);
            var evaldRoot = root.eval(evalEnv);
            var ruleset = evaldRoot.rules;

            ruleset.forEach(function (rule) {            
                if (rule.variable === true) {                
                    var name;
                    name = rule.name.substr(1);					

                    var value = rule.value;
                    lessVars[name] = value.toCSS(options);				

                    console.log(name+" : "+value.toCSS(options))

                }
            });
            
            // completed
            saveData(lessVars,pathToJSON)
            console.log("Completed")
        });
    } catch ( e ) {
        console.log("Failed to parse LESS with error message:\n")
        console.log(e.message)
        process.exit(-1)
    }
    
    console.log("Read LESS: done")
    return lessVars
}

function saveData(data,pathToJSON){   
    var json = JSON.stringify(data,null,'    ')

    fs.writeFileSync(pathToJSON, json, 'utf8');

    return true
}




