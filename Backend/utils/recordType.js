import net from "net"

const guessRecordType = (input) => {
    const cnameRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
    if(net.isIPv6(input)) return false
    if(net.isIPv4(input)) return "A";
    if(cnameRegex.test(input)) return "CNAME"
    return false
}

export default guessRecordType;