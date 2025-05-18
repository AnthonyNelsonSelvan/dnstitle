import { spawn } from "child_process";

const addDomainBind = (dnsName,publicIp) => {
  return new Promise((resolve, reject) => {
    const nsupdate = spawn("nsupdate", ["-k", "/etc/bind/update.key"]);

    nsupdate.stdin.write("server 172.20.0.12\n");
    nsupdate.stdin.write("zone anthony.live.\n");
    nsupdate.stdin.write(
      `update add ${dnsName}.anthony.live. 3600 A ${publicIp}\n`
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
        console.log("✅ Domain added successfully!");
        resolve(true);  // ✅ Resolves the promise
      } else {
        console.error(`❌ nsupdate failed with code ${code}`);
        console.error(`stderr: ${errorOutput}`);
        resolve(false);
      }
    });
  });
};

export { addDomainBind };
