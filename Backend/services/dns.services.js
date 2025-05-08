import { spawn } from "child_process";

const addDomainBind = () => {
    const nsupdate = spawn("nsupdate", ["-y","hmac-sha256:mykey:lSi5pcEe1xImu6gUT0bQshah7IHyVvWDO/YlVFGTCp0=",])//this key should be in env

    nsupdate.stdin.write('server 172.20.0.12\n');
    nsupdate.stdin.write('zone test.local.\n');
    nsupdate.stdin.write('update add huh.test.local. 3600 A 172.21.0.11\n')
    nsupdate.stdin.write('send\n')
    nsupdate.stdin.end();

    nsupdate.stdout.on('data',(data) => {
        console.log(`stdout : ${data}`);
    });

    nsupdate.stderr.on('data',(data) => {
        console.log(`stderr, ${data}`);
    })

    nsupdate.on('close', (code) => {
        console.log(`exited with code ${code} `)
    })
}

export {addDomainBind}