import zxcvbn from "zxcvbn";

const checkPasswordStrength = (password : string) => {
    const result = zxcvbn(password);
    return {
        score : result.score,
    }
}

export default checkPasswordStrength;