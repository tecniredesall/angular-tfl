const fs = require('fs');
const { execSync } = require("child_process");
const replace = require('replace-in-file');

let rawdata = fs.readFileSync('environments.json');
let environments = JSON.parse(rawdata);
let servers = [];
let envName = "";

if(process.argv.length > 2) {
    switch(process.argv[2]) {
        case 'staging':
            envName = "staging";
            servers = environments.staging;
            break;
        case 'production':
            envName = "production";
            servers = environments.production;
            break;
        case 'development':
            envName = "development";
            servers = environments.development;
            break;
        default:
            let e = `Environtment '${process.argv[2]}' are not configured.`;
            throw e;
    }
}

if(servers.length == 0){
    throw `Environtments ${envName} are not configured.`
}

servers.forEach(env => {
    const options = {
        files: 'src/environments/environment.ts',
        from: /LOCAL_API: '(.*)'/g,
        to: `LOCAL_API: '${env.uri}'`,
        allowEmptyPaths: false,
    };

    try {
        let changedFiles = replace.sync(options);
        if (changedFiles == 0) {
            throw "Please make sure that file 'environments.json exists'";
        }

        console.log(`build: ${env.output}`);
        execSync(`ng build --output-path ${env.output}`, {stdio: 'inherit'});
    } catch (error) {
        console.error('Error occurred:', error);
        throw error
    }
});
