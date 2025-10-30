import { spawn } from "child_process";

const addDomainBind = (dnsName,publicIp,recordType) => {
  return new Promise((resolve, reject) => {
    const nsupdate = spawn("nsupdate", ["-k", "/etc/bind/update.key"]);

    nsupdate.stdin.write("server 172.20.0.12\n");
    nsupdate.stdin.write("zone anthony.live.\n");
    nsupdate.stdin.write(
      `update add ${dnsName}.anthony.live. 3600 ${recordType} ${publicIp}\n`
    );
    nsupdate.stdin.write("send\n");
    nsupdate.stdin.end();

    let output = "";
    let errorOutput = ""; 

    nsupdate.stdout.on("data", (data) => {
      output += data.toString();
    });

    nsupdate.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    nsupdate.on("close", (code) => {
      if (code === 0) {
        resolve(true);  
      } else {
        console.error(`nsupdate failed with code ${code}`);
        console.error(`stderr: ${errorOutput}`);
        resolve(false);
      }
    });
  });
};

const deleteDomainBind = (dnsName,recordType) => {
  return new Promise((resolve,reject) => {
    const nsupdate = spawn("nsupdate", ["-k","/etc/bind/update.key"]);

    nsupdate.stdin.write("server 172.20.0.12\n");
    nsupdate.stdin.write("zone anthony.live.\n");
    nsupdate.stdin.write(`update delete ${dnsName}.anthony.live. ${recordType}\n`);
    nsupdate.stdin.write("send\n");
    nsupdate.stdin.end();

    let output = "";
    let errOutput = "";

    nsupdate.stdout.on("data", (data) => {
      output += data.toString();
    });

    nsupdate.stderr.on("data", (data) => {
      errOutput += data.toString();
    })

    nsupdate.on("close", (code) => {
      if(code === 0){
        console.log("Successfully deleted Greatness");
        resolve(true);
      }else{
        console.log(`nsupdate : failed with error code ${code}`);
        console.log("error : ",errOutput);
        resolve(false);
      }
    })
  })
}
const updateDomainBind = (dnsName,publicIp,recordType,oldRecordType) => {
  return new Promise((resolve,reject) => {
    const nsupdate = spawn("nsupdate", ["-k","/etc/bind/update.key"]);

    console.log("came here")
    nsupdate.stdin.write("server 172.20.0.12\n");
    nsupdate.stdin.write("zone anthony.live.\n");
    nsupdate.stdin.write(`update delete ${dnsName}.anthony.live. ${oldRecordType}\n`);
    nsupdate.stdin.write(`update add ${dnsName}.anthony.live. 3600 ${recordType} ${publicIp}\n`);
    nsupdate.stdin.write("send\n");
    nsupdate.stdin.end();

    let output = "";
    let errOutput = "";
    
    nsupdate.stdout.on("data", (data) =>{
      output = data.toString();
    })

    nsupdate.stderr.on("data", (data) => {
      errOutput = data.toString();
    })

    nsupdate.on("close", (code) => {
      if(code === 0){
        console.log("successfully updated");
        resolve(true)
      }else{
        console.log(`nsupdate failed with error code ${code}`);
        console.log("domain update error : ",errOutput);
        resolve(false)
      }
    })
  })
}

export { addDomainBind, deleteDomainBind, updateDomainBind };
