import axios from "axios";


async function validateWebsite(req, res) {
    const rawUrl = req.query.publicip;
    console.log(rawUrl);

    // Regex: domain OR IPv4 OR IPv6 (with or without brackets)
    const isValidDomainOrIP = /^(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3}|\[?[a-fA-F0-9:]+\]?)$/.test(rawUrl);

    if (!isValidDomainOrIP) {
        return res.status(400).json({ message: "Invalid domain or IP format." });
    }

    // If IPv6 and not already bracketed, add brackets
    const isIPv6 = /^[a-fA-F0-9:]+$/.test(rawUrl); // basic IPv6 check
    const url = isIPv6 ? `[${rawUrl}]` : rawUrl;

    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp",
        "Referer": "https://google.com",
        "Connection": "keep-alive"
    };

    try {
        // Try HTTP
        await axios.get(`http://${url}`, {
            timeout: 5000,
            headers
        });

        return res.status(200).json({
            message: "You can create website with our domain name. Congrats!"
        });
    } catch (httpError) {
        try {
            // Try HTTPS fallback
            await axios.get(`https://${url}`, {
                timeout: 5000,
                headers
            });

            return res.status(200).json({
                message: "You can create website with our domain name. Congrats!"
            });
        } catch (httpsError) {
            return res.status(500).json({
                message: "Something went wrong. The site may be unreachable or blocking requests."
            });
        }
    }
}

export default validateWebsite;
