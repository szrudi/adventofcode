const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processLineByLine() {
    const adventDay = path.basename(__filename).split(".")[0];
    const fileStream = fs.createReadStream(adventDay + '-input.txt');
    const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
    let data = [];
    let buffer = [];

    for await (const line of rl) {
        if (line !== "") {
            buffer.push(line);
            continue;
        }
        const passport = Object.fromEntries(buffer.join(" ").split(" ").map(e => e.split(":")));
        data.push(passport);
        buffer = [];
    }
    if (buffer.length !== 0) {
        data.push(buffer);
    }
    return data;
}

processLineByLine().then(passports => {
    let validPassports = 0;
    let invalidPassports = 0;
    const mandatoryFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
    const fieldValidators = {
        "byr": f => 1920 <= parseInt(f) && parseInt(f) <= 2002,
        "iyr": f => 2010 <= parseInt(f) && parseInt(f) <= 2020,
        "eyr": f => 2020 <= parseInt(f) && parseInt(f) <= 2030,
        "hgt": f => {
            const height = parseInt(f.slice(0, -2))
            if (f.endsWith("cm")) {
                return 150 <= height && height <= 193;
            }
            if (f.endsWith("in")) {
                return 59 <= height && height <= 76;
            }
            return false;
        },
        "hcl": f => f.match(/^#[a-f0-9]{6}$/),
        "ecl": f => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(f),
        "pid": f => f.match(/^[0-9]{9}$/),
        // "cid": f => true,
    };
    passports_check:
        for (let passport of passports) {
            for (let field of mandatoryFields) {
                if (!passport.hasOwnProperty(field)) {
                    console.log("missing field", field, passport);
                    invalidPassports++;
                    continue passports_check;
                }
                if (!fieldValidators[field](passport[field])) {
                    console.log("invalid value", field, passport[field]);
                    invalidPassports++;
                    continue passports_check;
                }
            }
            validPassports++;
        }
    console.log(validPassports);
    console.log(invalidPassports);
});
