import bcrypt from "bcryptjs";

async function testBcrypt() {
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password:", password);
    console.log("Hashed:", hashedPassword);

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("Match:", isMatch);

    // Test with a known hash from the DB if possible
    // (I'll skip this for now as I don't have the string)
}

testBcrypt();
